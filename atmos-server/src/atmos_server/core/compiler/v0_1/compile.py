from __future__ import annotations
from typing import Any

from atmos_server.core.compiler.models import Plan, PlanMeta
from atmos_server.core.compiler.ports import CompilerPorts

from atmos_server.core.compiler.v0_1.context import CompileContext, resolve_template
from atmos_server.core.compiler.v0_1.data_load import compile_load_steps
from atmos_server.core.compiler.v0_1.transforms import compile_transform_steps
from atmos_server.core.compiler.v0_1.repeat import expand_repeat_views
from atmos_server.core.compiler.v0_1.geometry import compile_geometry_and_artifacts
from atmos_server.core.compiler.v0_1.chart import compile_chart_artifacts

def _resolve_view_titles(ctx: CompileContext, views: list[dict[str, Any]]) -> None:
    runtime_time = ctx.runtime_state.get("timeIndex")

    for view in views:
        if not isinstance(view, dict):
            continue

        context = view.get("context")
        if not isinstance(context, dict):
            continue

        title = context.get("title")
        if not isinstance(title, dict):
            continue

        template = title.get("template")
        if not isinstance(template, str):
            continue

        # Collect template variables
        vars_ = {}

        # 1. repeat variables (timestep/member)
        rep_vars = view.get("_templateVars")
        if isinstance(rep_vars, dict):
            vars_.update(rep_vars)

        # 2. runtime slider (only if not already set)
        if "time" not in vars_ and isinstance(runtime_time, int):
            vars_["time"] = runtime_time

        # Resolve
        title["text"] = resolve_template(template, vars_)


def compile_v0_1(
    spec: dict[str, Any],
    schema_version: str,
    *,
    ports: CompilerPorts,
    runtime_state: dict[str, Any] | None = None,
) -> Plan:

    ctx = CompileContext(
        spec=spec,
        schema_version=schema_version,
        runtime_state=runtime_state or {},
    )

    print("compile_v0_1 runtime_state =", runtime_state)
    print("ctx.runtime_state =", ctx.runtime_state)

    compile_load_steps(ctx)
    compile_transform_steps(ctx)
    views = expand_repeat_views(ctx, ports)
    _resolve_view_titles(ctx, views)
    compile_geometry_and_artifacts(ctx, ports, views)
    compile_chart_artifacts(ctx, views)

    raw_spec = dict(spec)
    raw_spec["_expandedViews"] = views

    meta = PlanMeta(schema_version=schema_version, spec_id=spec.get("id"))
    

    return Plan(
        meta=meta,
        inputs=tuple(ctx.inputs),
        steps=tuple(ctx.steps),
        artifacts=tuple(ctx.artifacts),
        raw_spec=raw_spec,
    )