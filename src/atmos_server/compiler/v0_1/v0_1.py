from __future__ import annotations

from typing import Any, TypeGuard

from atmos_server.compiler.types import (
    Artifact,
    InputRef,
    Plan,
    PlanMeta,
    Step,
)

from pathlib import Path
import xarray as xr

from atmos_server.compiler.v0_1.v0_1_build_render_from_encoding import build_render_from_encoding
from atmos_server.compiler.v0_1.v0_1_data_load import v0_1_load
from atmos_server.compiler.v0_1.v0_1_geometry_mesh_isoline_isoband import v0_1_geometry_mesh_isoline_isoband
from atmos_server.compiler.v0_1.v0_1_geometry_point import v0_1_geometry_point
from atmos_server.compiler.v0_1.v0_1_geometry_vector import v0_1_geometry_vector
from atmos_server.compiler.v0_1.v0_1_transform_derive_wind_vector import v0_1_transform_derive_wind_vector
from atmos_server.compiler.v0_1.v0_1_transform_diagnosticslp import v0_1_transform_diagnostixsslp
from atmos_server.compiler.v0_1.v0_1_transform_derive import v0_1_transform_derive

def _get_time_index_for_view(view: dict[str, Any], composition: dict[str, Any]) -> int | None:
    # view-scoped overrides composition-scoped
    t = view.get("time")
    if not isinstance(t, dict):
        t = composition.get("time")
    if not isinstance(t, dict):
        return None

    if t.get("type") != "index":
        return None

    v = t.get("value")
    if isinstance(v, int) and v >= 0:
        return v
    return None

def infer_repeat_data_id(spec: dict[str, Any], *, target_view: str, target_layer: str) -> str:
    """
    Infer the dataset/derived-data id to repeat over by looking at:
      composition.views[target_view].layers[target_layer].geometry.input.data
    Raises ValueError with a helpful message if it cannot infer.
    """
    composition = spec.get("composition") or {}
    views = composition.get("views") or []
    if not isinstance(views, list):
        raise ValueError("composition.views must be a list")

    view_obj: dict[str, Any] | None = None
    for v in views:
        if isinstance(v, dict) and v.get("id") == target_view:
            view_obj = v
            break
    if view_obj is None:
        raise ValueError(f"repeatView: targetView '{target_view}' not found")

    layers = view_obj.get("layers") or []
    if not isinstance(layers, list):
        raise ValueError(f"repeatView: view '{target_view}' layers must be a list")

    layer_obj: dict[str, Any] | None = None
    for lyr in layers:
        if isinstance(lyr, dict) and lyr.get("id") == target_layer:
            layer_obj = lyr
            break
    if layer_obj is None:
        raise ValueError(f"repeatView: targetLayer '{target_layer}' not found in view '{target_view}'")

    geom = layer_obj.get("geometry")
    if not isinstance(geom, dict):
        raise ValueError(f"repeatView: layer '{target_layer}' in view '{target_view}' is missing geometry")

    ginput = geom.get("input")
    if not isinstance(ginput, dict):
        raise ValueError(
            f"repeatView: layer '{target_layer}' in view '{target_view}' is missing geometry.input"
        )

    data_id = ginput.get("data")
    if not isinstance(data_id, str) or not data_id.strip():
        raise ValueError(
            f"repeatView: cannot infer dataset id; expected geometry.input.data "
            f"on layer '{target_layer}' in view '{target_view}'"
        )

    return data_id.strip()

