from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from atmos_server.runtime.errors import SpecLoadError


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