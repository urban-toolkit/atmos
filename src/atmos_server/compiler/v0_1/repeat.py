# atmos_server/compiler/v0_1/repeat.py
from __future__ import annotations
from typing import Any

from atmos_server.compiler.ports import CompilerPorts
from .context import CompileContext
from .ids import safe_id
from .spec_nav import infer_repeat_data_id

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
                tv = r.get("targetView")
                if isinstance(tv, str) and tv:
                    repeats_by_view.setdefault(tv, []).append(r)

    for vi, view in enumerate(views):
        if not isinstance(view, dict):
            continue

        base_view_id = safe_id("view", view.get("id"), vi)
        reps = repeats_by_view.get(base_view_id, [])
        if not reps:
            expanded.append(view)
            continue

        r0 = reps[0]
        if r0.get("type") != "timestep":
            expanded.append(view)
            continue

        target_layer = r0.get("targetLayer")
        if not isinstance(target_layer, str) or not target_layer.strip():
            raise ValueError(f"repeatView for '{base_view_id}' missing targetLayer")
        target_layer = target_layer.strip()

        data_id = r0.get("data")
        if isinstance(data_id, str) and data_id.strip():
            data_id = data_id.strip()
        else:
            data_id = infer_repeat_data_id(ctx.spec, target_view=base_view_id, target_layer=target_layer)

        indices = r0.get("indices")
        if indices is None:
            tlen = ports.time_len.time_len(spec=ctx.spec, data_id=data_id)
            if tlen is None:
                raise ValueError(f"repeatView could not infer time length for data '{data_id}'")
            indices = list(range(tlen))
        elif not (isinstance(indices, list) and all(isinstance(x, int) for x in indices)):
            raise ValueError(f"repeatView.indices must be array[int] (view '{base_view_id}')")

        for idx in indices:
            inst = dict(view)
            inst_id = f"{base_view_id}__t{idx:03d}"
            inst["id"] = inst_id
            inst["_repeat"] = {"type": "timestep", "index": idx, "baseViewId": base_view_id}
            inst["_repeatTargetLayer"] = target_layer
            inst["_repeatDataId"] = data_id
            expanded.append(inst)

    return expanded