from __future__ import annotations

from typing import Any, Protocol

from atmos_server.core.compiler.ports import CompilerPorts
from atmos_server.core.compiler.v0_1.compile import compile_v0_1
from .models import Plan


class CompilerFn(Protocol):
    def __call__(
        self,
        spec: dict[str, Any],
        schema_version: str,
        *,
        ports: CompilerPorts,
    ) -> Plan: ...


_COMPILERS: dict[str, CompilerFn] = {
    "v0.1": compile_v0_1,
}


def get_compiler(schema_version: str) -> CompilerFn:
    try:
        return _COMPILERS[schema_version]
    except KeyError as e:
        available = ", ".join(sorted(_COMPILERS.keys())) or "(none)"
        raise ValueError(
            f"No compiler registered for schema version '{schema_version}'. "
            f"Available: {available}"
        ) from e


def list_compilers() -> list[str]:
    return sorted(_COMPILERS.keys())