from __future__ import annotations

from typing import Any

from atmos_server.plan.types import (
    Artifact,
    InputRef,
    Plan,
    PlanMeta,
    Step,
)


def _safe_id(prefix: str, raw: Any, fallback_i: int) -> str:
    if isinstance(raw, str) and raw.strip():
        return raw.strip()
    return f"{prefix}{fallback_i}"


def compile_v0_1(spec: dict[str, Any], schema_version: str) -> Plan:
    """
    Compiler for Atmos schema v0.1.

    Produces a stable Plan(IR) that the executor can run without caring
    about the original spec version.
    """

    meta = PlanMeta(schema_version=schema_version, spec_id=spec.get("id"))

    inputs: list[InputRef] = []
    steps: list[Step] = []
    artifacts: list[Artifact] = []

    # ---- Data -> load steps
    data_items = spec.get("data") or []
    data_id_to_upstream_step: dict[str, str] = {}
    data_by_id: dict[str, dict[str, Any]] = {}

    for i, d in enumerate(data_items):
        if not isinstance(d, dict):
            continue
        data_id = _safe_id("data_", d.get("id"), i)
        inputs.append(InputRef(data_id=data_id))
        data_by_id[data_id] = d

        step_id = f"load:{data_id}"
        data_id_to_upstream_step[data_id] = step_id

        steps.append(
            Step(
                id=step_id,
                kind="load",
                depends_on=(),
                params={
                    "dataId": data_id,
                    "source": d.get("source"),
                    "dimensions": d.get("dimensions"),
                    "variables": d.get("variables"),
                },
            )
        )

        # Inject default time slicing for NetCDF (Option A: always index 0)
        source = d.get("source") or {}
        if isinstance(source, dict) and source.get("type") == "netcdf":
            time_step_id = f"time:{data_id}"
            steps.append(
                Step(
                    id=time_step_id,
                    kind="transform",
                    depends_on=(step_id,),
                    params={"type": "select_time_index", "index": 0},
                )
            )
            data_id_to_upstream_step[data_id] = time_step_id

    # ---- Transforms (global, v0.1)
    transforms = spec.get("transform") or []
    transform_id_to_step: dict[str, str] = {}

    default_upstream_data_id = inputs[0].data_id if inputs else None
    default_upstream_step = data_id_to_upstream_step.get(default_upstream_data_id, "") if default_upstream_data_id else ""

    last_transform_step = default_upstream_step

    for i, t in enumerate(transforms):
        if not isinstance(t, dict):
            continue
        tid = _safe_id("t", t.get("id"), i)
        step_id = f"transform:{tid}"

        upstream = t.get("input")
        depends: list[str] = []
        if isinstance(upstream, str) and upstream in data_id_to_upstream_step:
            depends = [data_id_to_upstream_step[upstream]]
        elif isinstance(upstream, str) and upstream in transform_id_to_step:
            depends = [transform_id_to_step[upstream]]
        elif last_transform_step:
            depends = [last_transform_step]

        steps.append(
            Step(
                id=step_id,
                kind="transform",
                depends_on=tuple(depends),
                params=t,
            )
        )

        transform_id_to_step[tid] = step_id
        last_transform_step = step_id


    # ---- Geometry from composition/views/layers (v0.1 examples)
    composition = spec.get("composition") or {}
    views = composition.get("views") or []

    for vi, view in enumerate(views):
      if not isinstance(view, dict):
          continue
      view_id = _safe_id("view", view.get("id"), vi)

      layers = view.get("layers") or []
      for li, layer in enumerate(layers):
          if not isinstance(layer, dict):
              continue
          layer_id = _safe_id("layer", layer.get("id"), li)

          geom = layer.get("geometry")
          if not isinstance(geom, dict):
              continue

          gtype = geom.get("type") or "unknown"
          geom_step_id = f"geometry:{view_id}:{layer_id}"

          # Resolve upstream by geometry.input.data (if provided)
          ginput = geom.get("input") or {}
          upstream_step = default_upstream_step
          if isinstance(ginput, dict):
              input_data = ginput.get("data")
              if isinstance(input_data, str) and input_data in data_id_to_upstream_step:
                  upstream_step = data_id_to_upstream_step[input_data]

          # Enrich mesh geometry with resolved NetCDF keys (var, lat, lon)
          geom_params = dict(geom)
          geom_params["_viewId"] = view_id
          geom_params["_layerId"] = layer_id

          if gtype == "mesh" and isinstance(ginput, dict):
              input_data = ginput.get("data")
              input_var = ginput.get("variable")

              if isinstance(input_data, str) and input_data in data_by_id:
                  d = data_by_id[input_data]
                  dims = d.get("dimensions") or {}
                  lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
                  lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

                  var_key = None
                  vars_ = d.get("variables") or []
                  if isinstance(input_var, str) and isinstance(vars_, list):
                      for vv in vars_:
                          if isinstance(vv, dict) and vv.get("id") == input_var:
                              var_key = vv.get("key")
                              break

                  geom_params["_resolved"] = {
                      "dataId": input_data,
                      "variableId": input_var,
                      "variableKey": var_key,
                      "latKey": lat_key,
                      "lonKey": lon_key,
                  }

          steps.append(
              Step(
                  id=geom_step_id,
                  kind="geometry",
                  depends_on=(upstream_step,) if upstream_step else (),
                  params=geom_params,
              )
          )

          # For prototype: always GeoJSON outputs for mesh/polygon
          out_name = f"{view_id}-{layer_id}"
          artifacts.append(
              Artifact(
                  id=f"artifact:{view_id}:{layer_id}",
                  format="geojson",  # type: ignore[assignment]
                  producer_step=geom_step_id,
                  path=f"{out_name}.geojson",
                  metadata={"geometryType": gtype, "viewId": view_id, "layerId": layer_id},
              )
          )

    return Plan(
        meta=meta,
        inputs=tuple(inputs),
        steps=tuple(steps),
        artifacts=tuple(artifacts),
        raw_spec=spec,
    )