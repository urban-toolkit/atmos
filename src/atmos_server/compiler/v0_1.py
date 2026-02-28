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
    # POINT => MapLibre circle layer
    # -----------------------------
    if gtype == "point":
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

        if not paint:
            return None
        return render

    # -----------------------------
    # VECTOR => MapLibre circle layer (debug/default)
    # -----------------------------
    if gtype == "vector":
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

    derived_data_to_step: dict[str, str] = {}
    derived_data_to_base_data: dict[str, str] = {}

    # ---- Data -> load steps
    data_items = spec.get("data") or []
    data_id_to_upstream_step: dict[str, str] = {}
    data_by_id: dict[str, dict[str, Any]] = {}

    def _var_id_to_key(data_id: str, var_id: str) -> str | None:
        d = data_by_id.get(data_id)
        if not isinstance(d, dict):
            return None
        vars_ = d.get("variables") or []
        if not isinstance(vars_, list):
            return None
        for vv in vars_:
            if isinstance(vv, dict) and vv.get("id") == var_id:
                k = vv.get("key")
                if isinstance(k, str) and k.strip():
                    return k.strip()
        return None

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
                    params={"type": "select_time_index", "index": 72},
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

        scope_data = t.get("data")
        if not isinstance(scope_data, str):
            tin = t.get("input")
            if isinstance(tin, dict) and isinstance(tin.get("data"), str):
                scope_data = tin.get("data")
        depends: list[str] = []

        if isinstance(scope_data, str) and scope_data in data_id_to_upstream_step:
            depends = [data_id_to_upstream_step[scope_data]]
        elif last_transform_step:
            depends = [last_transform_step]

        params = dict(t)

        if params.get("type") == "derive_wind_vector":
            tin = params.get("input") or {}
            if not isinstance(tin, dict):
                raise ValueError("derive_wind_vector requires input object")

            base_data = tin.get("data")
            if not isinstance(base_data, str) or not base_data:
                raise ValueError("derive_wind_vector requires input.data")

            vars_map = tin.get("variables") or {}
            if not isinstance(vars_map, dict):
                raise ValueError("derive_wind_vector requires input.variables object")

            u_id = vars_map.get("u")
            v_id = vars_map.get("v")
            if not isinstance(u_id, str) or not isinstance(v_id, str):
                raise ValueError("derive_wind_vector requires input.variables.u and .v (ids)")

            u_key = _var_id_to_key(base_data, u_id)
            v_key = _var_id_to_key(base_data, v_id)
            if not u_key or not v_key:
                raise ValueError(f"derive_wind_vector could not resolve keys for u='{u_id}' v='{v_id}'")

            resolved = dict(params.get("_resolved") or {})
            resolved["uKey"] = u_key
            resolved["vKey"] = v_key
            params["_resolved"] = resolved

            # derived-data tracking (so geometry can find base lat/lon keys later)
            out = params.get("output") or {}
            if isinstance(out, dict):
                out_data = out.get("data")
                if isinstance(out_data, str) and out_data:
                    derived_data_to_step[out_data] = step_id
                    derived_data_to_base_data[out_data] = base_data

        if params.get("type") == "diagnostic.slp":
            inp = params.get("input") or {}
            if not isinstance(inp, dict):
                raise ValueError("diagnostic.slp input must be an object")

            # NEW: prefer input.data (matches your desired pattern)
            base_data = inp.get("data")
            if not isinstance(base_data, str) or not base_data:
                # Back-compat fallback: allow old transform.data
                base_data = params.get("data")
            if not isinstance(base_data, str) or not base_data:
                raise ValueError("diagnostic.slp requires input.data (or legacy transform.data)")

            # Optional but useful: normalize so downstream logic can assume params["data"]
            params["data"] = base_data

            sp = inp.get("surfacePressure")
            t2 = inp.get("airTemperature2m")
            r2 = inp.get("waterVaporMixingRatio2m")
            sh = inp.get("surfaceHeight")
            sg = inp.get("surfaceGeopotential")

            resolved: dict[str, Any] = {}

            if isinstance(sp, str):
                k = _var_id_to_key(base_data, sp)
                if k:
                    resolved["surfacePressureKey"] = k

            if isinstance(t2, str):
                k = _var_id_to_key(base_data, t2)
                if k:
                    resolved["airTemperature2mKey"] = k

            if isinstance(r2, str):
                k = _var_id_to_key(base_data, r2)
                if k:
                    resolved["waterVaporMixingRatio2mKey"] = k

            if isinstance(sh, str):
                k = _var_id_to_key(base_data, sh)
                if k:
                    resolved["surfaceHeightKey"] = k

            if isinstance(sg, str):
                k = _var_id_to_key(base_data, sg)
                if k:
                    resolved["surfaceGeopotentialKey"] = k

            params["_resolved"] = resolved

            # derived-data tracking so geometry can map derived -> base (same as wind)
            out = params.get("output") or {}
            if isinstance(out, dict):
                out_data = out.get("data")
                if isinstance(out_data, str) and out_data:
                    derived_data_to_step[out_data] = step_id
                    derived_data_to_base_data[out_data] = base_data

        if params.get("type") == "derive":
            tin = params.get("input") or {}
            if not isinstance(tin, dict):
                raise ValueError("derive requires input object")
            base_data = tin.get("data")
            if not isinstance(base_data, str) or not base_data:
                raise ValueError("derive requires input.data")
            
            base_data_id: str = base_data

            expr = params.get("expression") or {}
            if isinstance(expr, dict):
                def _walk(node):
                    if not isinstance(node, dict):
                        return
                    if "variable" in node and isinstance(node["variable"], str):
                        var_id = node["variable"]
  
                        k = _var_id_to_key(base_data_id, var_id)
                        if k:
                            resolved = dict(params.get("_resolved") or {})
                            var_map = dict(resolved.get("varKeyById") or {})
                            var_map[var_id] = k
                            resolved["varKeyById"] = var_map
                            params["_resolved"] = resolved
                    args = node.get("args")
                    if isinstance(args, list):
                        for a in args:
                            _walk(a)

                _walk(expr)

            # track derived output so geometry can route upstream correctly
            out = params.get("output") or {}
            if isinstance(out, dict):
                out_data = out.get("data")
                if isinstance(out_data, str) and out_data:
                    derived_data_to_step[out_data] = step_id
                    derived_data_to_base_data[out_data] = base_data
        
        steps.append(
            Step(
                id=step_id,
                kind="transform",
                depends_on=tuple(depends),
                params=params,
            )
        )

        out = t.get("output")
        if isinstance(out, dict):
            out_data = out.get("data")
            if isinstance(out_data, str) and out_data:
                derived_data_to_step[out_data] = step_id

                base = t.get("data")
                if isinstance(base, str) and base:
                    derived_data_to_base_data[out_data] = base

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
                if isinstance(input_data, str):
                    if input_data in data_id_to_upstream_step:
                        upstream_step = data_id_to_upstream_step[input_data]
                    elif input_data in derived_data_to_step:
                        upstream_step = derived_data_to_step[input_data]

            # Enrich mesh geometry with resolved NetCDF keys (var, lat, lon)
            geom_params = dict(geom)
            geom_params["_viewId"] = view_id
            geom_params["_layerId"] = layer_id

            if gtype in ("mesh", "isoband", "isoline") and isinstance(ginput, dict):
                input_data = ginput.get("data")
                input_var = ginput.get("variable")

                base_data: str | None = None
                if isinstance(input_data, str):
                    if input_data in data_by_id:
                        base_data = input_data
                    elif input_data in derived_data_to_base_data:
                        base_data = derived_data_to_base_data[input_data]

                lat_key = None
                lon_key = None
                var_key = None

                if base_data is not None:
                    d = data_by_id[base_data]
                    dims = d.get("dimensions") or {}
                    lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
                    lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

                    # For derived datasets, the xarray variable name should be the derived variable id itself
                    if isinstance(input_data, str) and input_data in derived_data_to_step:
                        if isinstance(input_var, str):
                            var_key = input_var
                    else:
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
                    "baseDataId": base_data,
                }

            if gtype == "vector":
                # input is {data, variable}
                inp = geom.get("input") or {}
                if not isinstance(inp, dict):
                    raise ValueError("vector geometry requires input object")

                input_data = inp.get("data")
                input_var = inp.get("variable")
                if not isinstance(input_data, str) or not isinstance(input_var, str):
                    raise ValueError("vector geometry requires input.data and input.variable")

                base_data = input_data
                if input_data in derived_data_to_base_data:
                    base_data = derived_data_to_base_data[input_data]

                base = data_by_id.get(base_data) or {}
                dims = base.get("dimensions") or {}
                lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
                lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

                if not isinstance(lat_key, str) or not isinstance(lon_key, str):
                    raise ValueError(f"vector geometry could not resolve lat/lon keys for base data '{base_data}'")

                resolved = dict(geom.get("_resolved") or {})
                resolved["latKey"] = lat_key
                resolved["lonKey"] = lon_key

                # convention we used in step_transform: f"{var_id}.speed"/".direction"
                resolved["speedKey"] = f"{input_var}.speed"
                resolved["directionKey"] = f"{input_var}.direction"
                resolved["variableId"] = input_var

                geom_params["_resolved"] = resolved

            if gtype == "point" and isinstance(ginput, dict):
                input_data = ginput.get("data")
                input_var  = ginput.get("variable")

                if isinstance(input_data, str) and input_data in data_by_id:
                    d = data_by_id[input_data]

                    dims = d.get("dimensions") or {}
                    lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
                    lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None
                    site_key = (dims.get("site") or {}).get("key") if isinstance(dims.get("site"), dict) else None
                    time_key = (dims.get("time") or {}).get("key") if isinstance(dims.get("time"), dict) else None

                    var_key = None
                    vars_ = d.get("variables") or []
                    if isinstance(input_var, str) and isinstance(vars_, list):
                        for vv in vars_:
                            if isinstance(vv, dict) and vv.get("id") == input_var:
                                k = vv.get("key")
                                if isinstance(k, str) and k.strip():
                                    var_key = k.strip()
                                break

                    geom_params["_resolved"] = {
                        "dataId": input_data,
                        "variableId": input_var,
                        "variableKey": var_key,
                        "latKey": lat_key,
                        "lonKey": lon_key,
                        "siteKey": site_key,
                        "timeKey": time_key,
                        "baseDataId": input_data,
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