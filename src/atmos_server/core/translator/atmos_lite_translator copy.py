"""
translator.py — Atmos-Lite → Atmos spec normalizer.

Derived from a precise structural diff between the two real schemas
and the concrete example pair (lite_ex8_simple_heatmap_slider.json →
paper-sc1-ex1-modified.json).

Mapping summary
───────────────
DATA
  data[].file[{path|url}]        → data[].source {type, path|url}
      file type inferred: .csv → "csv" (grid: scattered)
                          else → "netcdf" (grid: curvilinear)
  data[].dims {lat,lng,time[,level]}
                                 → data[].dims {
                                       lat:   {key: <value>},
                                       lon:   {key: <value>},        # lng → lon
                                       time:  {dim:"time", key:<v>,
                                               type:"datetime",
                                               timezone:"UTC",
                                               format:""},
                                       level: {key: <value>}         # if present
                                   }
  data[].variables ["v1","v2"]   → data[].vars [{id:"v1", key:"v1"}, …]
  data[].grid                    → injected: {type:"curvilinear"|"scattered"}

TRANSFORM  (id_out[] split, derive/aggregate/join reshaping — unchanged)

COMPOSITION
  composition.interaction [{type, targets, select}]
                                 → composition.interactions [{
                                       type,
                                       action: {
                                           select: {
                                               dim: <select>,
                                               target: [{view, layers:[…]}]
                                           }
                                       }
                                   }]
  views[].type:"map"             → views[].frame:{type:"map"}  (type key removed)
  views[].type:"chart"           → views[].frame:{type:"chart"}
  layer.geometry {mark,data,encoding}
                                 → layer.geometry {
                                       type: <mark.type>,
                                       input: {data:<ds_id>, var:<var>},
                                       encoding: {channels: {…}}
                                   }
  encoding.color_scale {palette,domain,clamp,gamma}
                                 → channels.fill.scale {type:"sequential",
                                       scheme:<palette>, domain, clamp, gamma}
"""

from __future__ import annotations

import copy
import warnings
from pathlib import PurePosixPath
from typing import Any


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def normalize_spec(spec: dict[str, Any]) -> dict[str, Any]:
    """Convert an Atmos-Lite spec dict into an Atmos spec dict.

    The input is never mutated; a deep copy is made first.
    Raises ``TranslationError`` on unrecoverable structural problems.
    """
    if not isinstance(spec, dict):
        raise TranslationError("Spec must be a JSON object (dict).")

    src = copy.deepcopy(spec)
    out: dict[str, Any] = {}

    if "constants" in src:
        out["constants"] = src["constants"]

    if "data" not in src:
        raise TranslationError("Spec is missing required key 'data'.")
    out["data"] = [_translate_data_entry(d) for d in src["data"]]

    if "transform" in src:
        out["transform"] = _translate_transforms(src["transform"])

    if "composition" not in src:
        raise TranslationError("Spec is missing required key 'composition'.")
    out["composition"] = _translate_composition(src["composition"])

    _forward_unknown(src, out, known={"constants", "data", "transform", "composition"})
    return out


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

def _translate_data_entry(entry: dict[str, Any]) -> dict[str, Any]:
    _require_keys(entry, ["id", "dims", "variables", "file"], context="data entry")

    file_entries: list[dict] = entry["file"]
    if not file_entries:
        raise TranslationError(f"data entry '{entry['id']}' has an empty 'file' array.")

    source, grid_type = _translate_source(file_entries[0])

    result: dict[str, Any] = {
        "id":     entry["id"],
        "source": source,
        "dims":   _translate_dims(entry["dims"]),
        "grid":   {"type": grid_type},
        "vars":   _translate_variables(entry["variables"]),
    }

    _forward_unknown(entry, result, known={"id", "dims", "variables", "file"})
    return result


