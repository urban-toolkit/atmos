from __future__ import annotations

from typing import Any, Sequence, Union, Callable
import copy
import math

import numpy as np
import pandas as pd

from atmos_server.core.compiler.models import Step
from atmos_server.core.executor.context import ExecutionContext
from atmos_server.core.shared.models import DataObject


Number = Union[int, float]
NumberLike = Union[Number, str]
VectorLike = Sequence[NumberLike]
ScalarOrVector = Union[NumberLike, VectorLike]


# ============================================================
# Generic helpers
# ============================================================

def _resolved_dict(t: dict[str, Any]) -> dict[str, Any]:
    resolved = t.get("_resolved")
    return resolved if isinstance(resolved, dict) else {}


def _require_transform_upstream(step: Step, ctx: ExecutionContext) -> Any:
    if not step.depends_on:
        raise ValueError(f"Transform step '{step.id}' has no depends_on")
    upstream_step = step.depends_on[-1]
    return ctx.get(upstream_step)


def _require_output_data_and_var_id(
    t: dict[str, Any],
    *,
    step_id: str,
    transform_name: str,
) -> tuple[str, str]:

    out = t.get("out")
    if not isinstance(out, dict):
        raise ValueError(f"{transform_name}: out must be an object (step {step_id})")

    out_data = out.get("data")
    if not isinstance(out_data, str) or not out_data:
        raise ValueError(f"{transform_name}: out.data must be a non-empty string (step {step_id})")

    out_var = out.get("var")
    if not isinstance(out_var, str) or not out_var:
        raise ValueError(f"{transform_name}: out.var must be a non-empty string (step {step_id})")

    return out_data, out_var

def _first_input_attrs(values: list[Any]) -> dict[str, Any]:
    for v in values:
        attrs = getattr(v, "attrs", None)
        if isinstance(attrs, dict):
            return dict(attrs)
    return {}


# ============================================================
# GeoJSON helpers
# ============================================================

def _deg_0_360(rad: float) -> float:
    return (math.degrees(rad) + 360.0) % 360.0


def _to_float(x: NumberLike) -> float:
    return float(x)


def _is_vector(x: object) -> bool:
    return isinstance(x, (list, tuple))


def _elemwise(u: ScalarOrVector, v: ScalarOrVector, fn: Callable[[float, float], float]) -> ScalarOrVector:
    if _is_vector(u) and _is_vector(v):
        uu = list(u)  # type: ignore[arg-type]
        vv = list(v)  # type: ignore[arg-type]
        if len(uu) != len(vv):
            raise ValueError("u and v must have same length for elementwise operation")
        return [fn(_to_float(a), _to_float(b)) for a, b in zip(uu, vv)]

    if _is_vector(u) != _is_vector(v):
        raise ValueError("u and v must both be scalars or both be vectors")

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
    compute_fn: Callable[[ScalarOrVector, ScalarOrVector], ScalarOrVector],
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
            continue

        props[out_field] = compute_fn(props[u_field], props[v_field])

    return out


# ============================================================
# Public entrypoint
# ============================================================

def execute_step_transform(step: Step, ctx: ExecutionContext | None = None):
    if ctx is None:
        raise RuntimeError("Transform execution requires an ExecutionContext")

    t = step.params or {}
    ttype = t.get("type")
    upstream_obj = _require_transform_upstream(step, ctx)

    if isinstance(upstream_obj, DataObject):
        return _execute_dataobject_transform(step, t, upstream_obj)

    if isinstance(upstream_obj, pd.DataFrame):
        return _execute_dataframe_transform(step, t, upstream_obj)

    if isinstance(upstream_obj, dict) and upstream_obj.get("type") == "FeatureCollection":
        return _execute_geojson_transform(step, t, upstream_obj)

    raise NotImplementedError(
        f"Transform '{ttype}' not implemented for upstream type in step {step.id}"
    )


# ============================================================
# DataObject/xarray branch
# ============================================================

