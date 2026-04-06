from __future__ import annotations
from typing import Any

from .atmos_lite_translator import translate

def is_atmos_lite(spec: dict[str, Any]) -> bool:
    return spec.get("format") != "atmos"

def normalize_spec(spec: dict[str, Any]) -> dict[str, Any]:
    if is_atmos_lite(spec):
        return translate(spec)
    return spec