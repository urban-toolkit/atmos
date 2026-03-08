from __future__ import annotations

from typing import Any

import matplotlib
matplotlib.use("Agg")

from atmos_server.core.compiler.models import Step
from atmos_server.core.executor.context import ExecutionContext
from atmos_server.core.shared.models import DataObject

from atmos_server.core.executor.geometry_converters import (
    _levels_from_spec,
    _midpoint_of_linestring,
    _mesh_to_geojson,
    _isoband_to_geojson,
    _isoline_to_geojson,
    _vector_to_geojson,
    _points_to_geojson_table,
)


# -------------------------------------------------------------------
# Small shared helpers
# -------------------------------------------------------------------

def _sampling_dict(g: dict[str, Any]) -> dict[str, Any]:
    sampling = g.get("sampling") or {}
    return sampling if isinstance(sampling, dict) else {}

def _resolved_dict(g: dict[str, Any]) -> dict[str, Any]:
    resolved = g.get("_resolved")
    return resolved if isinstance(resolved, dict) else {}


def _require_str(value: Any, *, name: str, step_id: str) -> str:
    if not isinstance(value, str) or not value:
        raise ValueError(f"{name} must be a non-empty string (step {step_id})")
    return value


def _require_feature_collection(obj: Any, *, step_id: str, gtype: str) -> dict[str, Any]:
    if not (isinstance(obj, dict) and obj.get("type") == "FeatureCollection"):
        raise TypeError(f"{gtype} geometry expects GeoJSON FeatureCollection upstream (step {step_id})")
    return obj


def _require_data_object(obj: Any, *, step_id: str, gtype: str) -> DataObject:
    if not isinstance(obj, DataObject):
        raise TypeError(f"{gtype} geometry expects DataObject upstream (step {step_id})")
    return obj


def _require_lat_lon_keys(resolved: dict[str, Any], *, step_id: str) -> tuple[str, str]:
    lat_key = _require_str(resolved.get("latKey"), name="latKey", step_id=step_id)
    lon_key = _require_str(resolved.get("lonKey"), name="lonKey", step_id=step_id)
    return lat_key, lon_key


def _require_variable_key_and_id(resolved: dict[str, Any], *, step_id: str) -> tuple[str, str]:
    var_key = _require_str(resolved.get("variableKey"), name="variableKey", step_id=step_id)
    var_id = resolved.get("variableId") or "value"
    return var_key, str(var_id)


def _first_build_dict(g: dict[str, Any]) -> dict[str, Any]:
    build = g.get("build")
    if isinstance(build, list) and build and isinstance(build[0], dict):
        return build[0]
    return {}


def _encoding_style_dict(g: dict[str, Any]) -> dict[str, Any]:
    enc = g.get("encoding") or {}
    if not isinstance(enc, dict):
        return {}
    style = enc.get("style") or {}
    return style if isinstance(style, dict) else {}


def _levels_from_geometry_spec(g: dict[str, Any]) -> list[float] | None:
    # 1 — direct geometry.levels
    levels_obj = g.get("levels")

    # 2 — geometry.build[*].levels
    if levels_obj is None:
        build = g.get("build")
        if isinstance(build, list):
            for item in build:
                if isinstance(item, dict):
                    if "levels" in item:
                        levels_obj = item["levels"]
                        break

                    # support build patterns like {"type":"levels", ...}
                    if item.get("type") == "levels":
                        levels_obj = item
                        break

    if levels_obj is None:
        return None

    return _levels_from_spec(levels_obj)




# -------------------------------------------------------------------
# Existing conversion helpers stay as they are:
#   _mesh_to_geojson(...)
#   _isoband_to_geojson(...)
#   _isoline_to_geojson(...)
#   _vector_to_geojson(...)
#   _points_to_geojson_table(...)
#   _levels_from_spec(...)
#   _midpoint_of_linestring(...)
# -------------------------------------------------------------------


# -------------------------------------------------------------------
# Per-geometry execution helpers
# -------------------------------------------------------------------

def _execute_polygon_geometry(step: Step, upstream_obj: Any) -> dict[str, Any]:
    return _require_feature_collection(upstream_obj, step_id=step.id, gtype="polygon")


def _execute_mesh_geometry(step: Step, g: dict[str, Any], upstream_obj: Any) -> dict[str, Any]:
    upstream = _require_data_object(upstream_obj, step_id=step.id, gtype="mesh")
    resolved = _resolved_dict(g)

    var_key, var_id = _require_variable_key_and_id(resolved, step_id=step.id)
    lat_key, lon_key = _require_lat_lon_keys(resolved, step_id=step.id)

    build0 = _first_build_dict(g)

    target_cells = build0.get("targetCells", 100000)
    cell_footprint = build0.get("cellFootprint", 1.0)

    try:
        target_cells = int(target_cells)
    except Exception:
        target_cells = 5000
    if target_cells < 1:
        target_cells = 1

    try:
        cell_footprint = float(cell_footprint)
    except Exception:
        cell_footprint = 1.0
    if cell_footprint < 0:
        cell_footprint = 0.0
    if cell_footprint > 1:
        cell_footprint = 1.0

    return _mesh_to_geojson(
        upstream.dataset,
        var_key=var_key,
        lat_key=lat_key,
        lon_key=lon_key,
        out_field=var_id,
        target_cells=target_cells,
        footprint=cell_footprint,
    )