def _execute_dataobject_transform(step: Step, t: dict[str, Any], upstream_obj: DataObject) -> DataObject:
    ttype = t.get("type")

    if ttype == "select_time_index":
        return _transform_dataobject_select_time_index(step, t, upstream_obj)

    if ttype == "select_member_index":
        return _transform_dataobject_select_member_index(step, t, upstream_obj)

    if ttype == "derive_wind_vector":
        return _transform_dataobject_derive_wind_vector(step, t, upstream_obj)

    if ttype == "diagnostic.slp":
        return _transform_dataobject_diagnostic_slp(step, t, upstream_obj)

    if ttype == "derive":
        return _transform_dataobject_derive(step, t, upstream_obj)

    if ttype == "reduce":
        return _transform_dataobject_reduce(step, t, upstream_obj)

    raise NotImplementedError(
        f"Transform '{ttype}' not implemented for xarray DataObject in step {step.id}"
    )


def _transform_dataobject_select_time_index(
    step: Step,
    t: dict[str, Any],
    upstream_obj: DataObject,
) -> DataObject:
    idx = t.get("index")
    if not isinstance(idx, int) or idx < 0:
        raise ValueError(f"select_time_index: 'index' must be a non-negative int (step {step.id})")

    ds = upstream_obj.dataset

    if "Time" in ds.dims:
        time_dim = "Time"
    elif "time" in ds.dims:
        time_dim = "time"
    else:
        return upstream_obj

    if idx >= ds.sizes[time_dim]:
        raise IndexError(
            f"select_time_index: index {idx} out of bounds for dim '{time_dim}' "
            f"(size={ds.sizes[time_dim]}) (step {step.id})"
        )

    ds2 = ds.isel({time_dim: idx})
    print("select_time_index idx =", idx)
    print("before time select dims =", ds.dims)
    print("after time select dims =", ds2.dims)

    return DataObject(id=upstream_obj.id, dataset=ds2)

def _transform_dataobject_select_member_index(
    step: Step,
    t: dict[str, Any],
    upstream_obj: DataObject,
) -> DataObject:
    idx = t.get("index")
    if not isinstance(idx, int) or idx < 0:
        raise ValueError(
            f"select_member_index: 'index' must be a non-negative int (step {step.id})"
        )

    ds = upstream_obj.dataset

    if "member" not in ds.dims:
        return upstream_obj

    if idx >= ds.sizes["member"]:
        raise IndexError(
            f"select_member_index: index {idx} out of bounds for dim 'member' "
            f"(size={ds.sizes['member']}) (step {step.id})"
        )

    ds2 = ds.isel(member=idx)
    print("select_member_index idx =", idx)
    print("before member select dims =", ds.dims)
    print("after member select dims =", ds2.dims)

    print("member idx =", idx)
    for name in ["RAINNC", "RAINC", "accRain"]:
        if name in ds2:
            da = ds2[name]
            print(
                name,
                "min=", float(da.min().item()),
                "max=", float(da.max().item()),
                "sample00=", float(da.isel(south_north=0, west_east=0).item()),
            )

    return DataObject(id=upstream_obj.id, dataset=ds2)

