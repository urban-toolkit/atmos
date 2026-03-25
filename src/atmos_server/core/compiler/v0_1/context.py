# atmos_server/compiler/v0_1/context.py
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any

from atmos_server.core.compiler.models import InputRef, Artifact, Step

def resolve_template(template: str, values: dict[str, Any]) -> str:
    out = template

    for k, v in values.items():
        out = out.replace(f"{{{k}}}", str(v))

    return out

@dataclass
class CompileContext:
    spec: dict[str, Any]
    schema_version: str

    inputs: list[InputRef] = field(default_factory=list)
    steps: list[Step] = field(default_factory=list)
    artifacts: list[Artifact] = field(default_factory=list)

    data_by_id: dict[str, dict[str, Any]] = field(default_factory=dict)
    data_id_to_upstream_step: dict[str, str] = field(default_factory=dict)
    derived_data_to_step: dict[str, str] = field(default_factory=dict)
    derived_data_to_base_data: dict[str, str] = field(default_factory=dict)

    derived_data_to_reduced_dims: dict[str, set[str]] = field(default_factory=dict)

    default_upstream_step: str = ""
    runtime_state: dict[str, Any] = field(default_factory=dict)