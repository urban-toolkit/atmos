from __future__ import annotations

from typing import Any

from jsonschema import Draft202012Validator

from atmos_server.errors import SpecValidationError, ValidationIssue


def _json_pointer_from_error_path(path_parts: list[Any]) -> str:
    # Convert jsonschema "path" parts to a readable pointer-ish string.
    # Example: ["data", 0, "transform", 2] -> $.data[0].transform[2]
    out = "$"
    for part in path_parts:
        if isinstance(part, int):
            out += f"[{part}]"
        else:
            out += f".{part}"
    return out


def validate_spec(spec: Any, schema: dict[str, Any]) -> None:
    """
    Validate a spec object against a pinned Atmos schema.
    Raises SpecValidationError with structured issues if invalid.
    """
    validator = Draft202012Validator(schema)

    errors = sorted(validator.iter_errors(spec), key=lambda e: list(e.path))

    if not errors:
        return

    issues: list[ValidationIssue] = []
    for e in errors:
        issues.append(
            ValidationIssue(
                message=e.message,
                path=_json_pointer_from_error_path(list(e.path)),
                schema_path=_json_pointer_from_error_path(list(e.schema_path)),
                instance_fragment=e.instance if e.instance is not None else None,
            )
        )

    raise SpecValidationError(issues)
