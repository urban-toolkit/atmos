from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from atmos_server.errors import SchemaLoadError, SpecLoadError


def load_json_file(path: str | Path) -> Any:
    p = Path(path)
    if not p.exists():
        raise SpecLoadError(f"File not found: {p}")
    if not p.is_file():
        raise SpecLoadError(f"Not a file: {p}")

    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        raise SpecLoadError(f"Failed to parse JSON: {p}") from e


def load_schema(schema_path: str | Path) -> dict[str, Any]:
    """
    Load a bundled/pinned Atmos JSON Schema (already bundled, no external $ref expected).
    """
    p = Path(schema_path)
    if not p.exists():
        raise SchemaLoadError(f"Schema not found: {p}")
    if not p.is_file():
        raise SchemaLoadError(f"Schema path is not a file: {p}")

    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        raise SchemaLoadError(f"Failed to parse schema JSON: {p}") from e

    if not isinstance(raw, dict):
        raise SchemaLoadError(f"Schema root must be an object: {p}")

    return raw
