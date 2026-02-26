from __future__ import annotations

from typing import Any, TypeGuard

from atmos_server.compiler.types import (
    Artifact,
    InputRef,
    Plan,
    PlanMeta,
    Step,
)


def _safe_id(prefix: str, raw: Any, fallback_i: int) -> str:
    if isinstance(raw, str) and raw.strip():
        return raw.strip()
    return f"{prefix}{fallback_i}"

def _is_dict(x: Any) -> TypeGuard[dict[str, Any]]:
    return isinstance(x, dict)

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

def _build_render_from_encoding(
    gtype: str,
    encoding: dict[str, Any] | None,
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
    # ISOLINE => MapLibre line layer
    # -----------------------------
    if gtype == "isoline":
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

# def _build_render_from_encoding(
#     gtype: str,
#     encoding: dict[str, Any] | None,
# ) -> dict[str, Any] | None:
#     """
#     Convert Atmos encoding (v0.1-ish) into a runtime render block for the manifest.
#     The interface can then translate to renderer-specific expressions (e.g., MapLibre).
#     """
#     if not encoding or not isinstance(encoding, dict):
#         return None

#     channels = encoding.get("channels") or {}
#     if not isinstance(channels, dict):
#         channels = {}

#     style = encoding.get("style") or {}
#     if not isinstance(style, dict):
#         style = {}

#     # We currently generate GeoJSON sources and render them as MapLibre "fill" layers
#     # for both mesh and polygon (polygons may be filled transparently with outlines).
#     render: dict[str, Any] = {
#         "renderer": "maplibre",
#         "layerType": "fill",
#         "paint": {},
#     }
#     paint: dict[str, Any] = render["paint"]

#     # ---- Opacity (NumberConstant only for now)
#     opacity = _get_number_constant(channels.get("opacity"))
#     if opacity is not None:
#         paint["fill-opacity"] = opacity

#     # ---- Stroke outline (ColorConstant)
#     stroke_color = _get_color_constant(channels.get("stroke"))
#     if stroke_color is not None:
#         paint["fill-outline-color"] = stroke_color

#     # ---- Fill color
#     fill = channels.get("fill")

#     # (A) constant fill
#     fill_const = _get_color_constant(fill)
#     if fill_const is not None:
#         paint["fill-color"] = fill_const
#     else:
#         # (B) field-driven fill (ColorField)
#         if _is_dict(fill) and isinstance(fill.get("field"), str) and fill["field"].strip():
#             field = fill["field"].strip()
#             scale = fill.get("scale")
#             if _is_dict(scale):
#                 # We prefer stops when present (range.stops could be palette or value-stops)
#                 range_ = scale.get("range")
#                 stops_payload: list[dict[str, Any]] | None = None

#                 if _is_dict(range_) and isinstance(range_.get("stops"), list):
#                     raw_stops = range_["stops"]

#                     # Two legal-ish shapes in your schema:
#                     # - palette stops: ["#...", "#...", ...]
#                     # - value stops: [{"value": n, "color": "#..."}, ...]
#                     if raw_stops and all(isinstance(s, str) for s in raw_stops):
#                         # Palette only (no values): keep it as palette, interface decides mapping
#                         paint["fill-color"] = {
#                             "kind": "color-palette",
#                             "field": field,
#                             "type": scale.get("type", "linear"),
#                             "palette": [s for s in raw_stops if isinstance(s, str)],
#                             "clamp": bool(scale.get("clamp", False)),
#                         }
#                     else:
#                         # Value/color stops
#                         stops_payload = []
#                         for s in raw_stops:
#                             if not _is_dict(s):
#                                 continue
#                             v = s.get("value")
#                             c = s.get("color")
#                             if isinstance(v, (int, float)) and isinstance(c, str) and c.strip():
#                                 stops_payload.append({"value": float(v), "color": c.strip()})

#                         if stops_payload:
#                             # nodataColor commonly lives under style.mesh.nodataColor
#                             nodata_color = None
#                             mesh_style_any = style.get("mesh")
#                             mesh_style: dict[str, Any] | None = mesh_style_any if isinstance(mesh_style_any, dict) else None
#                             if mesh_style is not None and isinstance(mesh_style.get("nodataColor"), str):
#                                 nodata_color = mesh_style["nodataColor"]

#                             paint["fill-color"] = {
#                                 "kind": "color-stops",
#                                 "field": field,
#                                 "type": scale.get("type", "linear"),
#                                 "stops": stops_payload,
#                                 "clamp": bool(scale.get("clamp", False)),
#                                 **({"nodataColor": nodata_color} if nodata_color else {}),
#                             }
#                 else:
#                     scale_any = fill.get("scale")
#                     scale: dict[str, Any] | None = scale_any if isinstance(scale_any, dict) else None

#                     if scale is not None:
#                         range_any = scale.get("range")
#                         range_: dict[str, Any] | None = range_any if isinstance(range_any, dict) else None

#                         # stops path...
#                         if range_ is not None:
#                             stops_any = range_.get("stops")
#                             if isinstance(stops_any, list):
#                                 raw_stops = stops_any
#                                 ...
#                         else:
#                             scheme_any = scale.get("scheme")
#                             if isinstance(scheme_any, str) and scheme_any.strip():
#                                 domain_any = scale.get("domain")
#                                 paint["fill-color"] = {
#                                     "kind": "color-scheme",
#                                     "field": field,
#                                     "scheme": scheme_any.strip(),
#                                     "type": scale.get("type"),
#                                     **({"domain": domain_any} if domain_any is not None else {}),
#                                     "reverse": bool(scale.get("reverse", False)),
#                                     "clamp": bool(scale.get("clamp", False)),
#                                 }

#     # If we ended up with no paint keys, omit render entirely
#     if not paint:
#         return None

#     return render

def compile_v0_1(spec: dict[str, Any], schema_version: str) -> Plan:
    """
    Compiler for Atmos schema v0.1.

    Produces a stable Plan(IR) that the executor can run without caring
    about the original spec version.
    """

    meta = PlanMeta(schema_version=schema_version, spec_id=spec.get("id"))

    inputs: list[InputRef] = []
    steps: list[Step] = []
    artifacts: list[Artifact] = []

    # ---- Data -> load steps
    data_items = spec.get("data") or []
    data_id_to_upstream_step: dict[str, str] = {}
    data_by_id: dict[str, dict[str, Any]] = {}

    for i, d in enumerate(data_items):
        if not isinstance(d, dict):
            continue
        data_id = _safe_id("data_", d.get("id"), i)
        inputs.append(InputRef(data_id=data_id))
        data_by_id[data_id] = d

        step_id = f"load:{data_id}"
        data_id_to_upstream_step[data_id] = step_id

        steps.append(
            Step(
                id=step_id,
                kind="load",
                depends_on=(),
                params={
                    "dataId": data_id,
                    "source": d.get("source"),
                    "dimensions": d.get("dimensions"),
                    "variables": d.get("variables"),
                },
            )
        )

        # Inject default time slicing for NetCDF (Option A: always index 0)
        source = d.get("source") or {}
        if isinstance(source, dict) and source.get("type") == "netcdf":
            time_step_id = f"time:{data_id}"
            steps.append(
                Step(
                    id=time_step_id,
                    kind="transform",
                    depends_on=(step_id,),
                    params={"type": "select_time_index", "index": 0},
                )
            )
            data_id_to_upstream_step[data_id] = time_step_id

    # ---- Transforms (global, v0.1)
    transforms = spec.get("transform") or []
    transform_id_to_step: dict[str, str] = {}

    default_upstream_data_id = inputs[0].data_id if inputs else None
    default_upstream_step = data_id_to_upstream_step.get(default_upstream_data_id, "") if default_upstream_data_id else ""

    last_transform_step = default_upstream_step

    for i, t in enumerate(transforms):
        if not isinstance(t, dict):
            continue
        tid = _safe_id("t", t.get("id"), i)
        step_id = f"transform:{tid}"

        upstream = t.get("input")
        depends: list[str] = []
        if isinstance(upstream, str) and upstream in data_id_to_upstream_step:
            depends = [data_id_to_upstream_step[upstream]]
        elif isinstance(upstream, str) and upstream in transform_id_to_step:
            depends = [transform_id_to_step[upstream]]
        elif last_transform_step:
            depends = [last_transform_step]

        steps.append(
            Step(
                id=step_id,
                kind="transform",
                depends_on=tuple(depends),
                params=t,
            )
        )

        transform_id_to_step[tid] = step_id
        last_transform_step = step_id


    # ---- Geometry from composition/views/layers (v0.1 examples)
    composition = spec.get("composition") or {}
    views = composition.get("views") or []

    for vi, view in enumerate(views):
        if not isinstance(view, dict):
            continue
        view_id = _safe_id("view", view.get("id"), vi)

        layers = view.get("layers") or []
        for li, layer in enumerate(layers):
            if not isinstance(layer, dict):
                continue
            layer_id = _safe_id("layer", layer.get("id"), li)

            geom = layer.get("geometry")
            if not isinstance(geom, dict):
                continue

            gtype = geom.get("type") or "unknown"
            geom_step_id = f"geometry:{view_id}:{layer_id}"

            # Resolve upstream by geometry.input.data (if provided)
            ginput = geom.get("input") or {}
            upstream_step = default_upstream_step
            if isinstance(ginput, dict):
                input_data = ginput.get("data")
                if isinstance(input_data, str) and input_data in data_id_to_upstream_step:
                    upstream_step = data_id_to_upstream_step[input_data]

            # Enrich mesh geometry with resolved NetCDF keys (var, lat, lon)
            geom_params = dict(geom)
            geom_params["_viewId"] = view_id
            geom_params["_layerId"] = layer_id

            if gtype in ("mesh", "isoband", "isoline") and isinstance(ginput, dict):
                input_data = ginput.get("data")
                input_var = ginput.get("variable")

                if isinstance(input_data, str) and input_data in data_by_id:
                    d = data_by_id[input_data]
                    dims = d.get("dimensions") or {}
                    lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
                    lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

                    var_key = None
                    vars_ = d.get("variables") or []
                    if isinstance(input_var, str) and isinstance(vars_, list):
                        for vv in vars_:
                            if isinstance(vv, dict) and vv.get("id") == input_var:
                                var_key = vv.get("key")
                                break

                    geom_params["_resolved"] = {
                        "dataId": input_data,
                        "variableId": input_var,
                        "variableKey": var_key,
                        "latKey": lat_key,
                        "lonKey": lon_key,
                    }

            steps.append(
                Step(
                    id=geom_step_id,
                    kind="geometry",
                    depends_on=(upstream_step,) if upstream_step else (),
                    params=geom_params,
                )
            )

            # ---- Artifact + manifest metadata (now includes render info)
            out_name = f"{view_id}-{layer_id}"

            geom_dict: dict[str, Any] = geom  # after `if not isinstance(geom, dict): continue`
            encoding_any = geom_dict.get("encoding")
            encoding_dict: dict[str, Any] | None = encoding_any if isinstance(encoding_any, dict) else None
            render = _build_render_from_encoding(gtype=gtype, encoding=encoding_dict)

            metadata: dict[str, Any] = {
                "geometryType": gtype,
                "viewId": view_id,
                "layerId": layer_id,
            }
            if render is not None:
                metadata["render"] = render

            artifacts.append(
                Artifact(
                    id=f"artifact:{view_id}:{layer_id}",
                    format="geojson",  # type: ignore[assignment]
                    producer_step=geom_step_id,
                    path=f"{out_name}.geojson",
                    metadata=metadata,
                )
            )

    return Plan(
        meta=meta,
        inputs=tuple(inputs),
        steps=tuple(steps),
        artifacts=tuple(artifacts),
        raw_spec=spec,
    )