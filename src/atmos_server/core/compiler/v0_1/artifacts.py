# atmos_server/compiler/v0_1/artifacts.py
from __future__ import annotations
from typing import Any

from atmos_server.core.compiler.models import Artifact
from atmos_server.core.compiler.ports import CompilerPorts

def add_geojson_artifact(
    *,
    ports: CompilerPorts,
    artifacts: list[Artifact],
    view: dict[str, Any],
    view_id: str,
    layer_id: str,
    gtype: str,
    geom_step_id: str,
    geom: dict[str, Any],
) -> None:
    out_name = f"{view_id}-{layer_id}"
    encoding_any = geom.get("encoding")
    encoding_dict = encoding_any if isinstance(encoding_any, dict) else None
    render = ports.render.build_render(geometry_type=gtype, encoding=encoding_dict)

    metadata: dict[str, Any] = {"geometryType": gtype, "viewId": view_id, "layerId": layer_id}
    if render is not None:
        metadata["render"] = render
    if isinstance(view.get("_repeat"), dict):
        metadata["repeat"] = view["_repeat"]

    artifacts.append(
        Artifact(
            id=f"artifact:{view_id}:{layer_id}",
            format="geojson",  # type: ignore[assignment]
            producer_step=geom_step_id,
            path=f"{out_name}.geojson",
            metadata=metadata,
        )
    )