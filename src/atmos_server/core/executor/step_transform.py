from atmos_server.core.shared.models import DataObject
from atmos_server.core.compiler.models import Step

from atmos_server.core.executor.context import ExecutionContext

from typing import Any, Sequence, Union

import math
import copy
import numpy as np
import pandas as pd

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


def execute_step_transform(step: Step, ctx: ExecutionContext | None = None):
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

        if ttype == "derive_wind_vector":
            resolved = t.get("_resolved") or {}
            if not isinstance(resolved, dict):
                resolved = {}

            # keys for U/V in the *upstream* dataset (resolved by compiler)
            u_key = resolved.get("uKey")
            v_key = resolved.get("vKey")

            output = t.get("output") or {}
            if not isinstance(output, dict):
                raise ValueError(f"derive_wind_vector requires 'output' object (step {step.id})")

            out_data = output.get("data")
            out_vars = output.get("variables") or []
            if not isinstance(out_data, str) or not out_data:
                raise ValueError(f"derive_wind_vector requires output.data (step {step.id})")
            if not (isinstance(out_vars, list) and out_vars and isinstance(out_vars[0], dict)):
                raise ValueError(f"derive_wind_vector requires output.variables[0] (step {step.id})")

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

            if not isinstance(u_key, str) or not u_key:
                raise ValueError(f"derive_wind_vector missing resolved uKey (step {step.id})")
            if not isinstance(v_key, str) or not v_key:
                raise ValueError(f"derive_wind_vector missing resolved vKey (step {step.id})")

            ds = upstream_obj.dataset
            if u_key not in ds or v_key not in ds:
                raise KeyError(
                    f"derive_wind_vector missing u/v in dataset: u='{u_key}' v='{v_key}' (step {step.id})"
                )

            u = ds[u_key]
            v = ds[v_key]

            # speed
            speed = np.sqrt(u * u + v * v)

            # meteorological direction (clockwise from north):
            # dir_from = (270 - atan2(v, u) * 180/pi) % 360
            dir_from = (270.0 - np.degrees(np.arctan2(v, u))) % 360.0
            if direction_convention == "to":
                direction = (dir_from + 180.0) % 360.0
            else:
                direction = dir_from

            speed_key = f"{out_var_id}.speed"
            dir_key = f"{out_var_id}.direction"

            # keep coords, dims, etc. easiest: copy ds and add vars
            ds2 = ds.copy()
            ds2[speed_key] = speed
            ds2[dir_key] = direction

            return DataObject(id=out_data, dataset=ds2)
        
        if ttype == "diagnostic.slp":
            resolved = t.get("_resolved") or {}
            if not isinstance(resolved, dict):
                resolved = {}

            # Prefer resolved NetCDF keys; fall back to common WRF names
            ps_key = resolved.get("surfacePressureKey") or "PSFC"
            t2_key = resolved.get("airTemperature2mKey") or "T2"
            r_key  = resolved.get("waterVaporMixingRatio2mKey") or "Q2"

            hgt_key  = resolved.get("surfaceHeightKey")          # e.g., "HGT"
            phis_key = resolved.get("surfaceGeopotentialKey")    # optional alternative

            if not isinstance(ps_key, str) or not ps_key:
                raise ValueError(f"diagnostic.slp: missing surfacePressureKey (step {step.id})")
            if not isinstance(t2_key, str) or not t2_key:
                raise ValueError(f"diagnostic.slp: missing airTemperature2mKey (step {step.id})")
            if not isinstance(r_key, str) or not r_key:
                raise ValueError(f"diagnostic.slp: missing waterVaporMixingRatio2mKey (step {step.id})")

            ds = upstream_obj.dataset
            if ps_key not in ds or t2_key not in ds or r_key not in ds:
                raise KeyError(
                    f"diagnostic.slp: variables not found in dataset "
                    f"(ps={ps_key}, t2={t2_key}, r={r_key}) (step {step.id})"
                )

            psfc = ds[ps_key]   # Pa
            t2   = ds[t2_key]   # K
            r2   = ds[r_key]    # kg/kg (WRF mixing ratio)

            # Height (m): prefer height, else geopotential / g
            if isinstance(hgt_key, str) and hgt_key in ds:
                z = ds[hgt_key]
            elif isinstance(phis_key, str) and phis_key in ds:
                z = ds[phis_key] / 9.80665
            else:
                raise KeyError(
                    f"diagnostic.slp: need surfaceHeightKey or surfaceGeopotentialKey (step {step.id})"
                )

            # Convert mixing ratio r -> specific humidity q
            q = r2 / (1.0 + r2)

            # Virtual temperature
            Tv = t2 * (1.0 + 0.61 * q)

            # Simple hydrostatic reduction
            g = 9.80665
            Rd = 287.05
            psl_pa = psfc * np.exp((g * z) / (Rd * Tv))

            # Output spec
            out = t.get("output") or {}
            if not isinstance(out, dict):
                raise ValueError(f"diagnostic.slp: output must be object (step {step.id})")

            out_data_id_any = out.get("data")
            
            if not isinstance(out_data_id_any, str) or not out_data_id_any:
                raise ValueError("output.data required")
            out_data_id: str = out_data_id_any

            out_vars = out.get("variables")

            if not isinstance(out_data_id, str) or not out_data_id:
                raise ValueError(f"diagnostic.slp: output.data required (step {step.id})")

            out_var_id = "slp"
            out_units = "Pa"
            if isinstance(out_vars, list) and out_vars and isinstance(out_vars[0], dict):
                if isinstance(out_vars[0].get("id"), str) and out_vars[0]["id"]:
                    out_var_id = out_vars[0]["id"]
                if isinstance(out_vars[0].get("units"), str) and out_vars[0]["units"]:
                    out_units = out_vars[0]["units"]

            if out_units.lower() == "hpa":
                psl = psl_pa / 100.0
            else:
                psl = psl_pa

            ds2 = ds.assign({out_var_id: psl})

            # IMPORTANT: return derived dataset id so downstream can reference it
            return DataObject(id=out_data_id, dataset=ds2)
        
        if ttype == "derive":
            ds = upstream_obj.dataset

            expr = t.get("expression")
            if not isinstance(expr, dict):
                raise ValueError(f"derive: expression must be an object (step {step.id})")

            op = expr.get("op")
            args = expr.get("args")
            if not isinstance(args, list) or not args:
                raise ValueError(f"derive: expression.args must be a non-empty array (step {step.id})")

            if op != "add":
                raise NotImplementedError(f"derive: op '{op}' not supported")

            resolved = t.get("_resolved") or {}
            if not isinstance(resolved, dict):
                resolved = {}
            var_map = resolved.get("varKeyById") or {}
            if not isinstance(var_map, dict):
                var_map = {}

            def eval_node(node):
                if not isinstance(node, dict):
                    raise ValueError(f"derive: expression nodes must be objects (step {step.id})")

                if "variable" in node:
                    var_id = node["variable"]
                    if not isinstance(var_id, str) or not var_id:
                        raise ValueError(f"derive: variable must be a non-empty string (step {step.id})")

                    key = var_map.get(var_id, var_id)  # ✅ use mapping from compiler
                    if key not in ds:
                        raise KeyError(f"Variable '{var_id}' (key='{key}') not found in dataset (step {step.id})")

                    return ds[key]

                raise NotImplementedError("Only variable nodes supported for now")

            values = [eval_node(a) for a in args]

            result = values[0]
            for v in values[1:]:
                result = result + v

            # output
            out = t.get("output") or {}
            if not isinstance(out, dict):
                raise ValueError(f"derive: output must be an object (step {step.id})")

            out_data = out.get("data")
            if not isinstance(out_data, str) or not out_data:
                raise ValueError(f"derive: output.data must be a non-empty string (step {step.id})")

            out_vars = out.get("variables") or []
            if not (isinstance(out_vars, list) and out_vars and isinstance(out_vars[0], dict)):
                raise ValueError(f"derive: output.variables[0] required (step {step.id})")

            out_var_id = out_vars[0].get("id")
            if not isinstance(out_var_id, str) or not out_var_id:
                raise ValueError(f"derive: output.variables[0].id must be a non-empty string (step {step.id})")

            result = result.assign_attrs(ds[var_map.get("rainnc","rainnc")].attrs)
            ds2 = ds.copy()
            ds2[out_var_id] = result

            return DataObject(id=out_data, dataset=ds2)
        
        if ttype == "reduce":
            ds = upstream_obj.dataset

            resolved = t.get("_resolved") or {}
            var_key = resolved.get("varKey")
            dim = resolved.get("dim")

            if not var_key or var_key not in ds:
                raise KeyError(f"reduce: variable '{var_key}' not found (step {step.id})")

            if not dim or dim not in ds.dims:
                raise KeyError(f"reduce: dimension '{dim}' not found (step {step.id})")

            op = t.get("op")

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
                raise NotImplementedError(f"reduce op '{op}' not supported")

            # output
            out = t.get("output") or {}
            out_data = out.get("data")
            out_vars = out.get("variables") or []

            out_var_id = out_vars[0]["id"]

            ds2 = ds.copy()
            ds2[out_var_id] = reduced

            out_data_id_any = out.get("data")
            if not isinstance(out_data_id_any, str) or not out_data_id_any:
                raise ValueError("output.data required")

            out_data_id: str = out_data_id_any

            return DataObject(id=out_data_id, dataset=ds2)
        
        raise NotImplementedError(
            f"Transform '{ttype}' not implemented for xarray DataObject in step {step.id}"
        )
    # ---- xarray/DataObject transforms (end) ----

    # ---- pandas/DataFrame transforms (start) ----
    elif isinstance(upstream_obj, pd.DataFrame):
        if ttype == "select_time_index":
            idx = t.get("index")
            if not isinstance(idx, int) or idx < 0:
                raise ValueError(f"select_time_index: 'index' must be a non-negative int (step {step.id})")

            resolved = t.get("_resolved") or {}
            time_key = resolved.get("timeKey")
            if not isinstance(time_key, str) or time_key not in upstream_obj.columns:
                return upstream_obj

            col = upstream_obj[time_key]
            times = pd.Series(col.dropna().unique()).sort_values(kind="mergesort").to_list()
            if idx >= len(times):
                raise IndexError(
                    f"select_time_index: index {idx} out of bounds for time values (n={len(times)}) (step {step.id})"
                )

            tval = times[idx]
            return upstream_obj[upstream_obj[time_key] == tval]
    # ---- pandas/DataFrame transforms (end) ----

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

    
    raise NotImplementedError(f"Transform '{ttype}' not implemented for upstream type in step {step.id}")