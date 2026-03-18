from __future__ import annotations

from typing import Any

from atmos_server.core.compiler.models import Step
from atmos_server.core.compiler.ports import CompilerPorts
from atmos_server.core.compiler.v0_1.shared import resolve_base_data_id

from .context import CompileContext
from .ids import safe_id
from .artifacts import add_geojson_artifact


def _grid_type_for_input(ctx: CompileContext, input_data: str) -> str | None:
    d = ctx.data_by_id.get(input_data)
    if not isinstance(d, dict):
        return None
    grid = d.get("grid")
    if not isinstance(grid, dict):
        return None
    gt = grid.get("type")
    return gt if isinstance(gt, str) and gt else None

def _validate_geometry_grid_compatibility(ctx, gtype: str, input_data: str) -> None:
    grid_type = _grid_type_for_input(ctx, input_data)

    if gtype == "point":
        return

    if gtype in ("isoband", "isoline", "mesh", "vector"):
        if grid_type not in ("rectilinear", "curvilinear"):
            raise ValueError(
                f"{gtype} requires gridded data; got grid.type='{grid_type}' for data '{input_data}'"
            )

def _get_runtime_time_index(ctx: CompileContext, view_id: str) -> int | None:
    runtime_state = getattr(ctx, "runtime_state", None)
    if not isinstance(runtime_state, dict):
        return None

    v = runtime_state.get("timeIndex")
    if isinstance(v, int) and v >= 0:
        return v

    return None

def _is_time_controlled_for_view(ctx: CompileContext, view_id: str) -> bool:
    composition = ctx.spec.get("composition") or {}
    interactions = composition.get("interactions") or []

    for intr in interactions:
        if not isinstance(intr, dict):
            continue

        action = intr.get("action")
        if not isinstance(action, dict):
            continue

        select = action.get("select")
        if not isinstance(select, dict):
            continue

        if select.get("dim") != "time":
            continue

        targets = select.get("target") or []
        for tgt in targets:
            if isinstance(tgt, dict) and tgt.get("view") == view_id:
                return True

    return False

def _strip_repeated_dims_from_geom_input(
    geom_params: dict[str, Any],
    *,
    repeat: dict[str, Any] | None,
) -> None:
    if not isinstance(repeat, dict):
        return

    ginput = geom_params.get("input")
    if not isinstance(ginput, dict):
        return

    dims = ginput.get("dims")
    if not isinstance(dims, dict):
        return

    rtype = repeat.get("type")
    dims2 = dict(dims)

    if rtype == "timestep" and "time" in dims2:
        dims2.pop("time", None)

    if rtype == "member" and "member" in dims2:
        dims2.pop("member", None)

    ginput2 = dict(ginput)
    ginput2["dims"] = dims2
    geom_params["input"] = ginput2

def _is_member_indexable_data(ctx: CompileContext, input_data: str) -> bool:
    reduced_dims = getattr(ctx, "derived_data_to_reduced_dims", {}).get(input_data, set())
    if "member" in reduced_dims:
        return False

    base_data = resolve_base_data_id(ctx, input_data)
    d = ctx.data_by_id.get(base_data)
    if not isinstance(d, dict):
        return False

    members = d.get("members")
    if isinstance(members, dict):
        count = members.get("count")
        return isinstance(count, int) and count > 0

    return False

def _layer_varies_with_repeat(
    ctx: CompileContext,
    *,
    repeat: dict[str, Any] | None,
    ginput: dict[str, Any],
) -> bool:
    if not isinstance(repeat, dict):
        return False

    rtype = repeat.get("type")
    input_data = ginput.get("data")
    if not isinstance(input_data, str):
        return False

    if rtype == "timestep":
        return _is_time_indexable_data(ctx, input_data)

    if rtype == "member":
        return _is_member_indexable_data(ctx, input_data)

    return False

