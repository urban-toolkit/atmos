from __future__ import annotations
from typing import Any

from atmos_server.core.compiler.models import Artifact
from atmos_server.core.compiler.ports import CompilerPorts

def add_geojson_artifact(
    *,
    ports: CompilerPorts,
    artifacts: list[Artifact],
    view: dict[str, Any],
    layer: dict[str, Any],
    view_id: str,
    layer_id: str,
    gtype: str,
    geom_step_id: str,
    geom: dict[str, Any],
    reuse_from_step_id: str | None = None,
    shared_asset: bool = False,
) -> None:
    repeat = view.get("_repeat") if isinstance(view.get("_repeat"), dict) else None

    if shared_asset and isinstance(repeat, dict):
        base_view_id = repeat.get("baseViewId", view_id)
        out_name = f"{base_view_id}-{layer_id}"
    else:
        out_name = f"{view_id}-{layer_id}"
    # out_name = f"{view_id}-{layer_id}"

    encoding_any = geom.get("encoding")
    encoding_dict = encoding_any if isinstance(encoding_any, dict) else None

    render = ports.render.build_render(
        geometry_type=gtype,
        encoding=encoding_dict,
    )

    metadata: dict[str, Any] = {
        "geometryType": gtype,
        "viewId": view_id,
        "layerId": layer_id,
    }

    if gtype == "vector" and isinstance(encoding_dict, dict):
        style = encoding_dict.get("style")
        if isinstance(style, dict):
            glyph = style.get("glyph")
            if isinstance(glyph, dict):
                metadata["glyph"] = glyph

    if render is not None:
        metadata["render"] = render

    if isinstance(view.get("_repeat"), dict):
        metadata["repeat"] = view["_repeat"]

    if reuse_from_step_id is not None:
        metadata["reuse"] = {
            "kind": "geometry-step",
            "fromProducerStep": reuse_from_step_id,
        }

    mask = layer.get("mask")
    if isinstance(mask, dict):
        metadata["mask"] = mask

    artifacts.append(
        Artifact(
            id=f"artifact:{view_id}:{layer_id}",
            format="geojson",
            producer_step=geom_step_id,
            path=f"{out_name}.geojson",
            metadata=metadata,
        )
    )

# def add_geojson_artifact(
#     *,
#     ports: CompilerPorts,
#     artifacts: list[Artifact],
#     view: dict[str, Any],
#     layer: dict[str, Any],
#     view_id: str,
#     layer_id: str,
#     gtype: str,
#     geom_step_id: str,
#     geom: dict[str, Any],
# ) -> None:
#     out_name = f"{view_id}-{layer_id}"

#     encoding_any = geom.get("encoding")
#     encoding_dict = encoding_any if isinstance(encoding_any, dict) else None

#     render = ports.render.build_render(
#         geometry_type=gtype,
#         encoding=encoding_dict,
#     )

#     metadata: dict[str, Any] = {
#         "geometryType": gtype,
#         "viewId": view_id,
#         "layerId": layer_id,
#     }

#     # NEW: preserve vector glyph info for the frontend
#     if gtype == "vector" and isinstance(encoding_dict, dict):
#         style = encoding_dict.get("style")
#         if isinstance(style, dict):
#             glyph = style.get("glyph")
#             if isinstance(glyph, dict):
#                 metadata["glyph"] = glyph

#     if render is not None:
#         metadata["render"] = render

#     if isinstance(view.get("_repeat"), dict):
#         metadata["repeat"] = view["_repeat"]
    
#     mask = layer.get("mask")
#     if isinstance(mask, dict):
#         metadata["mask"] = mask

#     artifacts.append(
#         Artifact(
#             id=f"artifact:{view_id}:{layer_id}",
#             format="geojson",  # type: ignore[assignment]
#             producer_step=geom_step_id,
#             path=f"{out_name}.geojson",
#             metadata=metadata,
#         )
#     )