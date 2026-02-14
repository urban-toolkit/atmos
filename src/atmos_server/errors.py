from __future__ import annotations

from dataclasses import dataclass
from typing import Any


class AtmosServerError(Exception):
    """Base error type for atmos-server."""


class SpecLoadError(AtmosServerError):
    """Failed to read or parse an Atmos spec."""


class SchemaLoadError(AtmosServerError):
    """Failed to load the pinned Atmos JSON Schema."""


@dataclass(frozen=True)
class ValidationIssue:
    message: str
    path: str
    schema_path: str
    instance_fragment: Any | None = None


class SpecValidationError(AtmosServerError):
    """Atmos spec is not valid under the pinned schema."""

    def __init__(self, issues: list[ValidationIssue]):
        super().__init__("Atmos spec validation failed")
        self.issues = issues
