from __future__ import annotations

from typing import Any

from atmos_server.core.compiler.models import Artifact, Step

from .context import CompileContext
from .ids import safe_id


def _interaction_selected_dim_for_view(ctx: CompileContext, view_id: str) -> str | None:
    composition = ctx.spec.get("composition") or {}
    interactions = composition.get("interactions") or []
    if not isinstance(interactions, list):
        return None

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
            if isinstance(tgt, dict) and tgt.get("view") == view_id:
                return dim

    return None


def _runtime_selected_value(ctx: CompileContext, view_id: str, dim: str) -> Any | None:
    runtime_state = getattr(ctx, "runtime_state", None)
    if not isinstance(runtime_state, dict):
        return None

    # Preferred shape:
    # {"selections": {"view2": {"id": "..."}}
    selections = runtime_state.get("selections")
    if isinstance(selections, dict):
        by_view = selections.get(view_id)
        if isinstance(by_view, dict) and dim in by_view:
            return by_view[dim]

        # Optional fallback:
        # {"selections": {"id": "..."}}
        if dim in selections:
            return selections[dim]

    # Additional permissive fallbacks while wiring the frontend
    by_view = runtime_state.get(view_id)
    if isinstance(by_view, dict) and dim in by_view:
        return by_view[dim]

    if dim in runtime_state:
        return runtime_state[dim]

    return None


def _field_map_for_data(ctx: CompileContext, data_id: str) -> dict[str, str]:
    d = ctx.data_by_id.get(data_id)
    if not isinstance(d, dict):
        return {}

    field_map: dict[str, str] = {}

    dims = d.get("dims") or {}
    if isinstance(dims, dict):
        for dim_id, dim_def in dims.items():
            if not isinstance(dim_id, str) or not dim_id:
                continue
            if not isinstance(dim_def, dict):
                continue
            key = dim_def.get("key")
            if isinstance(key, str) and key:
                field_map[dim_id] = key

    vars_ = d.get("vars") or []
    if isinstance(vars_, list):
        for var_def in vars_:
            if not isinstance(var_def, dict):
                continue
            var_id = var_def.get("id")
            key = var_def.get("key")
            if isinstance(var_id, str) and var_id and isinstance(key, str) and key:
                field_map[var_id] = key

    return field_map


def _upstream_step_for_data(ctx: CompileContext, data_id: str) -> str:
    upstream = ctx.derived_data_to_step.get(data_id) or ctx.data_id_to_upstream_step.get(data_id)
    if isinstance(upstream, str) and upstream:
        return upstream
    raise ValueError(f"Chart input data '{data_id}' has no upstream step")


def compile_chart_artifacts(
    ctx: CompileContext,
    views: list[dict[str, Any]],
) -> None:
    for vi, view in enumerate(views):
        if not isinstance(view, dict):
            continue

        frame = view.get("frame") or {}
        if not isinstance(frame, dict) or frame.get("type") != "chart":
            continue

        view_id = safe_id("view", view.get("id"), vi)

        vl_spec = view.get("vegaLite")
        if not isinstance(vl_spec, dict):
            continue

        vinput = view.get("input") or {}
        if not isinstance(vinput, dict):
            raise ValueError(f"Chart view '{view_id}' must define input as an object")

        data_id = vinput.get("data")
        if not isinstance(data_id, str) or not data_id:
            raise ValueError(f"Chart view '{view_id}' must define input.data")

        upstream_step = _upstream_step_for_data(ctx, data_id)
        field_map = _field_map_for_data(ctx, data_id)

        producer_step = upstream_step
        selected_dim = _interaction_selected_dim_for_view(ctx, view_id)

        if isinstance(selected_dim, str) and selected_dim:
            selected_value = _runtime_selected_value(ctx, view_id, selected_dim)

            if selected_value is None:
                producer_step = f"transform:{view_id}:empty"
                ctx.steps.append(
                    Step(
                        producer_step,
                        "transform",
                        (upstream_step,),
                        {"type": "empty_table"},
                    )
                )
            else:
                column = field_map.get(selected_dim, selected_dim)
                if not isinstance(column, str) or not column:
                    raise ValueError(
                        f"Chart view '{view_id}' cannot resolve column for selected dim '{selected_dim}'"
                    )

                producer_step = f"transform:{view_id}:select:{selected_dim}"
                ctx.steps.append(
                    Step(
                        producer_step,
                        "transform",
                        (upstream_step,),
                        {
                            "type": "select_rows_equal",
                            "column": column,
                            "value": selected_value,
                        },
                    )
                )

        metadata: dict[str, Any] = {
            "viewId": view_id,
            "renderer": "vega-lite",
            "vegaLite": dict(vl_spec),
            "fieldMap": field_map,
        }

        if isinstance(view.get("_repeat"), dict):
            metadata["repeat"] = view["_repeat"]

        ctx.artifacts.append(
            Artifact(
                id=f"artifact:{view_id}",
                format="vega-lite",
                producer_step=producer_step,
                path=f"{view_id}.vl.json",
                metadata=metadata,
            )
        )