def _execute_isoband_geometry(step: Step, g: dict[str, Any], upstream_obj: Any) -> dict[str, Any]:
    upstream = _require_data_object(upstream_obj, step_id=step.id, gtype="isoband")
    resolved = _resolved_dict(g)

    levels = _levels_from_geometry_spec(g)
    if not levels or len(levels) < 2:
        raise ValueError("isoband requires explicit levels (need at least 2)")

    var_key, var_id = _require_variable_key_and_id(resolved, step_id=step.id)
    lat_key, lon_key = _require_lat_lon_keys(resolved, step_id=step.id)

    ds = upstream.dataset
    print("geometry dims =", ds.dims)
    print("geometry var dims =", ds[var_key].dims)

    return _isoband_to_geojson(
        upstream.dataset,
        var_key=var_key,
        lat_key=lat_key,
        lon_key=lon_key,
        levels=levels,
        out_field=var_id,
    )


def _execute_isoline_geometry(step: Step, g: dict[str, Any], upstream_obj: Any) -> dict[str, Any]:
    upstream = _require_data_object(upstream_obj, step_id=step.id, gtype="isoline")
    resolved = _resolved_dict(g)

    levels = _levels_from_geometry_spec(g)
    if not levels or len(levels) < 1:
        raise ValueError("isoline requires levels (need at least 1)")

    var_key, var_id = _require_variable_key_and_id(resolved, step_id=step.id)
    lat_key, lon_key = _require_lat_lon_keys(resolved, step_id=step.id)

    style = _encoding_style_dict(g)
    label_cfg = style.get("label") or {}
    if not isinstance(label_cfg, dict):
        label_cfg = {}

    labels_enabled = bool(label_cfg.get("enabled", False))
    fmt = label_cfg.get("format", ".0f")
    if not isinstance(fmt, str) or not fmt:
        fmt = ".0f"

    lines_fc = _isoline_to_geojson(
        upstream.dataset,
        var_key=var_key,
        lat_key=lat_key,
        lon_key=lon_key,
        levels=levels,
        out_field=var_id,
    )

    if not labels_enabled:
        return lines_fc

    label_features: list[dict[str, Any]] = []
    for feat in lines_fc.get("features", []):
        if not isinstance(feat, dict):
            continue
        geom = feat.get("geometry") or {}
        if not isinstance(geom, dict) or geom.get("type") != "LineString":
            continue
        coords = geom.get("coordinates")
        if not isinstance(coords, list) or len(coords) < 2:
            continue

        mid = _midpoint_of_linestring(coords)
        if mid is None:
            continue

        props = feat.get("properties") or {}
        lvl = props.get(var_id)
        if not isinstance(lvl, (int, float)):
            continue

        try:
            label_txt = format(float(lvl), fmt)
        except Exception:
            label_txt = str(lvl)

        label_features.append(
            {
                "type": "Feature",
                "properties": {"value": float(lvl), "label": label_txt},
                "geometry": {"type": "Point", "coordinates": mid},
            }
        )

    labels_fc = {"type": "FeatureCollection", "features": label_features}
    return {"lines": lines_fc, "labels": labels_fc}


def _execute_vector_geometry(step: Step, g: dict[str, Any], upstream_obj: Any) -> dict[str, Any]:
    upstream = _require_data_object(upstream_obj, step_id=step.id, gtype="vector")
    resolved = _resolved_dict(g)

    lat_key, lon_key = _require_lat_lon_keys(resolved, step_id=step.id)
    speed_key = _require_str(resolved.get("speedKey"), name="speedKey", step_id=step.id)
    direction_key = _require_str(resolved.get("directionKey"), name="directionKey", step_id=step.id)
    var_id = str(resolved.get("variableId") or "wind")

    sampling = _sampling_dict(g)
    skip = sampling.get("skip", 0)
    if not isinstance(skip, int):
        try:
            skip = int(skip)
        except Exception:
            skip = 0 
    if skip < 0:
        skip = 0

    return _vector_to_geojson(
        upstream.dataset,
        lat_key=lat_key,
        lon_key=lon_key,
        speed_key=speed_key,
        direction_key=direction_key,
        out_var_id=var_id,
        skip=skip,
    )


def _execute_point_geometry(step: Step, g: dict[str, Any], upstream_obj: Any) -> dict[str, Any]:
    resolved = _resolved_dict(g)

    lat_key, lon_key = _require_lat_lon_keys(resolved, step_id=step.id)
    var_key = resolved.get("variableKey")
    var_id = str(resolved.get("variableId") or "value")

    extra: list[str] = []
    site_key = resolved.get("siteKey")
    time_key = resolved.get("timeKey")
    if isinstance(site_key, str):
        extra.append(site_key)
    if isinstance(time_key, str):
        extra.append(time_key)

    return _points_to_geojson_table(
        upstream_obj,
        lat_key=lat_key,
        lon_key=lon_key,
        value_key=var_key if isinstance(var_key, str) and var_key else None,
        out_field=var_id,
        extra_props=extra,
    )


# -------------------------------------------------------------------
# Public dispatcher
# -------------------------------------------------------------------

def execute_step_geometry(step: Step, ctx: ExecutionContext | None = None):
    if ctx is None:
        raise RuntimeError("Geometry execution requires an ExecutionContext")

    g = step.params or {}
    gtype = g.get("type")

    if not step.depends_on:
        raise ValueError(f"Geometry step '{step.id}' has no depends_on")

    upstream_step = step.depends_on[-1]
    upstream_obj = ctx.get(upstream_step)

    if gtype == "polygon":
        return _execute_polygon_geometry(step, upstream_obj)

    if gtype == "mesh":
        return _execute_mesh_geometry(step, g, upstream_obj)

    if gtype == "isoband":
        return _execute_isoband_geometry(step, g, upstream_obj)

    if gtype == "isoline":
        return _execute_isoline_geometry(step, g, upstream_obj)

    if gtype == "vector":
        return _execute_vector_geometry(step, g, upstream_obj)

    if gtype == "point":
        return _execute_point_geometry(step, g, upstream_obj)

    raise NotImplementedError(f"Unsupported geometry type '{gtype}' in step {step.id}")