def _translate_source(f: dict[str, Any]) -> tuple[dict[str, Any], str]:
    """Return (source_object, grid_type) from a Lite file entry."""
    if "path" in f:
        path = f["path"]
        suffix = PurePosixPath(path).suffix.lower()
        grid = "scattered" if suffix == ".csv" else "curvilinear"
        return {"type": "csv" if suffix == ".csv" else "netcdf", "path": path}, grid
    if "url" in f:
        url = f["url"]
        suffix = PurePosixPath(url.split("?")[0]).suffix.lower()
        grid = "scattered" if suffix == ".csv" else "curvilinear"
        return {"type": "csv" if suffix == ".csv" else "netcdf", "url": url}, grid
    raise TranslationError(f"File entry has neither 'path' nor 'url': {f!r}")


def _translate_dims(dims: dict[str, Any]) -> dict[str, Any]:
    """Convert Lite flat string dims to Atmos structured dim objects."""
    _require_keys(dims, ["lat", "lng", "time"], context="dims")

    result: dict[str, Any] = {
        "lat": {"key": dims["lat"]},
        "lon": {"key": dims["lng"]},    # lng → lon
        "time": {
            "dim":      "time",
            "key":      dims["time"],
            "type":     "datetime",
            "timezone": "UTC",
            "format":   "",
        },
    }
    if "level" in dims:
        result["level"] = {"key": dims["level"]}

    _forward_unknown(dims, result, known={"lat", "lng", "time", "level"})
    return result


def _translate_variables(variables: list[str]) -> list[dict[str, Any]]:
    """Convert Lite variables string list to Atmos vars object list."""
    return [{"id": v, "key": v} for v in variables]


# ---------------------------------------------------------------------------
# Transform
# ---------------------------------------------------------------------------

