from __future__ import annotations
from typing import Any

def safe_id(prefix: str, raw: Any, fallback_i: int) -> str:
    if isinstance(raw, str) and raw.strip():
        return raw.strip()
    return f"{prefix}{fallback_i}"