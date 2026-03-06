from __future__ import annotations

from typing import Any

from atmos_server.core.compiler.models import Plan
from atmos_server.core.compiler.ports import CompilerPorts
from atmos_server.core.compiler.selector import get_compiler


def compile_spec(
    spec: dict[str, Any],
    *,
    schema_version: str,
    ports: CompilerPorts,
) -> Plan:
    compiler = get_compiler(schema_version)
    return compiler(spec, schema_version, ports=ports)