def _translate_transforms(transforms: list[dict[str, Any]]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for t in transforms:
        result.extend(_translate_transform(t))
    return result


def _translate_transform(t: dict[str, Any]) -> list[dict[str, Any]]:
    """Reshape a Lite transform into one or more Atmos transforms.

    Lite:  {id_out: [ids], derive|aggregate|join: {…}}
    Atmos: {type: "derive"|"aggregate"|"reduce"|"join", expr: {…}, out: {data, var?}, …}

    Each id_out entry produces a separate Atmos transform object.
    Aggregate transforms with ``across: "member"`` become ``type: "reduce"``.
    """
    _require_keys(t, ["id_out"], context="transform")

    id_outs: list[str] = t["id_out"]
    if not id_outs:
        raise TranslationError("transform.id_out must have at least one element.")

    if "derive" in t:
        return _build_derive_transforms(t["derive"], id_outs)
    elif "aggregate" in t:
        return _build_aggregate_transforms(t["aggregate"], id_outs)
    elif "join" in t:
        return _build_join_transforms(t["join"], id_outs)
    else:
        known = {"id_out", "derive", "aggregate", "join"}
        extra = {k: v for k, v in t.items() if k not in known}
        if extra:
            warnings.warn(
                f"Unknown transform type with keys {list(extra.keys())}; "
                "passing through as-is.",
                TranslationWarning, stacklevel=4,
            )
            return [dict(extra, out={"data": oid}) for oid in id_outs]
        else:
            raise TranslationError(f"Transform has no recognised operation key: {t!r}")


def _make_arg(ref: Any) -> dict[str, Any]:
    """Convert a Lite derive argument to an Atmos expr arg.

    - String with '.' → {data: <dataset>, var: <variable>}
    - Plain string     → {data: <ref>}
    - Number           → {const: <value>}
    """
    if isinstance(ref, (int, float)):
        return {"const": ref}
    if isinstance(ref, str):
        ds, var = _split_data_ref(ref)
        result: dict[str, Any] = {"data": ds}
        if var:
            result["var"] = var
        return result
    return ref


def _build_derive_transforms(
    derive: dict[str, Any], id_outs: list[str],
) -> list[dict[str, Any]]:
    """Translate a Lite derive block into Atmos derive transform(s).

    Patterns:
      wind:    {data_u, data_v}    → op:"diagnostic.wind.polar", args with role
      slp:     {data_sp, …}       → op:"diagnostic.slp", args with role
      binary:  {op, left, right?}  → op:<op>, args:[left_arg, right_arg?]
    """
    expr: dict[str, Any]

    if "data_u" in derive and "data_v" in derive:
        u_arg = _make_arg(derive["data_u"])
        u_arg["role"] = "u"
        v_arg = _make_arg(derive["data_v"])
        v_arg["role"] = "v"
        expr = {
            "op":   "diagnostic.wind.polar",
            "args": [u_arg, v_arg],
        }

    elif "data_sp" in derive:
        _require_keys(derive, ["data_sp", "data_at2m", "data_wvmr2m", "data_hgt"],
                      context="derive_slp")
        sp_arg   = _make_arg(derive["data_sp"]);   sp_arg["role"]   = "sp"
        at2m_arg = _make_arg(derive["data_at2m"]); at2m_arg["role"] = "at2m"
        wvmr_arg = _make_arg(derive["data_wvmr2m"]); wvmr_arg["role"] = "wvmr2m"
        hgt_arg  = _make_arg(derive["data_hgt"]);  hgt_arg["role"]  = "hgt"
        expr = {
            "op":   "diagnostic.slp",
            "args": [sp_arg, at2m_arg, wvmr_arg, hgt_arg],
        }

    elif "op" in derive and "left" in derive:
        args = [_make_arg(derive["left"])]
        if "right" in derive:
            args.append(_make_arg(derive["right"]))
        expr = {"op": derive["op"], "args": args}

    else:
        warnings.warn(
            f"Unrecognised derive shape — passing through as-is: {derive!r}",
            TranslationWarning, stacklevel=5,
        )
        expr = derive

    return [
        {"type": "derive", "expr": expr, "out": {"data": oid}}
        for oid in id_outs
    ]


def _build_aggregate_transforms(
    agg: dict[str, Any], id_outs: list[str],
) -> list[dict[str, Any]]:
    """Translate a Lite aggregate block into Atmos aggregate/reduce transform(s).

    Lite:  {data, across, op, frequency?}
    Atmos aggregate: {type:"aggregate", across, expr:{op, args, freq?}, out:{data}}
    Atmos reduce:    {type:"reduce",    across, expr:{op, args},        out:{data}}

    When ``across`` is ``"member"``, the Atmos type becomes ``"reduce"``.
    """
    _require_keys(agg, ["data", "across", "op"], context="aggregate")

    across = agg["across"]
    atmos_type = "reduce" if across == "member" else "aggregate"

    data_arg = _make_arg(agg["data"])

    inner_expr: dict[str, Any] = {
        "op":   agg["op"],
        "args": [data_arg],
    }
    if "frequency" in agg:
        inner_expr["freq"] = agg["frequency"]

    results: list[dict[str, Any]] = []
    for oid in id_outs:
        transform: dict[str, Any] = {
            "type":    atmos_type,
            "across":  across,
            "expr":    inner_expr,
            "out":     {"data": oid},
        }
        # Forward any unknown keys (e.g. select, interval, geom)
        known_agg = {"data", "across", "op", "frequency"}
        for k, v in agg.items():
            if k not in known_agg:
                transform[k] = v
        results.append(transform)
    return results


def _build_join_transforms(
    join: dict[str, Any], id_outs: list[str],
) -> list[dict[str, Any]]:
    """Translate a Lite join block into Atmos join transform(s).

    Lite:  {data1, data2, relationship}
    Atmos: {type:"join", expr:{args:[…], relationship}, out:{data}}
    """
    _require_keys(join, ["data1", "data2", "relationship"], context="join")

    args = [_make_arg(join["data1"]), _make_arg(join["data2"])]
    inner_expr: dict[str, Any] = {
        "args":         args,
        "relationship": join["relationship"],
    }

    # Forward unknown keys into expr
    known_join = {"data1", "data2", "relationship"}
    for k, v in join.items():
        if k not in known_join:
            inner_expr[k] = v

    return [
        {"type": "join", "expr": inner_expr, "out": {"data": oid}}
        for oid in id_outs
    ]


# ---------------------------------------------------------------------------
# Composition
# ---------------------------------------------------------------------------

def _translate_composition(comp: dict[str, Any]) -> dict[str, Any]:
    _require_keys(comp, ["views"], context="composition")

    result: dict[str, Any] = {
        "views": [_translate_view(v) for v in comp["views"]],
    }

    if "context" in comp:
        result["context"] = comp["context"]

    # Lite uses "interaction" (singular); Atmos uses "interactions" (plural)
    if "interaction" in comp:
        # Build a view_id → [layer_ids] index from the raw Lite views so that
        # _translate_interaction can populate the required layers list.
        view_layers: dict[str, list[str]] = {
            v["id"]: [la["id"] for la in v.get("layers", [])]
            for v in comp["views"]
            if "id" in v
        }
        result["interactions"] = [
            _translate_interaction(ia, view_layers) for ia in comp["interaction"]
        ]

    _forward_unknown(comp, result, known={"views", "context", "interaction"})
    return result


def _translate_interaction(
    ia: dict[str, Any],
    view_layers: dict[str, list[str]],
) -> dict[str, Any]:
    """Reshape a Lite interaction into Atmos interaction.

    Lite:  {type, targets:[{view}], select}
    Atmos: {type, action:{select:{dim:<select>, target:[{view, layers:[…]}]}}}

    Lite targets carry only a view ID. Atmos requires at least one layer ID
    (minItems:1), so we infer the full layer list from the view definition.
    """
    _require_keys(ia, ["type", "targets", "select"], context="interaction")

    atmos_targets = []
    for t in ia["targets"]:
        view_id = t["view"]
        # Prefer explicitly listed layers; fall back to all layers in the view.
        layers = t.get("layers") or view_layers.get(view_id, [])
        if not layers:
            warnings.warn(
                f"Interaction targets view '{view_id}' which has no layers; "
                "Atmos requires at least one layer ID.",
                TranslationWarning, stacklevel=3,
            )
        atmos_targets.append({"view": view_id, "layers": layers})

    return {
        "type": ia["type"],
        "action": {
            "select": {
                "dim":    ia["select"],
                "target": atmos_targets,
            }
        },
    }


def _translate_view(view: dict[str, Any]) -> dict[str, Any]:
    _require_keys(view, ["id", "type"], context="view")
    vtype = view["type"]
    if vtype == "map":
        return _translate_map_view(view)
    if vtype == "chart":
        return _translate_chart_view(view)
    warnings.warn(
        f"Unknown view type '{vtype}'; passing through as-is.",
        TranslationWarning, stacklevel=4,
    )
    return dict(view)


def _translate_map_view(view: dict[str, Any]) -> dict[str, Any]:
    _require_keys(view, ["id", "type", "layers"], context="mapView")

    result: dict[str, Any] = {
        "id":     view["id"],
        "frame":  {"type": "map"},
        "layers": [_translate_layer(la) for la in view["layers"]],
    }
    if "projection" in view:
        result["projection"] = view["projection"]
    if "bounds" in view:
        result["bounds"] = view["bounds"]

    _forward_unknown(view, result, known={"id", "type", "layers", "projection", "bounds"})
    return result


def _translate_chart_view(view: dict[str, Any]) -> dict[str, Any]:
    _require_keys(view, ["id", "type", "data", "spec"], context="chartView")

    result: dict[str, Any] = {
        "id":    view["id"],
        "frame": {"type": "chart"},
        "data":  view["data"],
        "spec":  view["spec"],
    }
    if "floating" in view:
        result["floating"] = view["floating"]

    _forward_unknown(view, result, known={"id", "type", "data", "spec", "floating"})
    return result

def _translate_mask(mask):
    if mask.get("type") != "bbox":
        return dict(mask)
    result = {"type": "bbox", "bounds": mask["bounds"]}
    if mask.get("lens") is True:
        result["interaction"] = {"on": ["drag", "resize"]}
    return result

def _translate_layer(layer: dict[str, Any]) -> dict[str, Any]:
    _require_keys(layer, ["id", "geometry"], context="layer")

    result: dict[str, Any] = {
        "id":       layer["id"],
        "geometry": _translate_geometry(layer["geometry"]),
    }
    if "mask" in layer:
        result["mask"] = _translate_mask(layer["mask"])

    _forward_unknown(layer, result, known={"id", "geometry", "mask"})
    return result


# Lite mark type → Atmos geometry type
_MARK_TO_GEOM_TYPE: dict[str, str] = {
    "heatmap": "mesh",
    "isoline": "isoline",
    "isoband": "isoband",
    "point":   "point",
    "arrow":   "vector",
    "barb":    "vector",
    "poly":    "polygon",
}


def _translate_geometry(geom: dict[str, Any]) -> dict[str, Any]:
    """Reshape Lite geometry into Atmos geometry.

    Lite mark types map to Atmos geometry types:
      heatmap → mesh   |  isoline → isoline  |  isoband → isoband
      point   → point  |  arrow   → vector   |  barb    → vector
      poly    → polygon

    For isoline/isoband, mark.steps:[start,stop,step] → build field.
    For arrow/barb, encoding is remapped: fill→size, color→stroke.
    When var is absent from the data ref, dataset name is used as fallback.
    """
    _require_keys(geom, ["mark", "data", "encoding"], context="geometry")

    mark      = geom["mark"]
    mark_type = mark.get("type", "heatmap")
    geom_type = _MARK_TO_GEOM_TYPE.get(mark_type, "mesh")

    atmos_input = _parse_data_ref(geom["data"])
    var_name    = atmos_input.get("var", "")

    # Fall back to dataset name for geometry types that require a var
    if not var_name and geom_type in ("mesh", "isoline", "isoband", "point", "vector"):
        dataset_base = atmos_input["data"].split("[")[0]
        atmos_input["var"] = dataset_base
        var_name = dataset_base

    # Build encoding channels
    if mark_type in ("arrow", "barb"):
        channels = _translate_vector_encoding(geom["encoding"], mark)
    else:
        channels = _translate_encoding(geom["encoding"], var_name)

    encoding: dict[str, Any] = {"channels": channels}

    # arrow/barb: mark type/scale → encoding.style.glyph
    if mark_type in ("arrow", "barb"):
        glyph: dict[str, Any] = {"type": mark_type}
        if "scale" in mark:
            glyph["scale"] = float(mark["scale"])
        encoding["style"] = {"glyph": glyph}

    atmos_geom: dict[str, Any] = {
        "type":     geom_type,
        "input":    atmos_input,
        "encoding": encoding,
    }

    # isoline/isoband: mark.steps:[start, stop, step] → build
    if mark_type in ("isoline", "isoband") and "steps" in mark:
        steps = mark["steps"]  # [start, stop, step_size]
        if len(steps) == 3:
            atmos_geom["build"] = [{
                "levels": {
                    "type":  "step",
                    "start": steps[0],
                    "stop":  steps[1],
                    "step":  steps[2],
                }
            }]

    return atmos_geom


def _translate_vector_encoding(enc: dict[str, Any], mark: dict[str, Any]) -> dict[str, Any]:
    """Translate encoding for arrow/barb (vector) marks.

    Lite arrow/barb encoding:
      fill:"var"       → size.field  (data-driven glyph size)
      domain:[a,b]     → size.scale.range.values
      mark.domain:[a,b] → size.scale.range.values (fallback)
      color:"#hex"     → stroke.value  (glyph colour)
      opacity          → opacity.value
    """
    channels: dict[str, Any] = {}

    fill_field = enc.get("fill", "")
    if fill_field:
        domain = enc.get("domain") or mark.get("domain")
        size_ch: dict[str, Any] = {"field": fill_field}
        if domain:
            size_ch["scale"] = {
                "type":   "linear",
                "domain": {"type": "extent"},
                "range":  {"values": list(domain)},
            }
        channels["size"] = size_ch

    if "color" in enc:
        channels["stroke"] = {"value": enc["color"]}

    channels["opacity"] = {"value": enc.get("opacity", 1.0)}

    return channels


def _parse_data_ref(ref: str) -> dict[str, Any]:
    """Parse a Lite data reference into an Atmos input dict.

    Lite supports bracket notation for dimension selection:
      'dataset'              → {data:"dataset"}
      'dataset.var'          → {data:"dataset", var:"var"}
      'dataset[dim:idx]'     → {data:"dataset", dims:{dim:[idx]}}
      'dataset.var[dim:idx]' → {data:"dataset", var:"var", dims:{dim:[idx]}}
    """
    import re
    selectors = re.findall(r"\[([^\]]+)\]", ref)
    base = re.sub(r"\[[^\]]*\]", "", ref)

    result: dict[str, Any] = {}
    if "." in base:
        dataset, var = base.split(".", 1)
        result["data"] = dataset
        if var:
            result["var"] = var
    else:
        result["data"] = base

    if selectors:
        dims: dict[str, Any] = {}
        for sel in selectors:
            if ":" in sel:
                dim, idx = sel.split(":", 1)
                try:
                    dims[dim.strip()] = [int(idx.strip())]
                except ValueError:
                    dims[dim.strip()] = [idx.strip()]
        if dims:
            result["dims"] = dims

    return result


def _split_data_ref(ref: str) -> tuple[str, str]:
    """Legacy helper for transform arg parsing (no bracket notation there)."""
    if "." in ref:
        dataset, var = ref.split(".", 1)
        return dataset, var
    return ref, ""


def _translate_encoding(enc: dict[str, Any], var_name: str = "") -> dict[str, Any]:
    """Convert a Lite encoding object into an Atmos channels dict.

    Lite key       → Atmos channel
    ───────────────────────────────
    color_scale    → fill.scale  (palette→scheme, type:"sequential" injected)
    fill           → fill.field
    color          → fill.value  (static colour)
    stroke         → stroke.field
    opacity        → opacity.value  (default 1.0 always injected)
    width          → width.value
    size           → size.value
    dash           → stroke.dash
    domain         → absorbed into scale when color_scale present; else dropped
    """
    channels: dict[str, Any] = {}

    if "color_scale" in enc:
        cs = enc["color_scale"]
        scale: dict[str, Any] = {
            "type":   "sequential",
            "scheme": cs["palette"],
            "domain": cs["domain"],
        }
        # Default clamp to False; override if explicitly set in Lite
        scale["clamp"] = cs.get("clamp", False)
        if "gamma" in cs:
            scale["gamma"] = cs["gamma"]

        # fill.field: prefer explicit `fill` key, then fall back to var_name
        # from the data reference (e.g. "hrrr.r" → var "r")
        field = enc.get("fill") or var_name
        channels["fill"] = {"field": field, "scale": scale}

    elif "fill" in enc:
        channels["fill"] = {"field": enc["fill"]}

    if "color" in enc:
        ch = channels.setdefault("fill", {})
        ch["value"] = enc["color"]

    if "stroke" in enc:
        channels["stroke"] = {"field": enc["stroke"]}

    # Always inject a default opacity of 1.0; override if explicitly set in Lite
    channels["opacity"] = {"value": enc["opacity"] if "opacity" in enc else 1.0}

    if "width" in enc:
        channels["width"] = {"value": enc["width"]}

    if "size" in enc:
        channels["size"] = {"value": enc["size"]}

    if "dash" in enc:
        stroke_ch = channels.setdefault("stroke", {})
        stroke_ch["dash"] = enc["dash"]

    known_enc = {"color_scale", "fill", "stroke", "opacity",
                 "color", "width", "size", "dash", "domain"}
    for k, v in enc.items():
        if k not in known_enc:
            warnings.warn(
                f"Unknown encoding key '{k}'; forwarding into channels as-is.",
                TranslationWarning, stacklevel=4,
            )
            channels[k] = v

    return channels


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _require_keys(obj: dict[str, Any], keys: list[str], context: str) -> None:
    missing = [k for k in keys if k not in obj]
    if missing:
        raise TranslationError(
            f"Missing required key(s) {missing} in {context}: {obj!r}"
        )


def _forward_unknown(
    src: dict[str, Any],
    dst: dict[str, Any],
    known: set[str],
) -> None:
    for k, v in src.items():
        if k not in known and k not in dst:
            warnings.warn(
                f"Unknown key '{k}' encountered during translation; "
                "forwarding as-is. Schema may have diverged.",
                TranslationWarning, stacklevel=3,
            )
            dst[k] = v


# ---------------------------------------------------------------------------
# Custom exception / warning types
# ---------------------------------------------------------------------------

class TranslationError(ValueError):
    """Raised when a spec cannot be translated due to a structural violation."""


class TranslationWarning(UserWarning):
    """Emitted when the translator encounters an unexpected but non-fatal condition."""