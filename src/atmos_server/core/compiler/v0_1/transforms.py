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
    vars_ = d.get("vars") or []
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
    out = t.get("out")
    if not isinstance(out, dict):
        return

    out_data = out.get("data")
    out_var = out.get("var")
    if not isinstance(out_data, str) or not out_data:
        return
    if not isinstance(out_var, str) or not out_var:
        return

    ctx.derived_data_to_step[out_data] = step_id

    base = _infer_base_data_id_from_transform(t, params)
    if isinstance(base, str) and base:
        ctx.derived_data_to_base_data[out_data] = base

        base_spec = ctx.data_by_id.get(base)
        if isinstance(base_spec, dict):
            ctx.data_by_id[out_data] = {
                **base_spec,
                "id": out_data,
                "vars": [{"id": out_var, "key": out_var}],
            }


def _enrich_diagnostic_wind_polar(ctx: CompileContext, params: dict[str, Any]) -> None:
    expr = params.get("expr") or {}
    args = expr.get("args") or []

    base_data = None
    resolved: dict[str, Any] = {}

    role_map = {
        "u": "uKey",
        "v": "vKey",
    }

    for a in args:
        if not isinstance(a, dict):
            continue

        data_id = a.get("data")
        var_id = a.get("var")
        role = a.get("role")

        if not isinstance(data_id, str) or not isinstance(var_id, str):
            continue

        if base_data is None:
            base_data = data_id

        key = _var_id_to_key(ctx, data_id, var_id)
        if key and role in role_map:
            resolved[role_map[role]] = key

    if not isinstance(base_data, str):
        raise ValueError("diagnostic.wind.polar: could not infer base dataset")

    params["data"] = base_data
    params["_resolved"] = {**dict(params.get("_resolved") or {}), **resolved}


def _enrich_transform_params(ctx: CompileContext, params: dict[str, Any], step_id: str) -> None:
    ttype = params.get("type")

    if ttype == "derive":
        expr = params.get("expr") or {}
        op = expr.get("op")

        if op == "diagnostic.slp":
            _enrich_diagnostic_slp(ctx, params)

        if op == "diagnostic.wind.polar":
            _enrich_diagnostic_wind_polar(ctx, params)
            return

        _enrich_generic_derive(ctx, params)
        return


def _enrich_derive_wind_vector(ctx: CompileContext, params: dict[str, Any]) -> None:
    tin = params.get("input") or {}
    if not isinstance(tin, dict):
        raise ValueError("derive_wind_vector requires input object")

    base_data = tin.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("derive_wind_vector requires input.data")

    vars_map = tin.get("vars") or {}
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

    expr = params.get("expr") or {}
    args = expr.get("args") or []

    base_data = None
    resolved: dict[str, Any] = {}

    role_map = {
        "sp": "surfacePressureKey",
        "at2m": "airTemperature2mKey",
        "wvmr2m": "waterVaporMixingRatio2mKey",
        "hgt": "surfaceHeightKey",
        "geopot": "surfaceGeopotentialKey",
    }

    for a in args:
        if not isinstance(a, dict):
            continue

        data_id = a.get("data")
        var_id = a.get("var")
        role = a.get("role")

        if not isinstance(data_id, str) or not isinstance(var_id, str):
            continue

        if base_data is None:
            base_data = data_id

        key = _var_id_to_key(ctx, data_id, var_id)
        if key and role in role_map:
            resolved[role_map[role]] = key

    if not isinstance(base_data, str):
        raise ValueError("diagnostic.slp: could not infer base dataset")

    params["data"] = base_data
    params["_resolved"] = resolved


def _enrich_generic_derive(ctx: CompileContext, params: dict[str, Any]) -> None:
    base_data = None

    expr = params.get("expr") or {}
    if not isinstance(expr, dict):
        return

    def _find_base(node):
        if isinstance(node, dict):
            if "data" in node and isinstance(node["data"], str):
                return node["data"]
            for a in node.get("args", []):
                d = _find_base(a)
                if d:
                    return d
        return None

    base_data = _find_base(expr)

    if not isinstance(base_data, str):
        raise ValueError("derive: could not infer input data from expression")

    resolved = dict(params.get("_resolved") or {})
    var_map = dict(resolved.get("varMap") or {})

    def _walk(node: Any) -> None:
        if not isinstance(node, dict):
            return

        if "var" in node and isinstance(node["var"], str):
            var_id = node["var"]
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
    params["data"] = base_data