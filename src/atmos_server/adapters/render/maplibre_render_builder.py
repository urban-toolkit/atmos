from __future__ import annotations

from typing import Any, TypeGuard, Mapping

from atmos_server.core.compiler.ports import RenderBuilder


def _is_dict(x: Any) -> TypeGuard[dict[str, Any]]:
    return isinstance(x, Mapping)


def _get_number_constant(ch: Any) -> float | None:
    # NumberConstant: {"value": number}
    if _is_dict(ch) and isinstance(ch.get("value"), (int, float)):
        return float(ch["value"])
    return None

def _get_color_constant(ch: Any) -> str | None:
    # ColorConstant: {"value": string}
    if _is_dict(ch) and isinstance(ch.get("value"), str) and ch["value"].strip():
        return ch["value"].strip()
    return None

def build_render_from_encoding(
    geometry_type: str,
    encoding: Mapping[str, Any] | None,
) -> dict[str, Any] | None:
    """
    Convert Atmos encoding (v0.1-ish) into a runtime render block for the manifest.
    The interface can then translate to renderer-specific expressions (e.g., MapLibre).

    Supports:
      - isoline: MapLibre line layer (line-color/line-width/line-opacity)
      - other geometries (mesh/isoband/polygon/etc.): MapLibre fill layer (fill-color/fill-opacity/fill-outline-color)

    Notes:
      - "field-driven" color currently supported for:
          * fill (fill-color)
          * stroke (line-color) for isolines
      - Palette-only stops are passed through as "color-palette" for the interface to map.
      - Value/color stops are passed through as "color-stops".
      - nodataColor currently read from style.mesh.nodataColor (kept for back-compat).
    """
    if not encoding or not isinstance(encoding, dict):
        return None

    channels = encoding.get("channels") or {}
    if not isinstance(channels, dict):
        channels = {}

    style = encoding.get("style") or {}
    if not isinstance(style, dict):
        style = {}

    # -----------------------------
    # Helpers: extract field-color scales
    # -----------------------------
    def _color_field_to_paint_payload(
        color_field: dict[str, Any],
        *,
        nodata_from_style_mesh: bool,
    ) -> dict[str, Any] | None:
        """
        Convert a ColorField-like dict to one of:
          - {"kind":"color-palette", ...}
          - {"kind":"color-stops", ...}
          - {"kind":"color-scheme", ...}
        """
        if not _is_dict(color_field):
            return None
        field_any = color_field.get("field")
        if not isinstance(field_any, str) or not field_any.strip():
            return None
        field = field_any.strip()

        scale_any = color_field.get("scale")
        scale: dict[str, Any] | None = scale_any if isinstance(scale_any, dict) else None
        if scale is None:
            return None

        scale_type = scale.get("type", "linear")
        clamp = bool(scale.get("clamp", False))

        # Prefer range.stops when present
        range_any = scale.get("range")
        range_: dict[str, Any] | None = range_any if isinstance(range_any, dict) else None
        if range_ is not None:
            stops_any = range_.get("stops")
            if isinstance(stops_any, list) and stops_any:
                raw_stops = stops_any

                # palette-only stops: ["#...", "#...", ...]
                if all(isinstance(s, str) for s in raw_stops):
                    return {
                        "kind": "color-palette",
                        "field": field,
                        "type": scale_type,
                        "palette": [s for s in raw_stops if isinstance(s, str)],
                        "clamp": clamp,
                    }

                # value/color stops: [{"value": n, "color": "#..."}, ...]
                stops_payload: list[dict[str, Any]] = []
                for s in raw_stops:
                    if not _is_dict(s):
                        continue
                    v = s.get("value")
                    c = s.get("color")
                    if isinstance(v, (int, float)) and isinstance(c, str) and c.strip():
                        stops_payload.append({"value": float(v), "color": c.strip()})

                if stops_payload:
                    payload: dict[str, Any] = {
                        "kind": "color-stops",
                        "field": field,
                        "type": scale_type,
                        "stops": stops_payload,
                        "clamp": clamp,
                    }

                    if nodata_from_style_mesh:
                        nodata_color = None
                        mesh_style_any = style.get("mesh")
                        mesh_style: dict[str, Any] | None = mesh_style_any if isinstance(mesh_style_any, dict) else None
                        if mesh_style is not None and isinstance(mesh_style.get("nodataColor"), str):
                            nodata_color = mesh_style["nodataColor"]
                        if nodata_color:
                            payload["nodataColor"] = nodata_color

                    return payload

        # Fallback: scheme
        scheme_any = scale.get("scheme")
        if isinstance(scheme_any, str) and scheme_any.strip():
            domain_any = scale.get("domain")
            return {
                "kind": "color-scheme",
                "field": field,
                "scheme": scheme_any.strip(),
                "type": scale_type,
                **({"domain": domain_any} if domain_any is not None else {}),
                "reverse": bool(scale.get("reverse", False)),
                "clamp": clamp,
            }

        return None


    # -----------------------------
    # POINT => MapLibre circle layer
    # -----------------------------
    if geometry_type == "point":
        render: dict[str, Any] = {"renderer": "maplibre", "layerType": "circle", "paint": {}}
        paint: dict[str, Any] = render["paint"]

        opacity = _get_number_constant(channels.get("opacity"))
        if opacity is not None:
            paint["circle-opacity"] = opacity

        # color from fill (constant or field-driven)
        fill = channels.get("fill")
        fill_const = _get_color_constant(fill)
        if fill_const is not None:
            paint["circle-color"] = fill_const
        else:
            if _is_dict(fill):
                payload = _color_field_to_paint_payload(fill, nodata_from_style_mesh=False)
                if payload is not None:
                    paint["circle-color"] = payload

        # radius from size (constant or scale payload)
        size = channels.get("size")
        size_const = _get_number_constant(size)
        if size_const is not None:
            paint["circle-radius"] = size_const
        else:
            if _is_dict(size) and isinstance(size.get("field"), str):
                paint["circle-radius"] = {
                    "kind": "number-scale",
                    "field": size["field"],
                    "scale": size.get("scale"),
                }

        # -----------------------------
        # Stroke
        # -----------------------------
        stroke = channels.get("stroke")
        stroke_const = _get_color_constant(stroke)

        if stroke_const is not None:
            paint["circle-stroke-color"] = stroke_const
        else:
            if _is_dict(stroke):
                payload = _color_field_to_paint_payload(stroke, nodata_from_style_mesh=False)
                if payload is not None:
                    paint["circle-stroke-color"] = payload

        # stroke width
        stroke_width = _get_number_constant(channels.get("strokeWidth"))

        if stroke_width is not None:
            paint["circle-stroke-width"] = stroke_width
        elif stroke_const is not None or _is_dict(stroke):
            paint["circle-stroke-width"] = 1.5
        
        if not paint:
            return None
        return render

    # -----------------------------
    # VECTOR => MapLibre circle layer (debug/default)
    # -----------------------------
    if geometry_type == "vector":
        render: dict[str, Any] = {"renderer": "maplibre", "layerType": "circle", "paint": {}}
        paint: dict[str, Any] = render["paint"]

        glyph_scale = 1.0
        gs = style.get("glyphScale")
        if isinstance(gs, (int, float)) and gs > 0:
            glyph_scale = float(gs)

        render["glyphScale"] = glyph_scale

        # opacity -> circle-opacity
        opacity = _get_number_constant(channels.get("opacity"))
        if opacity is not None:
            paint["circle-opacity"] = opacity

        # color: use stroke if present, else fallback
        stroke = channels.get("stroke")
        stroke_const = _get_color_constant(stroke)
        if stroke_const is not None:
            paint["circle-color"] = stroke_const
        else:
            # (optional) support field-driven color later
            pass

        # size: if constant, map to radius; if field-driven, emit a payload for interface
        size = channels.get("size")
        size_const = _get_number_constant(size)
        if size_const is not None:
            paint["circle-radius"] = size_const
        else:
            # If it's a NumberField, pass through for your interface to convert later.
            if _is_dict(size) and isinstance(size.get("field"), str):
                paint["circle-radius"] = {
                    "kind": "number-scale",
                    "field": size["field"],
                    "scale": size.get("scale"),
                }

        if not paint:
            return None
        return render

    # -----------------------------
    # ISOLINE => MapLibre line layer
    # -----------------------------
    if geometry_type == "isoline":
        render: dict[str, Any] = {"renderer": "maplibre", "layerType": "line", "paint": {}}
        paint: dict[str, Any] = render["paint"]

        # Opacity (NumberConstant)
        opacity = _get_number_constant(channels.get("opacity"))
        if opacity is not None:
            paint["line-opacity"] = opacity

        # Stroke color: constant OR field-driven
        stroke = channels.get("stroke")

        stroke_const = _get_color_constant(stroke)
        if stroke_const is not None:
            paint["line-color"] = stroke_const
        else:
            # Field-driven stroke (ColorField)
            if _is_dict(stroke):
                payload = _color_field_to_paint_payload(stroke, nodata_from_style_mesh=False)
                if payload is not None:
                    paint["line-color"] = payload

        # Stroke width (NumberConstant) with optional style fallback
        stroke_width = _get_number_constant(channels.get("strokeWidth"))
        if stroke_width is None:
            isoline_style_any = style.get("isoline")
            isoline_style = isoline_style_any if isinstance(isoline_style_any, dict) else None
            if isoline_style is not None:
                sw = isoline_style.get("strokeWidth")
                if isinstance(sw, (int, float)):
                    stroke_width = float(sw)

        if stroke_width is not None:
            paint["line-width"] = stroke_width

        # If we ended up with no paint keys, omit render entirely
        if not paint:
            return None
        return render

    # -----------------------------
    # DEFAULT => MapLibre fill layer
    # -----------------------------
    render: dict[str, Any] = {
        "renderer": "maplibre",
        "layerType": "fill",
        "paint": {},
    }
    paint: dict[str, Any] = render["paint"]

    # Opacity (NumberConstant)
    opacity = _get_number_constant(channels.get("opacity"))
    if opacity is not None:
        paint["fill-opacity"] = opacity

    # Stroke outline (ColorConstant) for fills
    stroke_color = _get_color_constant(channels.get("stroke"))
    if stroke_color is not None:
        paint["fill-outline-color"] = stroke_color

    # Fill color: constant OR field-driven
    fill = channels.get("fill")

    # (A) constant fill
    fill_const = _get_color_constant(fill)
    if fill_const is not None:
        paint["fill-color"] = fill_const
    else:
        # (B) field-driven fill (ColorField)
        if _is_dict(fill):
            payload = _color_field_to_paint_payload(fill, nodata_from_style_mesh=True)
            if payload is not None:
                paint["fill-color"] = payload

    # If we ended up with no paint keys, omit render entirely
    if not paint:
        return None

    return render


class MapLibreRenderBuilder(RenderBuilder):
    def build_render(
        self,
        *,
        geometry_type: str,
        encoding: Mapping[str, Any] | None
    ) -> dict[str, Any] | None:
        # Match your current call style: build_render_from_encoding(geometry_type, encoding)
        return build_render_from_encoding(geometry_type, encoding)