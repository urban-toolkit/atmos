# atmos_server/compiler/v0_1/transforms.py
from __future__ import annotations
from typing import Any

from atmos_server.core.compiler.models import Step
from .context import CompileContext
from .ids import safe_id

def compile_transform_steps(ctx: CompileContext) -> None:
    transforms = ctx.spec.get("transform") or []
    if not isinstance(transforms, list):
        raise ValueError("spec.transform must be a list")

    last_transform_step = ctx.default_upstream_step

    for i, t in enumerate(transforms):
        if not isinstance(t, dict):
            continue

        tid = safe_id("t", t.get("id"), i)
        step_id = f"transform:{tid}"

        depends = _depends_for_transform(ctx, t, last_transform_step)
        params = dict(t)

        _enrich_transform_params(ctx, params, step_id)
        ctx.steps.append(Step(id=step_id, kind="transform", depends_on=tuple(depends), params=params))

        _track_derived_output(ctx, t, step_id, params=params)

        last_transform_step = step_id


def _depends_for_transform(ctx: CompileContext, t: dict[str, Any], last_transform_step: str) -> list[str]:
    scope_data = t.get("data")
    if not isinstance(scope_data, str):
        tin = t.get("input")
        if isinstance(tin, dict) and isinstance(tin.get("data"), str):
            scope_data = tin.get("data")

    if isinstance(scope_data, str) and scope_data in ctx.data_id_to_upstream_step:
        return [ctx.data_id_to_upstream_step[scope_data]]
    if last_transform_step:
        return [last_transform_step]
    return []


def _var_id_to_key(ctx: CompileContext, data_id: str, var_id: str) -> str | None:
    d = ctx.data_by_id.get(data_id)
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


def _infer_base_data_id_from_transform(t: dict[str, Any], params: dict[str, Any]) -> str | None:
    # prefer normalized params["data"] if present
    base = params.get("data")
    if isinstance(base, str) and base:
        return base
    base = t.get("data")
    if isinstance(base, str) and base:
        return base
    tin = t.get("input")
    if isinstance(tin, dict) and isinstance(tin.get("data"), str) and tin["data"]:
        return tin["data"]
    return None


def _track_derived_output(ctx: CompileContext, t: dict[str, Any], step_id: str, *, params: dict[str, Any]) -> None:
    out = t.get("output")
    if not isinstance(out, dict):
        return
    out_data = out.get("data")
    if not isinstance(out_data, str) or not out_data:
        return

    ctx.derived_data_to_step[out_data] = step_id

    base = _infer_base_data_id_from_transform(t, params)
    if isinstance(base, str) and base:
        ctx.derived_data_to_base_data[out_data] = base


def _enrich_transform_params(ctx: CompileContext, params: dict[str, Any], step_id: str) -> None:
    ttype = params.get("type")

    if ttype == "derive_wind_vector":
        _enrich_derive_wind_vector(ctx, params)
        return

    if ttype == "diagnostic.slp":
        _enrich_diagnostic_slp(ctx, params)
        return

    if ttype == "derive":
        _enrich_generic_derive(ctx, params)
        return


def _enrich_derive_wind_vector(ctx: CompileContext, params: dict[str, Any]) -> None:
    tin = params.get("input") or {}
    if not isinstance(tin, dict):
        raise ValueError("derive_wind_vector requires input object")

    base_data = tin.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("derive_wind_vector requires input.data")

    vars_map = tin.get("variables") or {}
    if not isinstance(vars_map, dict):
        raise ValueError("derive_wind_vector requires input.variables object")

    u_id = vars_map.get("u")
    v_id = vars_map.get("v")
    if not isinstance(u_id, str) or not isinstance(v_id, str):
        raise ValueError("derive_wind_vector requires input.variables.u and .v (ids)")

    u_key = _var_id_to_key(ctx, base_data, u_id)
    v_key = _var_id_to_key(ctx, base_data, v_id)
    if not u_key or not v_key:
        raise ValueError(f"derive_wind_vector could not resolve keys for u='{u_id}' v='{v_id}'")

    resolved = dict(params.get("_resolved") or {})
    resolved["uKey"] = u_key
    resolved["vKey"] = v_key
    params["_resolved"] = resolved


def _enrich_diagnostic_slp(ctx: CompileContext, params: dict[str, Any]) -> None:
    inp = params.get("input") or {}
    if not isinstance(inp, dict):
        raise ValueError("diagnostic.slp input must be an object")

    base_data = inp.get("data")
    if not isinstance(base_data, str) or not base_data:
        base_data = params.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("diagnostic.slp requires input.data (or legacy transform.data)")

    # normalize so downstream uses params["data"]
    params["data"] = base_data

    resolved: dict[str, Any] = {}
    for role, key_name in [
        ("surfacePressure", "surfacePressureKey"),
        ("airTemperature2m", "airTemperature2mKey"),
        ("waterVaporMixingRatio2m", "waterVaporMixingRatio2mKey"),
        ("surfaceHeight", "surfaceHeightKey"),
        ("surfaceGeopotential", "surfaceGeopotentialKey"),
    ]:
        var_id = inp.get(role)
        if isinstance(var_id, str):
            k = _var_id_to_key(ctx, base_data, var_id)
            if k:
                resolved[key_name] = k

    params["_resolved"] = resolved


def _enrich_generic_derive(ctx: CompileContext, params: dict[str, Any]) -> None:
    tin = params.get("input") or {}
    if not isinstance(tin, dict):
        raise ValueError("derive requires input object")

    base_data = tin.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("derive requires input.data")

    expr = params.get("expression") or {}
    if not isinstance(expr, dict):
        return

    resolved = dict(params.get("_resolved") or {})
    var_map = dict(resolved.get("varMap") or {})

    def _walk(node: Any) -> None:
        if not isinstance(node, dict):
            return

        if "variable" in node and isinstance(node["variable"], str):
            var_id = node["variable"]
            k = _var_id_to_key(ctx, base_data, var_id)
            if k:
                var_map[var_id] = k

        args = node.get("args")
        if isinstance(args, list):
            for a in args:
                _walk(a)

    _walk(expr)
    resolved["varMap"] = var_map
    params["_resolved"] = resolved