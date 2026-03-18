from __future__ import annotations
from typing import Any

from atmos_server.core.compiler.ports import CompilerPorts
from atmos_server.core.compiler.v0_1.shared import resolve_base_data_id
from .context import CompileContext
from .ids import safe_id

def _has_member_dim(ctx: CompileContext, data_id: str) -> bool:
    reduced_dims = getattr(ctx, "derived_data_to_reduced_dims", {}).get(data_id, set())
    if "member" in reduced_dims:
        return False

    return _infer_member_count(ctx, data_id) is not None


def _interaction_controlled_dims_for_view(view_id: str, composition: dict[str, Any]) -> set[str]:
    controlled: set[str] = set()

    interactions = composition.get("interactions") or []
    if not isinstance(interactions, list):
        return controlled

    for intr in interactions:
        if not isinstance(intr, dict):
            continue

        action = intr.get("action")
        if not isinstance(action, dict):
            continue

        select = action.get("select")
        if not isinstance(select, dict):
            continue

        dim = select.get("dim")
        if not isinstance(dim, str) or not dim:
            continue

        targets = select.get("target") or []
        if not isinstance(targets, list):
            continue

        for tgt in targets:
            if not isinstance(tgt, dict):
                continue
            tgt_view = tgt.get("view")
            if tgt_view == view_id:
                controlled.add(dim)

    return controlled

def _infer_member_count(ctx: CompileContext, data_id: str) -> int | None:
    reduced_dims = getattr(ctx, "derived_data_to_reduced_dims", {}).get(data_id, set())
    if "member" in reduced_dims:
        return None

    base_data = resolve_base_data_id(ctx, data_id)
    d = ctx.data_by_id.get(base_data)
    if not isinstance(d, dict):
        return None

    members = d.get("members")
    if not isinstance(members, dict):
        return None

    count = members.get("count")
    if isinstance(count, int) and count >= 0:
        return count

    return None

def _infer_data_id_from_view(view: dict[str, Any]) -> str | None:
    layers = view.get("layers") or []
    if not isinstance(layers, list):
        return None

    for layer in layers:
        if not isinstance(layer, dict):
            continue
        geom = layer.get("geometry")
        if not isinstance(geom, dict):
            continue
        ginput = geom.get("input")
        if isinstance(ginput, dict):
            data_id = ginput.get("data")
            if isinstance(data_id, str) and data_id.strip():
                return data_id.strip()
    return None


def _infer_implicit_repeat_from_view(
    ctx: CompileContext,
    ports: CompilerPorts,
    view: dict[str, Any],
) -> dict[str, Any] | None:
    """
    First version:
    - if any layer has geometry.input.dims.time = [..], use timestep repeat
    - else if any layer has geometry.input.dims.member = [..], use member repeat
    - else infer full range from first data source if time/member is indexable
    """
    
    layers = view.get("layers") or []
    if not isinstance(layers, list):
        return None

    inferred_data_id: str | None = None
    found_time_indices: list[int] | None = None
    found_member_indices: list[int] | None = None
    found_time_scalar = False
    found_member_scalar = False


    for layer in layers:
        if not isinstance(layer, dict):
            continue

        geom = layer.get("geometry")
        if not isinstance(geom, dict):
            continue

        ginput = geom.get("input")
        if not isinstance(ginput, dict):
            continue

        data_id = ginput.get("data")
        if isinstance(data_id, str) and data_id.strip() and inferred_data_id is None:
            inferred_data_id = data_id.strip()

        dims = ginput.get("dims")
        if not isinstance(dims, dict):
            continue

        time_sel = dims.get("time")
        if isinstance(time_sel, list) and all(isinstance(x, int) for x in time_sel) and time_sel:
            found_time_indices = time_sel
        elif isinstance(time_sel, int) and time_sel >= 0:
            found_time_scalar = True

        member_sel = dims.get("member")
        if isinstance(member_sel, list) and all(isinstance(x, int) for x in member_sel) and member_sel:
            found_member_indices = member_sel
        elif isinstance(member_sel, int) and member_sel >= 0:
            found_member_scalar = True

    composition = ctx.spec.get("composition") or {}
    view_id = view.get("id")
    controlled_dims = set()
    if isinstance(view_id, str) and view_id:
        controlled_dims = _interaction_controlled_dims_for_view(view_id, composition)
    
    data_id = inferred_data_id or _infer_data_id_from_view(view)
    if not isinstance(data_id, str) or not data_id:
        return None

    if found_time_indices is not None and "time" not in controlled_dims:
        return {"type": "timestep", "data": data_id, "indices": found_time_indices}

    if (
        found_member_indices is not None
        and "member" not in controlled_dims
        and _has_member_dim(ctx, data_id)
    ):
        return {"type": "member", "data": data_id, "indices": found_member_indices}

    base_data_id = resolve_base_data_id(ctx, data_id)
    
    if "time" not in controlled_dims and not found_time_scalar:
        n_time = ports.time_len.time_len(spec=ctx.spec, data_id=base_data_id)
        if isinstance(n_time, int) and n_time > 1:
            return {"type": "timestep", "data": data_id, "indices": list(range(n_time))}

    if "member" not in controlled_dims and not found_member_scalar:
        n_member = _infer_member_count(ctx, data_id)
        if isinstance(n_member, int) and n_member > 1:
            return {"type": "member", "data": data_id, "indices": list(range(n_member))}

    return None


