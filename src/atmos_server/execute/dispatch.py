from __future__ import annotations

import copy
import math
from pathlib import Path
from typing import Any, Sequence, Union, overload

from atmos_server.io.geojson import load_geojson
from atmos_server.io.netcdf import open_netcdf_handle
from atmos_server.plan.types import Step
from atmos_server.execute.context import ExecutionContext

from pathlib import Path
import xarray as xr

from atmos_server.data.model import DataObject

Number = Union[int, float]
NumberLike = Union[Number, str]  # allow strings like "3.2" if you want
VectorLike = Sequence[NumberLike]
ScalarOrVector = Union[NumberLike, VectorLike]


def _deg_0_360(rad: float) -> float:
    return (math.degrees(rad) + 360.0) % 360.0

def _to_float(x: NumberLike) -> float:
    return float(x)

def _is_vector(x: object) -> bool:
    # treat list/tuple as vector; avoid treating strings as sequences
    return isinstance(x, (list, tuple))

def _elemwise(u: ScalarOrVector, v: ScalarOrVector, fn) -> ScalarOrVector:
    """
    Apply fn(u,v) elementwise for scalars or list/tuple vectors.
    Keeps it dependency-free (no numpy).
    """
    if _is_vector(u) and _is_vector(v):
        uu = list(u)  # type: ignore[arg-type]
        vv = list(v)  # type: ignore[arg-type]
        if len(uu) != len(vv):
            raise ValueError("u and v must have same length for elementwise operation")
        return [fn(_to_float(a), _to_float(b)) for a, b in zip(uu, vv)]

    if _is_vector(u) != _is_vector(v):
        raise ValueError("u and v must both be scalars or both be vectors")

    # scalar fallback
    return fn(_to_float(u), _to_float(v))  # type: ignore[arg-type]

def _derive_wind_speed(u: ScalarOrVector, v: ScalarOrVector) -> ScalarOrVector:
    return _elemwise(u, v, lambda uu, vv: math.sqrt(uu * uu + vv * vv))

def _derive_wind_direction_math(u: ScalarOrVector, v: ScalarOrVector) -> ScalarOrVector:
    return _elemwise(u, v, lambda uu, vv: _deg_0_360(math.atan2(vv, uu)))

def _apply_geojson_feature_transform(
    fc: dict[str, Any],
    *,
    u_field: str,
    v_field: str,
    out_field: str,
    compute_fn,
) -> dict[str, Any]:
    if fc.get("type") != "FeatureCollection":
        raise ValueError("Expected GeoJSON FeatureCollection")

    out = copy.deepcopy(fc)
    feats = out.get("features")
    if not isinstance(feats, list):
        raise ValueError("GeoJSON FeatureCollection.features must be a list")

    for feat in feats:
        if not isinstance(feat, dict):
            continue
        props = feat.get("properties")
        if not isinstance(props, dict):
            props = {}
            feat["properties"] = props

        if u_field not in props or v_field not in props:
            # permissive: skip features missing u/v
            continue

        props[out_field] = compute_fn(props[u_field], props[v_field])

    return out

def execute_step(step: Step, *, repo_root: Path, ctx: ExecutionContext | None = None) -> Any:
    """
    Execute a single step.

    Supported now:
      - kind=load with source.type=geojson
      - kind=transform for derive_wind_speed / derive_wind_direction on GeoJSON upstream
    """
    if step.kind == "load":
        source = (step.params or {}).get("source") or {}
        if not isinstance(source, dict):
            raise TypeError(f"Invalid source for step {step.id}: expected object, got {type(source)}")

        source_type = source.get("type")
        source_path = source.get("path")

        if source_type == "geojson":
            if not isinstance(source_path, str) or not source_path:
                raise ValueError(f"GeoJSON source.path missing/invalid for step {step.id}")

            p = Path(source_path)
            if not p.is_absolute():
                p = repo_root / source_path

            return load_geojson(p)
        
        if source_type == "netcdf":
            if not isinstance(source_path, str) or not source_path:
                raise ValueError(f"NetCDF source.path missing/invalid for step {step.id}")

            p = Path(source_path)
            if not p.is_absolute():
                p = repo_root / source_path

            engine = source.get("engine")
            if engine is not None and not isinstance(engine, str):
                raise ValueError(f"NetCDF source.engine must be a string if provided (step {step.id})")

            if not p.exists():
                raise FileNotFoundError(f"NetCDF not found: {p}")

            ds = xr.open_dataset(p, engine=engine)
            data_id = step.id.split(":", 1)[1]

            return DataObject(id=data_id, dataset=ds)

        raise NotImplementedError(f"Unsupported source type '{source_type}' in step {step.id}")

    if step.kind == "transform":
        if ctx is None:
            raise RuntimeError("Transform execution requires an ExecutionContext")

        t = step.params or {}
        ttype = t.get("type")

        # Determine upstream (v0.1: single upstream step expected)
        if not step.depends_on:
            raise ValueError(f"Transform step '{step.id}' has no depends_on")
        upstream_step = step.depends_on[-1]  # last dependency is the current input
        upstream_obj = ctx.get(upstream_step)

        # ---- xarray/DataObject transforms (start) ----
        if isinstance(upstream_obj, DataObject):
            if ttype == "select_time_index":
                idx = t.get("index")
                if not isinstance(idx, int) or idx < 0:
                    raise ValueError(
                        f"select_time_index: 'index' must be a non-negative int (step {step.id})"
                    )

                ds = upstream_obj.dataset

                # Minimal: common time dim names (we’ll wire to schema dimensions later)
                if "Time" in ds.dims:
                    time_dim = "Time"
                elif "time" in ds.dims:
                    time_dim = "time"
                else:
                    # Nothing to slice; keep dataset as-is
                    return upstream_obj

                if idx >= ds.sizes[time_dim]:
                    raise IndexError(
                        f"select_time_index: index {idx} out of bounds for dim '{time_dim}' "
                        f"(size={ds.sizes[time_dim]}) (step {step.id})"
                    )

                ds2 = ds.isel({time_dim: idx})
                return DataObject(id=upstream_obj.id, dataset=ds2)

            raise NotImplementedError(
                f"Transform '{ttype}' not implemented for xarray DataObject in step {step.id}"
            )
        # ---- xarray/DataObject transforms (end) ----

        if isinstance(upstream_obj, dict) and upstream_obj.get("type") == "FeatureCollection":
            u_field = t.get("u")
            v_field = t.get("v")
            as_obj = t.get("as") or {}
            out_field = as_obj.get("id")

            if not isinstance(u_field, str) or not isinstance(v_field, str):
                raise ValueError(f"{ttype}: 'u' and 'v' must be strings")
            if not isinstance(out_field, str) or not out_field:
                raise ValueError(f"{ttype}: 'as.id' must be a non-empty string")

            if ttype == "derive_wind_speed":
                return _apply_geojson_feature_transform(
                    upstream_obj, u_field=u_field, v_field=v_field, out_field=out_field, compute_fn=_derive_wind_speed
                )

            if ttype == "derive_wind_direction":
                return _apply_geojson_feature_transform(
                    upstream_obj,
                    u_field=u_field,
                    v_field=v_field,
                    out_field=out_field,
                    compute_fn=_derive_wind_direction_math,
                )

            raise NotImplementedError(f"Unsupported transform type '{ttype}' for GeoJSON in step {step.id}")

        # For NetCDF/xarray later:
        raise NotImplementedError(f"Transform '{ttype}' not implemented for upstream type in step {step.id}")

    # geometry etc later
    return None