def _transform_dataobject_derive_wind_vector(
    step: Step,
    t: dict[str, Any],
    upstream_obj: DataObject,
) -> DataObject:
    resolved = _resolved_dict(t)
    u_key = resolved.get("uKey")
    v_key = resolved.get("vKey")

    out = t.get("out") or {}
    if not isinstance(out, dict):
        raise ValueError(f"derive_wind_vector requires 'output' object (step {step.id})")

    out_data, out_var_id = _require_output_data_and_var_id(
        t,
        step_id=step.id,
        transform_name="derive_wind_vector",
    )

    out_vars = out.get("vars") or []
    v0 = out_vars[0]

    v0 = out_vars[0]
    out_var_id = v0.get("id")
    if not isinstance(out_var_id, str) or not out_var_id:
        raise ValueError(f"derive_wind_vector requires output.variables[0].id (step {step.id})")

    direction_convention = v0.get("directionConvention", "from")
    direction_reference = v0.get("directionReference", "north_clockwise")
    direction_units = v0.get("directionUnits", "deg")

    if direction_reference != "north_clockwise":
        raise NotImplementedError(
            f"derive_wind_vector currently supports directionReference='north_clockwise' only "
            f"(got {direction_reference}) (step {step.id})"
        )
    if direction_units != "deg":
        raise NotImplementedError(
            f"derive_wind_vector currently outputs degrees only (got {direction_units}) (step {step.id})"
        )
    if direction_convention not in ("from", "to"):
        raise NotImplementedError(
            f"derive_wind_vector currently supports directionConvention 'from' or 'to' only "
            f"(got {direction_convention}) (step {step.id})"
        )

    if not isinstance(u_key, str) or not u_key:
        raise ValueError(f"derive_wind_vector missing resolved uKey (step {step.id})")
    if not isinstance(v_key, str) or not v_key:
        raise ValueError(f"derive_wind_vector missing resolved vKey (step {step.id})")

    ds = upstream_obj.dataset
    if u_key not in ds or v_key not in ds:
        raise KeyError(f"derive_wind_vector: upstream variables '{u_key}'/'{v_key}' not found (step {step.id})")

    u = ds[u_key]
    v = ds[v_key]

    # Meteorological direction from U/V, north_clockwise.
    # "from" means direction wind is coming from.
    # "to" means direction wind is going to.
    
    # compute direction
    direction_from = (270.0 - np.degrees(np.arctan2(v, u))) % 360.0
    direction = direction_from if direction_convention == "from" else (direction_from + 180.0) % 360.0

    # compute speed
    speed = np.sqrt(u * u + v * v)

    ds2 = ds.copy()

    speed_key = f"{out_var_id}.speed"
    dir_key = f"{out_var_id}.direction"

    ds2[speed_key] = speed
    ds2[dir_key] = direction

    return DataObject(id=out_data, dataset=ds2)

def _transform_dataobject_diagnostic_slp(
    step: Step,
    t: dict[str, Any],
    upstream_obj: DataObject,
) -> DataObject:
    resolved = _resolved_dict(t)

    psfc_key = resolved.get("surfacePressureKey")
    t2_key = resolved.get("airTemperature2mKey")
    q2_key = resolved.get("waterVaporMixingRatio2mKey")
    hgt_key = resolved.get("surfaceHeightKey")
    geop_key = resolved.get("surfaceGeopotentialKey")

    out_data, out_var_id = _require_output_data_and_var_id(
        t,
        step_id=step.id,
        transform_name="diagnostic.slp",
    )

    ds = upstream_obj.dataset

    if not isinstance(psfc_key, str) or psfc_key not in ds:
        raise KeyError(f"diagnostic.slp: surfacePressureKey missing or not found (step {step.id})")
    if not isinstance(t2_key, str) or t2_key not in ds:
        raise KeyError(f"diagnostic.slp: airTemperature2mKey missing or not found (step {step.id})")
    if not isinstance(q2_key, str) or q2_key not in ds:
        raise KeyError(f"diagnostic.slp: waterVaporMixingRatio2mKey missing or not found (step {step.id})")

    if isinstance(hgt_key, str) and hgt_key in ds:
        z = ds[hgt_key]
    elif isinstance(geop_key, str) and geop_key in ds:
        z = ds[geop_key] / 9.80665
    else:
        raise KeyError(
            f"diagnostic.slp: need surfaceHeightKey or surfaceGeopotentialKey in upstream dataset (step {step.id})"
        )

    psfc = ds[psfc_key]
    t2 = ds[t2_key]
    q2 = ds[q2_key]

    tv = t2 * (1.0 + 0.61 * q2)
    slp = psfc * np.exp((9.80665 * z) / (287.05 * tv))
    slp = slp.assign_attrs({"units": "Pa"})

    ds2 = ds.copy()
    ds2[out_var_id] = slp
    return DataObject(id=out_data, dataset=ds2)

def _diagnostic_slp_eval(values):
    psfc, t2, q2, z = values

    tv = t2 * (1.0 + 0.61 * q2)
    slp = psfc * np.exp((9.80665 * z) / (287.05 * tv))
    return slp

