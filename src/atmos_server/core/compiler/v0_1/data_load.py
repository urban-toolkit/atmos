# atmos_server/compiler/v0_1/data_load.py
from __future__ import annotations
from typing import Any

from atmos_server.core.compiler.models import InputRef, Step
from .context import CompileContext
from .ids import safe_id

def compile_load_steps(ctx: CompileContext) -> None:
    data_items = ctx.spec.get("data") or []
    if not isinstance(data_items, list):
        raise ValueError("spec.data must be a list")

    for i, d in enumerate(data_items):
        if not isinstance(d, dict):
            continue

        data_id = safe_id("data_", d.get("id"), i)
        ctx.inputs.append(InputRef(data_id=data_id))
        ctx.data_by_id[data_id] = d

        step_id = f"load:{data_id}"
        ctx.data_id_to_upstream_step[data_id] = step_id

        kind = d.get("type")
        params: dict[str, Any] = {
            "dataId": data_id,
            "type": kind,
            "dims": d.get("dims"),
            "vars": d.get("vars"),
        }

        if kind == "collection":
            params["members"] = d.get("members")
            params["sourceTemplate"] = d.get("sourceTemplate")
            params["memberDimension"] = d.get("memberDimension", "member")
        else:
            params["source"] = d.get("source")

        ctx.steps.append(Step(step_id, "load", (), params))

    # default upstream step (used later)
    default_data_id = ctx.inputs[0].data_id if ctx.inputs else None
    ctx.default_upstream_step = ctx.data_id_to_upstream_step.get(default_data_id, "") if default_data_id else ""