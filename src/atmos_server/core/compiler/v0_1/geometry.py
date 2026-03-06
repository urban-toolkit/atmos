from __future__ import annotations

from typing import Any

from atmos_server.core.compiler.models import Step
from atmos_server.core.compiler.ports import CompilerPorts

from .context import CompileContext
from .ids import safe_id
from .artifacts import add_geojson_artifact


def compile_geometry_and_artifacts(
    ctx: CompileContext,
    ports: CompilerPorts,
    views: list[dict[str, Any]],
) -> None:
    composition = ctx.spec.get("composition") or {}

    for vi, view in enumerate(views):
        if not isinstance(view, dict):
            continue

        view_id = safe_id("view", view.get("id"), vi)

        layers = view.get("layers") or []
        if not isinstance(layers, list):
            continue

        for li, layer in enumerate(layers):
            if not isinstance(layer, dict):
                continue

            layer_id = safe_id("layer", layer.get("id"), li)

            geom = layer.get("geometry")
            if not isinstance(geom, dict):
                continue

            gtype = geom.get("type") or "unknown"
            geom_step_id = f"geometry:{view_id}:{layer_id}"

            ginput = geom.get("input") or {}
            if not isinstance(ginput, dict):
                ginput = {}

            upstream_step = _resolve_upstream_step(ctx, ginput)
            repeat = view.get("_repeat")

            # ---- time selection (only for non-repeat views) ----
            if not isinstance(repeat, dict):
                time_idx = _get_time_index_for_view(view, composition)
                if isinstance(time_idx, int):
                    input_data = ginput.get("data")
                    if isinstance(input_data, str) and _is_time_indexable_data(ctx, input_data):
                        tstep_id = f"transform:time:{view_id}:{layer_id}"
                        ctx.steps.append(
                            Step(
                                id=tstep_id,
                                kind="transform",
                                depends_on=(upstream_step,) if upstream_step else (),
                                params={"type": "select_time_index", "index": time_idx},
                            )
                        )
                        upstream_step = tstep_id

            # ---- repeat override ----
            if isinstance(repeat, dict):
                idx = repeat.get("index")
                input_data = ginput.get("data")

                # Only time-slice if the layer's input data is actually time-indexable
                if isinstance(idx, int) and isinstance(input_data, str) and _is_time_indexable_data(ctx, input_data):
                    if not upstream_step:
                        raise ValueError(f"repeatView: unknown data '{input_data}'")

                    tstep_id = f"transform:repeat:{view_id}:{layer_id}:t{idx:03d}"
                    ctx.steps.append(
                        Step(
                            id=tstep_id,
                            kind="transform",
                            depends_on=(upstream_step,),
                            params={"type": "select_time_index", "index": idx},
                        )
                    )
                    upstream_step = tstep_id

            # ---- geometry params (+ _resolved) ----
            geom_params = dict(geom)
            geom_params["_viewId"] = view_id
            geom_params["_layerId"] = layer_id

            _maybe_enrich_geometry_resolved(ctx, geom_params, gtype=gtype, ginput=ginput, geom=geom)

            # ---- geometry step ----
            ctx.steps.append(
                Step(
                    id=geom_step_id,
                    kind="geometry",
                    depends_on=(upstream_step,) if upstream_step else (),
                    params=geom_params,
                )
            )

            # ---- artifact ----
            add_geojson_artifact(
                ports=ports,
                artifacts=ctx.artifacts,
                view=view,
                view_id=view_id,
                layer_id=layer_id,
                gtype=gtype,
                geom_step_id=geom_step_id,
                geom=geom,
            )


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


def _is_time_indexable_data(ctx: CompileContext, input_data: str) -> bool:
    if input_data in ctx.derived_data_to_step:
        return True  # derived outputs are DataObjects (time-indexable)

    d = ctx.data_by_id.get(input_data)
    if not isinstance(d, dict):
        return False

    src = d.get("source") or {}
    return isinstance(src, dict) and src.get("type") == "netcdf"


def _resolve_upstream_step(ctx: CompileContext, ginput: dict[str, Any]) -> str:
    upstream_step = ctx.default_upstream_step

    input_data = ginput.get("data")
    if isinstance(input_data, str):
        if input_data in ctx.data_id_to_upstream_step:
            upstream_step = ctx.data_id_to_upstream_step[input_data]
        elif input_data in ctx.derived_data_to_step:
            upstream_step = ctx.derived_data_to_step[input_data]

    return upstream_step


