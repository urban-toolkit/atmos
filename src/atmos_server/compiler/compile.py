from __future__ import annotations

from typing import Any

from atmos_server.compiler.registry import get_compiler
from atmos_server.compiler.types import Plan


def compile_plan(spec: dict[str, Any], *, schema_version: str) -> Plan:
    """
    Version-dispatched compiler entry point.

    Keeps the executor stable even if spec versions diverge significantly.
    """
    compiler = get_compiler(schema_version)
    return compiler(spec, schema_version)