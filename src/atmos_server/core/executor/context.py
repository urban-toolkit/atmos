from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class ExecutionContext:
    """
    Holds outputs produced by executed steps, keyed by step id.
    """
    outputs: dict[str, Any] = field(default_factory=dict)

    def put(self, step_id: str, value: Any) -> None:
        self.outputs[step_id] = value

    def get(self, step_id: str) -> Any:
        return self.outputs[step_id]