from __future__ import annotations

from typing import Any, Mapping

from atmos_server.compiler.ports import RenderBuilder


class MapLibreRenderBuilder(RenderBuilder):
    """
    Default RenderBuilder for v0.1: delegates to existing build_render_from_encoding.
    """

    def __init__(self) -> None:
        # import here so the adapter doesn't impose heavy imports unless used
        from atmos_server.compiler.v0_1.build_render_from_encoding import (
            build_render_from_encoding,
        )

        self._fn = build_render_from_encoding

    def build_render(
        self,
        *,
        geometry_type: str,
        encoding: Mapping[str, Any] | None,
        defaults: Mapping[str, Any] | None = None,
    ) -> dict[str, Any] | None:
        # Match your current call style: build_render_from_encoding(geometry_type, encoding)
        # If you later want defaults, you can thread them into your function.
        return self._fn(geometry_type, dict(encoding) if encoding is not None else None)