def _resolved_time_key_for_input(ctx: CompileContext, input_data: str) -> str | None:
    d = ctx.data_by_id.get(input_data)
    if not isinstance(d, dict):
        return None

    dims = d.get("dims") or {}
    time_dim = dims.get("time")
    if isinstance(time_dim, dict):
        k = time_dim.get("key")
        if isinstance(k, str) and k:
            return k
    return None

def compile_geometry_and_artifacts(
    ctx: CompileContext,
    ports: CompilerPorts,
    views: list[dict[str, Any]],
) -> None:
    composition = ctx.spec.get("composition") or {}
    compiled_static: dict[tuple[str, str], str] = {}

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

            is_dynamic = _layer_varies_with_repeat(ctx, repeat=repeat, ginput=ginput)
            is_shared_static_repeat = isinstance(repeat, dict) and not is_dynamic

            base_view_id = view_id.split("__")[0] if isinstance(repeat, dict) else view_id
            static_key = (base_view_id, layer_id)

            reuse_geom_step_id: str | None = None

            if isinstance(repeat, dict) and not is_dynamic:
                if static_key in compiled_static:
                    reuse_geom_step_id = compiled_static[static_key]

            # ---- time selection ----
            # if reuse_geom_step_id is None and not isinstance(repeat, dict):
            if reuse_geom_step_id is None:

                # geometry explicit time
                time_idx = _get_time_index_from_geom_input(ginput)

                # runtime slider
                if time_idx is None:
                    time_idx = _get_runtime_time_index(ctx, view_id)

                # view/composition time
                if time_idx is None:
                    time_idx = _get_time_index_for_view(view, composition)

                # 4️⃣ slider default
                if time_idx is None and _is_time_controlled_for_view(ctx, view_id):
                    time_idx = 0

                if time_idx is None:
                    time_idx = _get_time_index_for_view(view, composition)

                if time_idx is None and _is_time_controlled_for_view(ctx, view_id):
                    time_idx = 0

    
                if isinstance(time_idx, int):
                    input_data = ginput.get("data")
                    if isinstance(input_data, str) and _is_time_indexable_data(ctx, input_data):
                        tstep_id = f"transform:time:{view_id}:{layer_id}"

                        resolved = {}
                        time_key = _resolved_time_key_for_input(ctx, input_data)
                        if isinstance(time_key, str):
                            resolved["timeKey"] = time_key

                        params={
                            "type": "select_time_index",
                            "index": time_idx,
                            "_resolved": resolved
                        }

                        ctx.steps.append(
                            Step(
                                id=tstep_id,
                                kind="transform",
                                depends_on=(upstream_step,) if upstream_step else (),
                                params=params,
                            )
                        )
                        upstream_step = tstep_id

            # ---- repeat override ----
            if reuse_geom_step_id is None and isinstance(repeat, dict) and is_dynamic:
                idx = repeat.get("index")
                rtype = repeat.get("type")
                input_data = ginput.get("data")

                if isinstance(idx, int) and isinstance(input_data, str):
                  if not upstream_step:
                      raise ValueError(f"repeatView: unknown data '{input_data}'")

                  step_id = None
                  params: dict[str, Any] | None = None

                  if rtype == "timestep" and _is_time_indexable_data(ctx, input_data):
                      step_id = f"transform:repeat:{view_id}:{layer_id}:t{idx:03d}"

                      resolved = {}
                      time_key = _resolved_time_key_for_input(ctx, input_data)
                      if isinstance(time_key, str):
                          resolved["timeKey"] = time_key

                      params = {
                          "type": "select_time_index",
                          "index": idx,
                          "_resolved": resolved,
                      }

                  elif rtype == "member":
                      step_id = f"transform:repeat:{view_id}:{layer_id}:m{idx:03d}"
                      params = {"type": "select_member_index", "index": idx}

                  if step_id and params is not None:
                      ctx.steps.append(
                          Step(
                              id=step_id,
                              kind="transform",
                              depends_on=(upstream_step,),
                              params=params,
                          )
                      )
                      upstream_step = step_id
            
            # ---- geometry params (+ _resolved) ----
            geom_params = dict(geom)
            geom_params["_viewId"] = view_id
            geom_params["_layerId"] = layer_id

            _strip_repeated_dims_from_geom_input(geom_params, repeat=repeat)
            _maybe_enrich_geometry_resolved(ctx, geom_params, gtype=gtype, ginput=ginput, geom=geom)

            input_data = ginput.get("data")
            if isinstance(input_data, str):
                _validate_geometry_grid_compatibility(ctx, gtype, input_data)

            # ---- geometry step ----
            # if reuse_geom_step_id is None:
            #     ctx.steps.append(
            #         Step(
            #             id=geom_step_id,
            #             kind="geometry",
            #             depends_on=(upstream_step,) if upstream_step else (),
            #             params=geom_params,
            #         )
            #     )
            #     if isinstance(repeat, dict) and not is_dynamic:
            #         compiled_static[static_key] = geom_step_id
            # else:
            #     geom_step_id = reuse_geom_step_id

            artifact_producer_step_id = geom_step_id
            reuse_from_step_id: str | None = None

            if reuse_geom_step_id is None:
                ctx.steps.append(
                    Step(
                        id=geom_step_id,
                        kind="geometry",
                        depends_on=(upstream_step,) if upstream_step else (),
                        params=geom_params,
                    )
                )
                if isinstance(repeat, dict) and not is_dynamic:
                    compiled_static[static_key] = geom_step_id
            else:
                artifact_producer_step_id = reuse_geom_step_id
                reuse_from_step_id = reuse_geom_step_id

            # ---- artifact ----
            # add_geojson_artifact(
            #     ports=ports,
            #     artifacts=ctx.artifacts,
            #     view=view,
            #     layer=layer,
            #     view_id=view_id,
            #     layer_id=layer_id,
            #     gtype=gtype,
            #     geom_step_id=geom_step_id,
            #     geom=geom,
            # )
            add_geojson_artifact(
                ports=ports,
                artifacts=ctx.artifacts,
                view=view,
                layer=layer,
                view_id=view_id,
                layer_id=layer_id,
                gtype=gtype,
                geom_step_id=artifact_producer_step_id,
                geom=geom,
                reuse_from_step_id=reuse_from_step_id,
                shared_asset=is_shared_static_repeat
            )

