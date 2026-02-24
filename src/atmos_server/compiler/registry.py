from __future__ import annotations

from typing import Any, Callable, Dict

from atmos_server.compiler.types import Plan
from atmos_server.compiler.v0_1 import compile_v0_1

CompilerFn = Callable[[dict[str, Any], str], Plan]
# signature: (spec, schema_version) -> Plan


_COMPILERS: Dict[str, CompilerFn] = {
    "v0.1": compile_v0_1,
    # Add future versions here:
    # "v0.2": compile_v0_2,
    # "v1.0": compile_v1_0,
}


def get_compiler(schema_version: str) -> CompilerFn:
    """
    Return the compiler for the given Atmos schema version.
    """
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