def _transform_dataobject_derive(
    step: Step,
    t: dict[str, Any],
    upstream_obj: DataObject,
) -> DataObject:
    ds = upstream_obj.dataset
    resolved = _resolved_dict(t)
    var_map = resolved.get("varMap")
    if not isinstance(var_map, dict):
        var_map = {}

    expr = t.get("expr") or {}
    if not isinstance(expr, dict):
        raise ValueError(f"derive: expr must be an object (step {step.id})")

    def _diagnostic_wind_polar_eval(values):
        u, v = values

        direction_from = (270.0 - np.degrees(np.arctan2(v, u))) % 360.0
        speed = np.sqrt(u * u + v * v)

        return speed, direction_from
    
    op = expr.get("op")

    if op == "diagnostic.wind.polar":
        resolved = _resolved_dict(t)
        u_key = resolved.get("uKey")
        v_key = resolved.get("vKey")

        if not isinstance(u_key, str) or not isinstance(v_key, str):
            raise ValueError(f"diagnostic.wind.polar: missing resolved u/v keys (step {step.id})")

        if u_key not in ds or v_key not in ds:
            raise KeyError(f"diagnostic.wind.polar: upstream variables not found (step {step.id})")

        u = ds[u_key]
        v = ds[v_key]

        speed = np.sqrt(u * u + v * v)
        direction = (270.0 - np.degrees(np.arctan2(v, u))) % 360.0

        out_data, out_var_id = _require_output_data_and_var_id(
            t,
            step_id=step.id,
            transform_name="diagnostic.wind.polar",
        )

        ds2 = ds.copy()
        ds2[f"{out_var_id}.speed"] = speed
        ds2[f"{out_var_id}.direction"] = direction

        return DataObject(id=out_data, dataset=ds2)
    
        
    def eval_node(node: Any) -> tuple[Any, list[Any]]:
        if not isinstance(node, dict):
            raise ValueError(f"derive: invalid expression node {node!r} (step {step.id})")

        if "const" in node:
            return node["const"], []

        if "var" in node:
            var_id = node["var"]

            key = var_map.get(var_id)
            if not isinstance(key, str) or not key:
                raise KeyError(
                    f"derive: variable '{var_id}' was not resolved by compiler (step {step.id})"
                )

            if key not in ds:
                raise KeyError(
                    f"derive: resolved dataset variable '{key}' not found for '{var_id}' (step {step.id})"
                )

            da = ds[key]
            return da, [da]

        if "op" in node:
            op = node["op"]
            args = node.get("args", [])

            if not isinstance(args, list) or not args:
                raise ValueError(f"derive: expression.args must be a non-empty list (step {step.id})")

            evaluated = [eval_node(a) for a in args]
            values = [v for v, _sources in evaluated]

            sources: list[Any] = []
            for _value, srcs in evaluated:
                sources.extend(srcs)

            if op == "diagnostic.slp":
                result = _diagnostic_slp_eval(values)
                return result, sources
            
            elif op == "add":
                result = values[0]
                for v in values[1:]:
                    result = result + v
                return result, sources

            elif op == "sub":
                result = values[0]
                for v in values[1:]:
                    result = result - v
                return result, sources

            elif op == "mul":
                result = values[0]
                for v in values[1:]:
                    result = result * v
                return result, sources

            elif op == "div":
                result = values[0]
                for v in values[1:]:
                    result = result / v
                return result, sources
            
            elif op == "pow":
                result = values[0] ** values[1]

            elif op == "min":
                result = np.minimum(values[0], values[1])

            elif op == "max":
                result = np.maximum(values[0], values[1])

            elif op == "abs":
                result = np.abs(values[0])

            elif op == "sqrt":
                result = np.sqrt(values[0])

            elif op == "log":
                result = np.log(values[0])

            elif op == "exp":
                result = np.exp(values[0])

            elif op == "atan2":
                result = np.arctan2(values[0], values[1])

            elif op == "mod":
                result = values[0] % values[1]

            raise NotImplementedError(f"derive: op '{op}' not supported yet (step {step.id})")

        raise NotImplementedError(
            f"derive: unsupported expression node {node!r} (step {step.id})"
        )

    result, sources = eval_node(expr)
    print("derive result dims =", result.dims)
    print("derive result shape =", result.shape)

    attrs = _first_input_attrs(sources)
    if attrs and hasattr(result, "assign_attrs"):
        result = result.assign_attrs(attrs)

    out_data, out_var_id = _require_output_data_and_var_id(
        t,
        step_id=step.id,
        transform_name="derive",
    )

    ds2 = ds.copy()
    ds2[out_var_id] = result
    return DataObject(id=out_data, dataset=ds2)