def expand_repeat_views(ctx: CompileContext, ports: CompilerPorts) -> list[dict[str, Any]]:
    composition = ctx.spec.get("composition") or {}
    layout = composition.get("layout") or {}
    views = composition.get("views") or []
    if not isinstance(views, list):
        raise ValueError("composition.views must be a list")

    expanded: list[dict[str, Any]] = []
    repeat_specs = layout.get("repeatView") or []

    repeats_by_view: dict[str, list[dict[str, Any]]] = {}
    if isinstance(repeat_specs, list):
        for r in repeat_specs:
            if isinstance(r, dict):
                tv = r.get("view")
                if isinstance(tv, str) and tv:
                    repeats_by_view.setdefault(tv, []).append(r)

    for vi, view in enumerate(views):
        if not isinstance(view, dict):
            continue

        base_view_id = safe_id("view", view.get("id"), vi)

        reps = repeats_by_view.get(base_view_id, [])
        if reps:
            r0 = reps[0]
        else:
            r0 = _infer_implicit_repeat_from_view(ctx, ports, view)

        if not isinstance(r0, dict):
            expanded.append(view)
            continue

        rtype = r0.get("type")
        if rtype not in ("timestep", "member"):
            expanded.append(view)
            continue

        data_id = r0.get("data")
        if not isinstance(data_id, str) or not data_id.strip():
            data_id = _infer_data_id_from_view(view)
        else:
            data_id = data_id.strip()

        if not isinstance(data_id, str) or not data_id:
            raise ValueError(f"repeatView for '{base_view_id}' missing data")

        indices = r0.get("indices")
        if indices is None:
            base_data_id = resolve_base_data_id(ctx, data_id)

            if rtype == "timestep":
                n = ports.time_len.time_len(spec=ctx.spec, data_id=base_data_id)
                if n is None:
                    raise ValueError(f"repeatView could not infer time length for data '{data_id}'")
            elif rtype == "member":
                n = _infer_member_count(ctx, data_id)
                if n is None:
                    raise ValueError(f"repeatView could not infer member count for data '{data_id}'")
            else:
                raise ValueError(f"Unsupported repeatView.type '{rtype}'")

            indices = list(range(n))

        elif not (isinstance(indices, list) and all(isinstance(x, int) for x in indices)):
            raise ValueError(f"repeatView.indices must be array[int] (view '{base_view_id}')")

        # for idx in indices:
        #     inst = dict(view)
        #     suffix = "t" if rtype == "timestep" else "m"
        #     inst_id = f"{base_view_id}__{suffix}{idx:03d}"
        #     inst["id"] = inst_id
        #     inst["_repeat"] = {
        #         "type": rtype,
        #         "index": idx,
        #         "baseViewId": base_view_id,
        #     }
        #     inst["_repeatDataId"] = data_id
        #     expanded.append(inst)
        for idx in indices:
            inst = dict(view)
            suffix = "t" if rtype == "timestep" else "m"
            inst_id = f"{base_view_id}__{suffix}{idx:03d}"
            inst["id"] = inst_id

            dim_name = "time" if rtype == "timestep" else "member"

            inst["_repeat"] = {
                "type": rtype,
                "dim": dim_name,
                "index": idx,
                "value": idx,
                "baseViewId": base_view_id,
            }
            inst["_repeatDataId"] = data_id
            inst["_templateVars"] = {
                dim_name: idx
            }

            expanded.append(inst)

    return expanded