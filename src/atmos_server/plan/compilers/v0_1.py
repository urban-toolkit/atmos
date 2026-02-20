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
    data_id_to_load_step: dict[str, str] = {}

    for i, d in enumerate(data_items):
        if not isinstance(d, dict):
            continue
        data_id = _safe_id("data_", d.get("id"), i)
        inputs.append(InputRef(data_id=data_id))

        step_id = f"load:{data_id}"
        data_id_to_load_step[data_id] = step_id

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

    # ---- Transforms (global, v0.1)
    transforms = spec.get("transform") or []
    transform_id_to_step: dict[str, str] = {}

    default_upstream_data_id = inputs[0].data_id if inputs else None
    default_upstream_step = data_id_to_load_step.get(default_upstream_data_id, "") if default_upstream_data_id else ""

    last_transform_step = default_upstream_step

    for i, t in enumerate(transforms):
        if not isinstance(t, dict):
            continue
        tid = _safe_id("t", t.get("id"), i)
        step_id = f"transform:{tid}"

        upstream = t.get("input")
        depends: list[str] = []
        if isinstance(upstream, str) and upstream in data_id_to_load_step:
            depends = [data_id_to_load_step[upstream]]
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

    # ---- Geometry -> artifact declarations
    geometries = spec.get("geometry") or []
    upstream_for_geometry = last_transform_step or (steps[0].id if steps else "")

    for i, g in enumerate(geometries):
        if not isinstance(g, dict):
            continue

        gid = _safe_id("g", g.get("id"), i)
        gtype = g.get("type") or "unknown"

        geom_step_id = f"geometry:{gid}"
        steps.append(
            Step(
                id=geom_step_id,
                kind="geometry",
                depends_on=(upstream_for_geometry,) if upstream_for_geometry else (),
                params=g,
            )
        )

        default_format = "geojson" if gtype in {"isoline", "isoband", "points", "polygons"} else "json"
        artifacts.append(
            Artifact(
                id=f"artifact:{gid}",
                format=default_format,  # type: ignore[assignment]
                producer_step=geom_step_id,
                path=f"{gid}.{default_format}",
                metadata={"geometryType": gtype},
            )
        )

    return Plan(
        meta=meta,
        inputs=tuple(inputs),
        steps=tuple(steps),
        artifacts=tuple(artifacts),
        raw_spec=spec,
    )