def _maybe_enrich_geometry_resolved(
    ctx: CompileContext,
    geom_params: dict[str, Any],
    *,
    gtype: str,
    ginput: dict[str, Any],
    geom: dict[str, Any],
) -> None:
    if gtype in ("mesh", "isoband", "isoline"):
        geom_params["_resolved"] = _resolved_mesh_like(ctx, ginput=ginput)
        return

    if gtype == "vector":
        geom_params["_resolved"] = _resolved_vector(ctx, geom=geom)
        return

    if gtype == "point":
        geom_params["_resolved"] = _resolved_point(ctx, ginput=ginput)
        return


def _resolved_mesh_like(ctx: CompileContext, *, ginput: dict[str, Any]) -> dict[str, Any]:
    input_data = ginput.get("data")
    input_var = ginput.get("variable")

    base_data: str | None = None
    if isinstance(input_data, str):
        if input_data in ctx.data_by_id:
            base_data = input_data
        elif input_data in ctx.derived_data_to_base_data:
            base_data = ctx.derived_data_to_base_data[input_data]

    lat_key = None
    lon_key = None
    var_key = None

    if base_data is not None:
        d = ctx.data_by_id[base_data]
        dims = d.get("dimensions") or {}

        lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
        lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

        # For derived datasets, the xarray variable name should be the derived variable id itself
        if isinstance(input_data, str) and input_data in ctx.derived_data_to_step:
            if isinstance(input_var, str):
                var_key = input_var
        else:
            vars_ = d.get("variables") or []
            if isinstance(input_var, str) and isinstance(vars_, list):
                for vv in vars_:
                    if isinstance(vv, dict) and vv.get("id") == input_var:
                        var_key = vv.get("key")
                        break

    return {
        "dataId": input_data,
        "variableId": input_var,
        "variableKey": var_key,
        "latKey": lat_key,
        "lonKey": lon_key,
        "baseDataId": base_data,
    }


def _resolved_vector(ctx: CompileContext, *, geom: dict[str, Any]) -> dict[str, Any]:
    inp = geom.get("input") or {}
    if not isinstance(inp, dict):
        raise ValueError("vector geometry requires input object")

    input_data = inp.get("data")
    input_var = inp.get("variable")
    if not isinstance(input_data, str) or not isinstance(input_var, str):
        raise ValueError("vector geometry requires input.data and input.variable")

    base_data = input_data
    if input_data in ctx.derived_data_to_base_data:
        base_data = ctx.derived_data_to_base_data[input_data]

    base = ctx.data_by_id.get(base_data) or {}
    dims = base.get("dimensions") or {}
    lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
    lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

    if not isinstance(lat_key, str) or not isinstance(lon_key, str):
        raise ValueError(f"vector geometry could not resolve lat/lon keys for base data '{base_data}'")

    resolved = dict(geom.get("_resolved") or {})
    resolved["latKey"] = lat_key
    resolved["lonKey"] = lon_key

    # convention: f"{var_id}.speed"/".direction"
    resolved["speedKey"] = f"{input_var}.speed"
    resolved["directionKey"] = f"{input_var}.direction"
    resolved["variableId"] = input_var
    resolved["baseDataId"] = base_data
    resolved["dataId"] = input_data

    return resolved


def _resolved_point(ctx: CompileContext, *, ginput: dict[str, Any]) -> dict[str, Any]:
    input_data = ginput.get("data")
    input_var = ginput.get("variable")

    lat_key = lon_key = site_key = time_key = var_key = None

    if isinstance(input_data, str) and input_data in ctx.data_by_id:
        d = ctx.data_by_id[input_data]
        dims = d.get("dimensions") or {}

        lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
        lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None
        site_key = (dims.get("site") or {}).get("key") if isinstance(dims.get("site"), dict) else None
        time_key = (dims.get("time") or {}).get("key") if isinstance(dims.get("time"), dict) else None

        vars_ = d.get("variables") or []
        if isinstance(input_var, str) and isinstance(vars_, list):
            for vv in vars_:
                if isinstance(vv, dict) and vv.get("id") == input_var:
                    k = vv.get("key")
                    if isinstance(k, str) and k.strip():
                        var_key = k.strip()
                    break

    return {
        "dataId": input_data,
        "variableId": input_var,
        "variableKey": var_key,
        "latKey": lat_key,
        "lonKey": lon_key,
        "siteKey": site_key,
        "timeKey": time_key,
        "baseDataId": input_data,
    }