# atmos_server/compiler/v0_1/compile.py
from __future__ import annotations
from typing import Any

from atmos_server.compiler.types import Plan, PlanMeta
from atmos_server.compiler.ports import CompilerPorts
from atmos_server.compiler.default_ports import make_default_ports

from .context import CompileContext
from .data_load import compile_load_steps
from .transforms import compile_transform_steps
from .repeat import expand_repeat_views
from .geometry import compile_geometry_and_artifacts

def compile_v0_1(spec: dict[str, Any], schema_version: str, *, ports: CompilerPorts | None = None) -> Plan:
    ports = ports or make_default_ports()
    ctx = CompileContext(spec=spec, schema_version=schema_version)

    compile_load_steps(ctx)
    compile_transform_steps(ctx)
    views = expand_repeat_views(ctx, ports)
    compile_geometry_and_artifacts(ctx, ports, views)

    meta = PlanMeta(schema_version=schema_version, spec_id=spec.get("id"))
    return Plan(meta=meta, inputs=tuple(ctx.inputs), steps=tuple(ctx.steps), artifacts=tuple(ctx.artifacts), raw_spec=spec)