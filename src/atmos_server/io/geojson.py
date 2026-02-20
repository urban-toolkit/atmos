from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_geojson(path: str | Path) -> dict[str, Any]:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"GeoJSON not found: {p}")
    if not p.is_file():
        raise FileNotFoundError(f"GeoJSON path is not a file: {p}")

    data = json.loads(p.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or data.get("type") not in {"FeatureCollection", "Feature"}:
        # Keep permissive, but sanity check enough to catch obvious mistakes
        raise ValueError(f"Invalid GeoJSON (expected FeatureCollection/Feature): {p}")

    return data