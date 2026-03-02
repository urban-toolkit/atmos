# atmos_server/compiler/v0_1/spec_nav.py
from __future__ import annotations
from typing import Any

def infer_repeat_data_id(spec: dict[str, Any], *, target_view: str, target_layer: str) -> str:
    """
    Infer the dataset/derived-data id to repeat over by looking at:
      composition.views[target_view].layers[target_layer].geometry.input.data
    Raises ValueError with a helpful message if it cannot infer.
    """
    composition = spec.get("composition") or {}
    views = composition.get("views") or []
    if not isinstance(views, list):
        raise ValueError("composition.views must be a list")

    view_obj: dict[str, Any] | None = None
    for v in views:
        if isinstance(v, dict) and v.get("id") == target_view:
            view_obj = v
            break
    if view_obj is None:
        raise ValueError(f"repeatView: targetView '{target_view}' not found")

    layers = view_obj.get("layers") or []
    if not isinstance(layers, list):
        raise ValueError(f"repeatView: view '{target_view}' layers must be a list")

    layer_obj: dict[str, Any] | None = None
    for lyr in layers:
        if isinstance(lyr, dict) and lyr.get("id") == target_layer:
            layer_obj = lyr
            break
    if layer_obj is None:
        raise ValueError(f"repeatView: targetLayer '{target_layer}' not found in view '{target_view}'")

    geom = layer_obj.get("geometry")
    if not isinstance(geom, dict):
        raise ValueError(f"repeatView: layer '{target_layer}' in view '{target_view}' is missing geometry")

    ginput = geom.get("input")
    if not isinstance(ginput, dict):
        raise ValueError(
            f"repeatView: layer '{target_layer}' in view '{target_view}' is missing geometry.input"
        )

    data_id = ginput.get("data")
    if not isinstance(data_id, str) or not data_id.strip():
        raise ValueError(
            f"repeatView: cannot infer dataset id; expected geometry.input.data "
            f"on layer '{target_layer}' in view '{target_view}'"
        )

    return data_id.strip()