def _get_time_index_from_geom_input(ginput: dict[str, Any]) -> int | None:
    dims = ginput.get("dims")
    if not isinstance(dims, dict):
        return None

    t = dims.get("time")

    if isinstance(t, int) and t >= 0:
        return t

    return None


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
        return True

    d = ctx.data_by_id.get(input_data)
    if not isinstance(d, dict):
        return False

    dims = d.get("dims") or {}
    time_dim = dims.get("time")
    if isinstance(time_dim, dict):
        time_key = time_dim.get("key")
        if isinstance(time_key, str) and time_key:
            return True

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
    input_var = ginput.get("var")

    base_data: str | None = None
    if isinstance(input_data, str):
        if input_data in ctx.data_by_id:
            base_data = input_data
        elif input_data in ctx.derived_data_to_base_data:
            base_data = ctx.derived_data_to_base_data[input_data]

    lat_key = None
    lon_key = None
    var_key = None
    grid_type = None

    if base_data is not None:
        d = ctx.data_by_id[base_data]
        dims = d.get("dims") or {}

        lat_key   = (dims.get("lat") or {}).get("key") if isinstance(dims.get("lat"), dict) else None
        lon_key   = (dims.get("lon") or {}).get("key") if isinstance(dims.get("lon"), dict) else None

        grid = d.get("grid") or {}
        if isinstance(grid, dict):
            gt = grid.get("type")
            if isinstance(gt, str) and gt:
                grid_type = gt

        # For derived datasets, the xarray variable name should be the derived variable id itself
        if isinstance(input_data, str) and input_data in ctx.derived_data_to_step:
            if isinstance(input_var, str):
                var_key = input_var
        else:
            vars_ = d.get("vars") or []
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
        "gridType": grid_type
    }