def infer_time_len_for_data_id(
    data_by_id: dict[str, Any],
    repo_root: Path,
    *,
    data_id: str,
) -> int:
    """
    Open the NetCDF (metadata only) to infer time length.
    Uses the spec's dimensions.time.dim if present; otherwise falls back to Time/time.
    """
    d = data_by_id.get(data_id)
    if not isinstance(d, dict):
        raise ValueError(f"repeatView: data '{data_id}' not found in spec.data")

    source = d.get("source") or {}
    if not (isinstance(source, dict) and source.get("type") == "netcdf"):
        raise ValueError(
            f"repeatView: cannot infer timesteps for data '{data_id}' because it is not a netcdf source"
        )

    source_path = source.get("path")
    if not isinstance(source_path, str) or not source_path:
        raise ValueError(f"repeatView: netcdf source.path missing for data '{data_id}'")

    # Prefer declared time dim
    dims = d.get("dimensions") or {}
    time_spec = dims.get("time") if isinstance(dims, dict) else None
    declared_time_dim = time_spec.get("dim") if isinstance(time_spec, dict) else None

    p = Path(source_path)
    if not p.is_absolute():
        p = repo_root / source_path

    ds = xr.open_dataset(p)
    try:
        for cand in [declared_time_dim, "Time", "time"]:
            if isinstance(cand, str) and cand in ds.dims:
                return int(ds.sizes[cand])
        raise ValueError(f"repeatView: could not find a time dimension in dataset '{data_id}'")
    finally:
        ds.close()

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

    def _is_time_indexable_data(input_data: str) -> bool:
        if input_data in derived_data_to_step:
            return True  # derived outputs are DataObjects (time-indexable)

        d = data_by_id.get(input_data)
        if not isinstance(d, dict):
            return False

        src = d.get("source") or {}
        return isinstance(src, dict) and src.get("type") == "netcdf"

    def _infer_time_len_for_data(data_id: str) -> int | None:
        d = data_by_id.get(data_id)
        if not isinstance(d, dict):
            return None

        src = d.get("source")
        if not isinstance(src, dict) or src.get("type") != "netcdf":
            return None

        path = src.get("path")
        if not isinstance(path, str) or not path:
            return None

        dims = d.get("dimensions") or {}
        time_spec = dims.get("time") if isinstance(dims, dict) else None
        time_dim = None
        if isinstance(time_spec, dict):
            # your example uses {"dim":"Time"}
            time_dim = time_spec.get("dim")

        # fallback to common names
        if not isinstance(time_dim, str) or not time_dim:
            time_dim = "Time"

        # Resolve to repo-root relative path like step_load does
        from pathlib import Path
        import xarray as xr

        repo_root = Path(__file__).resolve().parents[3]
        p = Path(path)
        if not p.is_absolute():
            p = repo_root / path

        ds = xr.open_dataset(p)
        try:
            if time_dim in ds.dims:
                return int(ds.sizes[time_dim])
            if "time" in ds.dims:
                return int(ds.sizes["time"])
            if "Time" in ds.dims:
                return int(ds.sizes["Time"])
            return None
        finally:
            ds.close()

    meta = PlanMeta(schema_version=schema_version, spec_id=spec.get("id"))

    inputs: list[InputRef] = []
    steps: list[Step] = []
    artifacts: list[Artifact] = []

    derived_data_to_step: dict[str, str] = {}
    derived_data_to_base_data: dict[str, str] = {}

    # ---- Data -> load steps
    data_id_to_upstream_step: dict[str, str] = {}
    data_by_id: dict[str, dict[str, Any]] = {}

    def _var_id_to_key(data_id: str, var_id: str) -> str | None:
        d = data_by_id.get(data_id)
        if not isinstance(d, dict):
            return None
        vars_ = d.get("variables") or []
        if not isinstance(vars_, list):
            return None
        for vv in vars_:
            if isinstance(vv, dict) and vv.get("id") == var_id:
                k = vv.get("key")
                if isinstance(k, str) and k.strip():
                    return k.strip()
        return None

    v0_1_load(spec.get("data"), data_id_to_upstream_step, data_by_id, steps, _safe_id, inputs)

    # ---- Transforms (global, v0.1)
    transforms = spec.get("transform") or []
    transform_id_to_step: dict[str, str] = {}

    default_upstream_data_id = inputs[0].data_id if inputs else None
    default_upstream_step = data_id_to_upstream_step.get(default_upstream_data_id, "") if default_upstream_data_id else ""

    last_transform_step = default_upstream_step

    for i, t in enumerate(transforms):
        if not isinstance(t, dict):
            continue
        tid = f"t{i}"
        step_id = f"transform:{tid}"

        scope_data = t.get("data")
        if not isinstance(scope_data, str):
            tin = t.get("input")
            if isinstance(tin, dict) and isinstance(tin.get("data"), str):
                scope_data = tin.get("data")
        depends: list[str] = []

        if isinstance(scope_data, str) and scope_data in data_id_to_upstream_step:
            depends = [data_id_to_upstream_step[scope_data]]
        elif last_transform_step:
            depends = [last_transform_step]

        params = dict(t)

        across = params.get("across")
        if not isinstance(across, str) or not across:
            params["across"] = "space"

        if params.get("type") == "derive_wind_vector":

            v0_1_transform_derive_wind_vector(
                params, step_id, 
                derived_data_to_step, 
                derived_data_to_base_data,
                _var_id_to_key 
            )

        if params.get("type") == "diagnostic.slp":
            v0_1_transform_diagnostixsslp(params, step_id, derived_data_to_step, derived_data_to_base_data, _var_id_to_key)
            
        if params.get("type") == "derive":
            v0_1_transform_derive(params, step_id, derived_data_to_step, derived_data_to_base_data, _var_id_to_key)
            
        steps.append(
            Step(
                id=step_id,
                kind="transform",
                depends_on=tuple(depends),
                params=params,
            )
        )

        out = t.get("output")
        if isinstance(out, dict):
            out_data = out.get("data")
            if isinstance(out_data, str) and out_data:
                derived_data_to_step[out_data] = step_id

                base = t.get("data")
                if isinstance(base, str) and base:
                    derived_data_to_base_data[out_data] = base

        transform_id_to_step[tid] = step_id
        last_transform_step = step_id

    composition = spec.get("composition") or {}
    layout = composition.get("layout") or {}
    views = composition.get("views") or []

    # Build expanded views list
    expanded_views: list[dict[str, Any]] = []
    repeat_specs = layout.get("repeatView") or []

    # index repeats by targetView for quick lookup
    repeats_by_view: dict[str, list[dict[str, Any]]] = {}
    if isinstance(repeat_specs, list):
        for r in repeat_specs:
            if not isinstance(r, dict):
                continue
            tv = r.get("targetView")
            if isinstance(tv, str) and tv:
                repeats_by_view.setdefault(tv, []).append(r)

    for vi, view in enumerate(views):
        if not isinstance(view, dict):
            continue
        base_view_id = _safe_id("view", view.get("id"), vi)

        reps = repeats_by_view.get(base_view_id, [])
        if not reps:
            expanded_views.append(view)
            continue

        # For v0.1: support only one repeat spec per view (easy to relax later)
        r0 = reps[0]
        rtype = r0.get("type")
        if rtype != "timestep":
            expanded_views.append(view)
            continue

        target_layer_any = r0.get("targetLayer")
        if not isinstance(target_layer_any, str) or not target_layer_any.strip():
            raise ValueError(f"repeatView for '{base_view_id}' missing targetLayer")
        target_layer = target_layer_any.strip()

        data_id_any = r0.get("data")
        if isinstance(data_id_any, str) and data_id_any.strip():
            data_id = data_id_any.strip()
        else:
            data_id = infer_repeat_data_id(spec, target_view=base_view_id, target_layer=target_layer)

        indices = r0.get("indices")

        if not isinstance(data_id, str) or not data_id:
            raise ValueError(f"repeatView for '{base_view_id}' missing data (e.g. 'r001')")

        if indices is None:
            tlen = _infer_time_len_for_data(data_id)
            if tlen is None:
                raise ValueError(f"repeatView could not infer time length for data '{data_id}'")
            indices = list(range(tlen))
        elif not (isinstance(indices, list) and all(isinstance(x, int) for x in indices)):
            raise ValueError(f"repeatView.indices must be array[int] (view '{base_view_id}')")

        # Create a repeated view instance for each index
        for idx in indices:
            inst = dict(view)  # shallow copy ok; we’ll patch layers below
            inst_id = f"{base_view_id}__t{idx:03d}"
            inst["id"] = inst_id
            inst["_repeat"] = {"type": "timestep", "index": idx, "baseViewId": base_view_id}

            # annotate which layer is time-bound
            inst["_repeatTargetLayer"] = target_layer
            inst["_repeatDataId"] = data_id

            expanded_views.append(inst)

    # Use expanded_views downstream
    views = expanded_views

    # ---- Geometry from expanded views

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
                if isinstance(input_data, str):
                    if input_data in data_id_to_upstream_step:
                        upstream_step = data_id_to_upstream_step[input_data]
                    elif input_data in derived_data_to_step:
                        upstream_step = derived_data_to_step[input_data]

            # Determine repeat first
            repeat = view.get("_repeat")

            # ---- time selection (slider/static time) ----
            # Apply ONLY for non-repeat views
            if not isinstance(repeat, dict):
                time_idx = _get_time_index_for_view(view, composition)

                if isinstance(time_idx, int) and isinstance(ginput, dict):
                    input_data = ginput.get("data")
                    if isinstance(input_data, str) and _is_time_indexable_data(input_data):
                        tstep_id = f"transform:time:{view_id}:{layer_id}"
                        steps.append(Step(
                            id=tstep_id,
                            kind="transform",
                            depends_on=(upstream_step,) if upstream_step else (),
                            params={"type": "select_time_index", "index": time_idx},
                        ))
                        upstream_step = tstep_id

            # ---- repeat override (only for target layer) ----
            if isinstance(repeat, dict):
                target_layer = view.get("_repeatTargetLayer")
                repeat_data = view.get("_repeatDataId")
                idx = repeat.get("index")

                if layer_id == target_layer and isinstance(repeat_data, str) and isinstance(idx, int):
                    base_upstream = upstream_step
                    if not base_upstream:
                        raise ValueError(f"repeatView: unknown data '{repeat_data}'")

                    tstep_id = f"transform:repeat:{view_id}:{layer_id}:t{idx:03d}"
                    steps.append(
                        Step(
                            id=tstep_id,
                            kind="transform",
                            depends_on=(base_upstream,),
                            params={"type": "select_time_index", "index": idx},
                        )
                    )
                    upstream_step = tstep_id
            
            # Enrich mesh geometry with resolved NetCDF keys (var, lat, lon)
            geom_params = dict(geom)
            geom_params["_viewId"] = view_id
            geom_params["_layerId"] = layer_id

            if gtype in ("mesh", "isoband", "isoline") and isinstance(ginput, dict):
                v0_1_geometry_mesh_isoline_isoband(ginput, data_by_id, derived_data_to_base_data, derived_data_to_step, geom_params)

            if gtype == "vector":
                v0_1_geometry_vector(geom, derived_data_to_base_data, data_by_id, geom_params)

            if gtype == "point" and isinstance(ginput, dict):
                v0_1_geometry_point(ginput, data_by_id, geom_params)
            
            steps.append(
                Step(
                    id=geom_step_id,
                    kind="geometry",
                    depends_on=(upstream_step,) if upstream_step else (),
                    params=geom_params,
                )
            )

            # ---- Artifact + manifest metadata (now includes render info)
            out_name = f"{view_id}-{layer_id}"

            geom_dict: dict[str, Any] = geom  # after `if not isinstance(geom, dict): continue`
            encoding_any = geom_dict.get("encoding")
            encoding_dict: dict[str, Any] | None = encoding_any if isinstance(encoding_any, dict) else None
            render = build_render_from_encoding(gtype=gtype, encoding=encoding_dict)

            metadata: dict[str, Any] = {
                "geometryType": gtype,
                "viewId": view_id,
                "layerId": layer_id,
            }
            if render is not None:
                metadata["render"] = render

            if isinstance(view.get("_repeat"), dict):
                metadata["repeat"] = view["_repeat"]

            artifacts.append(
                Artifact(
                    id=f"artifact:{view_id}:{layer_id}",
                    format="geojson",  # type: ignore[assignment]
                    producer_step=geom_step_id,
                    path=f"{out_name}.geojson",
                    metadata=metadata,
                )
            )

    return Plan(
        meta=meta,
        inputs=tuple(inputs),
        steps=tuple(steps),
        artifacts=tuple(artifacts),
        raw_spec=spec,
    )