def _transform_dataobject_reduce(
    step: Step,
    t: dict[str, Any],
    upstream_obj: DataObject,
) -> DataObject:
    ds = upstream_obj.dataset
    resolved = _resolved_dict(t)
    var_key = resolved.get("varKey")
    dim = resolved.get("dim")

    if not isinstance(var_key, str) or var_key not in ds:
        raise KeyError(f"reduce: variable '{var_key}' not found (step {step.id})")
    if not isinstance(dim, str) or dim not in ds.dims:
        raise KeyError(f"reduce: dimension '{dim}' not found (step {step.id})")

    expr = t.get("expr") or {}
    if not isinstance(expr, dict):
        raise ValueError(f"reduce: expr must be an object (step {step.id})")

    op = expr.get("op")
    if not isinstance(op, str) or not op:
        raise ValueError(f"reduce: expr.op must be a non-empty string (step {step.id})")
    
    da = ds[var_key]

    if op == "mean":
        reduced = da.mean(dim=dim, skipna=True)
    elif op == "sum":
        reduced = da.sum(dim=dim, skipna=True)
    elif op == "min":
        reduced = da.min(dim=dim, skipna=True)
    elif op == "max":
        reduced = da.max(dim=dim, skipna=True)
    elif op == "std":
        reduced = da.std(dim=dim, skipna=True)
    elif op == "var":
        reduced = da.var(dim=dim, skipna=True)
    elif op == "count":
        reduced = da.count(dim=dim)
    else:
        raise NotImplementedError(f"reduce op '{op}' not supported (step {step.id})")

    out_data, out_var_id = _require_output_data_and_var_id(
        t,
        step_id=step.id,
        transform_name="reduce",
    )

    ds2 = ds.copy()
    ds2[out_var_id] = reduced
    return DataObject(id=out_data, dataset=ds2)


# ============================================================
# DataFrame branch
# ============================================================

def _execute_dataframe_transform(
    step: Step,
    t: dict[str, Any],
    upstream_obj: pd.DataFrame,
) -> pd.DataFrame:
    ttype = t.get("type")

    if ttype == "select_time_index":
        idx = t.get("index")
        if not isinstance(idx, int) or idx < 0:
            raise ValueError(f"select_time_index: 'index' must be a non-negative int (step {step.id})")

        resolved = _resolved_dict(t)
        time_key = resolved.get("timeKey")
        if not isinstance(time_key, str) or time_key not in upstream_obj.columns:
            return upstream_obj

        col = upstream_obj[time_key]
        times = pd.Series(col.dropna().unique()).sort_values(kind="mergesort").to_list()
        if idx >= len(times):
            raise IndexError(
                f"select_time_index: index {idx} out of bounds for time values "
                f"(n={len(times)}) (step {step.id})"
            )

        tval = times[idx]
        return upstream_obj[upstream_obj[time_key] == tval]

    raise NotImplementedError(
        f"Transform '{ttype}' not implemented for pandas DataFrame in step {step.id}"
    )


# ============================================================
# GeoJSON branch
# ============================================================

def _execute_geojson_transform(
    step: Step,
    t: dict[str, Any],
    upstream_obj: dict[str, Any],
) -> dict[str, Any]:
    ttype = t.get("type")

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
            upstream_obj,
            u_field=u_field,
            v_field=v_field,
            out_field=out_field,
            compute_fn=_derive_wind_speed,
        )

    if ttype == "derive_wind_direction":
        return _apply_geojson_feature_transform(
            upstream_obj,
            u_field=u_field,
            v_field=v_field,
            out_field=out_field,
            compute_fn=_derive_wind_direction_math,
        )

    raise NotImplementedError(
        f"Unsupported transform type '{ttype}' for GeoJSON in step {step.id}"
    )