def _resolved_vector(ctx: CompileContext, *, geom: dict[str, Any]) -> dict[str, Any]:
    inp = geom.get("input") or {}
    if not isinstance(inp, dict):
        raise ValueError("vector geometry requires input object")

    input_data = inp.get("data")
    if not isinstance(input_data, str):
        raise ValueError("vector geometry requires input.data")

    input_var = inp.get("var")
    input_speed = inp.get("speed")
    input_direction = inp.get("direction")

    base_data = input_data
    if input_data in ctx.derived_data_to_base_data:
        base_data = ctx.derived_data_to_base_data[input_data]

    base = ctx.data_by_id.get(base_data) or {}
    dims = base.get("dims") or {}
    lat_key = (dims.get("lat") or {}).get("key") if isinstance(dims.get("lat"), dict) else None
    lon_key = (dims.get("lon") or {}).get("key") if isinstance(dims.get("lon"), dict) else None

    if not isinstance(lat_key, str) or not isinstance(lon_key, str):
        raise ValueError(f"vector geometry could not resolve lat/lon keys for base data '{base_data}'")

    resolved = dict(geom.get("_resolved") or {})
    resolved["latKey"] = lat_key
    resolved["lonKey"] = lon_key
    resolved["baseDataId"] = base_data
    resolved["dataId"] = input_data

    # Case 1: derived/vector variable reference, e.g. input.var = "wind10"
    if isinstance(input_var, str):
        resolved["speedKey"] = f"{input_var}.speed"
        resolved["directionKey"] = f"{input_var}.direction"
        resolved["variableId"] = input_var
        return resolved

    # Case 2: explicit polar keys
    if isinstance(input_speed, str) and isinstance(input_direction, str):
        resolved["speedKey"] = input_speed
        resolved["directionKey"] = input_direction
        resolved["variableId"] = "wind"
        return resolved

    raise ValueError("vector geometry requires input.var or input.speed + input.direction")


def _resolved_point(ctx: CompileContext, *, ginput: dict[str, Any]) -> dict[str, Any]:
    input_data = ginput.get("data")
    input_var = ginput.get("var")

    lat_key = lon_key = id_key = site_key = time_key = var_key = None
    grid_type = None

    if isinstance(input_data, str) and input_data in ctx.data_by_id:
        d = ctx.data_by_id[input_data]
        dims = d.get("dims") or {}

        id_key = (dims.get("id") or {}).get("key") if isinstance(dims.get("id"), dict) else None
        lat_key = (dims.get("lat") or {}).get("key") if isinstance(dims.get("lat"), dict) else None
        lon_key = (dims.get("lon") or {}).get("key") if isinstance(dims.get("lon"), dict) else None
        site_key = (dims.get("site") or {}).get("key") if isinstance(dims.get("site"), dict) else None
        time_key = (dims.get("time") or {}).get("key") if isinstance(dims.get("time"), dict) else None

        vars_ = d.get("vars") or []
        if isinstance(input_var, str) and isinstance(vars_, list):
            for vv in vars_:
                if isinstance(vv, dict) and vv.get("id") == input_var:
                    k = vv.get("key")
                    if isinstance(k, str) and k.strip():
                        var_key = k.strip()
                    break

        grid = d.get("grid") or {}
        if isinstance(grid, dict):
            gt = grid.get("type")
            if isinstance(gt, str) and gt:
                grid_type = gt

    return {
        "dataId": input_data,
        "variableId": input_var,
        "variableKey": var_key,
        "idKey": id_key,
        "latKey": lat_key,
        "lonKey": lon_key,
        "siteKey": site_key,
        "timeKey": time_key,
        "baseDataId": input_data,
        "gridType": grid_type,
    }