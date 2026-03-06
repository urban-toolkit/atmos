from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from atmos_server.runtime.errors import SchemaLoadError, SpecLoadError


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
