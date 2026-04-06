"""
Translator from AtmosLite grammar to full Atmos grammar.

Exports a single public function ``translate(lite) -> full`` intended
to be called by app.py.
"""

import json
import os
import re
import sys
from typing import Any, Optional


# ── helpers ──────────────────────────────────────────────────────────────────

_SOURCE_TYPE_BY_EXT = {
    ".nc": "netcdf",
    ".nc4": "netcdf",
    ".csv": "csv",
    ".json": "json",
    ".geojson": "geojson",
    ".zarr": "zarr",
}

_GRID_TYPE_BY_SOURCE = {
    "csv": "scattered",
}

_MARK_TYPE_MAP = {
    "heatmap": "mesh",
    "isoband": "isoband",
    "isoline": "isoline",
    "point": "point",
    "arrow": "vector",
    "barb": "vector",
    "poly": "polygon",
}

_AGG_OP_MAP = {
    "avg": "mean",
}

_QUANTILE_OPS = {
    "q25": 0.25,
    "q50": 0.50,
    "q75": 0.75,
}

_COMPARISON_OPS = frozenset({"gt", "lt", "gte", "lte", "eq", "ne"})


def _infer_source_type(path: str) -> str:
    return _SOURCE_TYPE_BY_EXT.get(os.path.splitext(path)[1].lower(), "netcdf")


def _infer_grid_type(source_type: str) -> str:
    return _GRID_TYPE_BY_SOURCE.get(source_type, "curvilinear")


class _Ctx:
    """Holds registries of data-source ids, variable names, and transform
    output ids so that bare references like ``"rain"`` or ``"q25[time:72]"``
    can be resolved to ``{data, var}`` pairs."""

    def __init__(self, lite: dict):
        self.data_ids: set[str] = set()
        self.data_vars: dict[str, list[str]] = {}
        self.transform_outputs: set[str] = set()

        for d in lite.get("data", []):
            did = d["id"]
            self.data_ids.add(did)
            self.data_vars[did] = list(d.get("variables", []))

        for t in lite.get("transform", []):
            for oid in t.get("id_out", []):
                self.transform_outputs.add(oid)

    def ref(self, s: str) -> dict:
      """Parse a lite data-reference string.

      Formats handled:

          "dataId.var"               -> {data: dataId, var: var}
          "derivedId"                -> {data: derivedId, var: derivedId}
          "derivedId.sub"            -> {data: derivedId, var: derivedId.sub}
          "varName"                  -> {data: <owner>, var: varName}
          any of the above + "[time:70,member:2]" -> adds dims selections
      """
      dims: dict[str, Any] = {}
      m = re.search(r"\[(.+)]$", s)
      if m:
          s = s[: m.start()]
          for part in m.group(1).split(","):
              k, v = part.split(":")
              key = k.strip()
              value = int(v.strip())

              # Atmos full spec selection form: selected indices as lists
              dims[key] = [value]

      parts = s.split(".")
      if len(parts) >= 2:
          first = parts[0]
          rest = ".".join(parts[1:])
          if first in self.transform_outputs:
              # derived id – keep full dotted path as var
              result = {"data": first, "var": s}
          else:
              result = {"data": first, "var": rest}
      else:
          name = parts[0]
          if name in self.transform_outputs:
              result = {"data": name, "var": name}
          else:
              owner = next(
                  (did for did, vs in self.data_vars.items() if name in vs),
                  None,
              )
              result = (
                  {"data": owner, "var": name}
                  if owner
                  else {"data": name, "var": name}
              )

      if dims:
          result["dims"] = dims
      return result


def translate(lite: dict) -> dict:
    """Translate an *AtmosLite* spec dict into a full *Atmos* spec dict."""
    ctx = _Ctx(lite)

    # ✅ THIS is the critical line
    full: dict[str, Any] = {"format": "atmos"}

    full["data"] = [_data(ctx, d) for d in lite["data"]]

    if "transform" in lite:
        full["transform"] = _all_transforms(ctx, lite["transform"])

    full["composition"] = _composition(ctx, lite["composition"])
    return full


def translate_lite_to_full_correct(lite: dict) -> dict:
    """Backward-compatible alias if any caller uses the newer function name."""
    return translate(lite)


def _data(ctx: _Ctx, d: dict) -> dict:
    files = d.get("file", [])
    if len(files) > 1:
        return _data_collection(ctx, d)
    return _data_single(ctx, d)


def _data_single(_ctx: _Ctx, d: dict) -> dict:
    files = d.get("file", [])
    path = (files[0].get("path") or files[0].get("url", "")) if files else ""
    stype = _infer_source_type(path)
    return {
        "id": d["id"],
        "source": {"type": stype, "path": path},
        "dims": _dims(d.get("dims", {})),
        "grid": {"type": _infer_grid_type(stype)},
        "vars": [{"id": v, "key": v} for v in d.get("variables", [])],
    }


def _data_collection(_ctx: _Ctx, d: dict) -> dict:
    files = d.get("file", [])
    paths = [f.get("path") or f.get("url", "") for f in files]
    stype = _infer_source_type(paths[0]) if paths else "netcdf"
    tpl, idx0 = _detect_path_pattern(paths)
    return {
        "id": d["id"],
        "type": "collection",
        "members": {"count": len(paths), "indexStart": idx0, "idPattern": "m{index}"},
        "sourceTemplate": {"type": stype, "pathTemplate": tpl},
        "dims": _dims(d.get("dims", {})),
        "grid": {"type": _infer_grid_type(stype)},
        "vars": [{"id": v, "key": v} for v in d.get("variables", [])],
    }


def _detect_path_pattern(paths: list[str]) -> tuple[str, int]:
    if len(paths) <= 1:
        return (paths[0] if paths else "{id}", 0)

    first = paths[0]

    # Match tokens like m0, m1, ens03, member_2, etc.
    token_re = re.compile(r"[A-Za-z_-]*\d+")

    tokens_per = [token_re.findall(p) for p in paths]
    if not tokens_per[0]:
        return (first, 0)

    for pos in range(max(len(ts) for ts in tokens_per)):
        vals = [ts[pos] for ts in tokens_per if pos < len(ts)]
        if len(set(vals)) > 1:
            matches = list(token_re.finditer(first))
            if pos < len(matches):
                m = matches[pos]
                token = m.group(0)

                # Extract numeric part for indexStart
                num_match = re.search(r"(\d+)$", token)
                idx0 = int(num_match.group(1)) if num_match else 0

                tpl = first[:m.start()] + "{id}" + first[m.end():]
                return tpl, idx0

    return first, 0


def _dims(d: dict) -> dict:
    out: dict[str, Any] = {}
    if "lat" in d:
        out["lat"] = {"key": d["lat"]}
    if "lng" in d:
        out["lon"] = {"key": d["lng"]}
    if "time" in d:
        out["time"] = {"key": d["time"]}
    if "level" in d:
        out["level"] = {"key": d["level"]}
    return out


def _all_transforms(ctx: _Ctx, transforms: list[dict]) -> list[dict]:
    result: list[dict] = []
    skip: set[int] = set()

    for i, t in enumerate(transforms):
        if i in skip:
            continue

        if "derive" in t and t["derive"].get("op") in _COMPARISON_OPS:
            merged, partner = _try_merge_cmp_agg(ctx, t, transforms, i)
            result.append(merged)
            if partner is not None:
                skip.add(partner)
            continue

        result.extend(_transform(ctx, t))

    return result


def _try_merge_cmp_agg(
    ctx: _Ctx, cmp_t: dict, all_t: list[dict], idx: int
) -> tuple[dict, Optional[int]]:
    cmp_id = cmp_t["id_out"][0]
    d = cmp_t["derive"]

    for j in range(idx + 1, len(all_t)):
        t2 = all_t[j]
        if "aggregate" not in t2:
            continue
        agg = t2["aggregate"]
        if agg.get("across") != "member" or agg["data"] != cmp_id:
            continue

        left = ctx.ref(d["left"])
        right = d["right"]
        right_node = {"const": right} if isinstance(right, (int, float)) else ctx.ref(right)
        out_id = t2["id_out"][0]

        return {
            "type": "reduce",
            "across": "member",
            "expr": {
                "op": "prob",
                "args": [{"op": d["op"], "args": [left, right_node]}],
            },
            "out": {"data": out_id, "var": out_id},
        }, j

    return _derive(ctx, cmp_t), None


def _transform(ctx: _Ctx, t: dict) -> list[dict]:
    if "derive" in t:
        return [_derive(ctx, t)]
    if "aggregate" in t:
        return [_aggregate(ctx, t)]
    if "join" in t:
        return [_join(ctx, t)]
    return []


def _derive(ctx: _Ctx, t: dict) -> dict:
    d = t["derive"]
    oid = t["id_out"][0]
    if "data_u" in d and "data_v" in d:
        return _derive_wind(ctx, d, oid)
    if "data_sp" in d:
        return _derive_slp(ctx, d, oid)
    return _derive_op(ctx, d, oid)


def _derive_op(ctx: _Ctx, d: dict, oid: str) -> dict:
    args: list[dict] = [ctx.ref(d["left"])]
    if "right" in d:
        r = d["right"]
        args.append({"const": r} if isinstance(r, (int, float)) else ctx.ref(r))
    return {
        "type": "derive",
        "expr": {"op": d["op"], "args": args},
        "out": {"data": oid, "var": oid},
    }


def _derive_wind(ctx: _Ctx, d: dict, oid: str) -> dict:
    u = ctx.ref(d["data_u"])
    v = ctx.ref(d["data_v"])
    u["role"] = "u"
    v["role"] = "v"
    return {
        "type": "derive",
        "expr": {"op": "diagnostic.wind.polar", "args": [u, v]},
        "out": {"data": oid, "var": oid},
    }


def _derive_slp(ctx: _Ctx, d: dict, oid: str) -> dict:
    roles = [("data_sp", "sp"), ("data_at2m", "at2m"),
             ("data_wvmr2m", "wvmr2m"), ("data_hgt", "hgt")]
    args = []
    for key, role in roles:
        ref = ctx.ref(d[key])
        ref["role"] = role
        args.append(ref)
    return {
        "type": "derive",
        "expr": {"op": "diagnostic.slp", "args": args},
        "out": {"data": oid, "var": oid},
    }


def _aggregate(ctx: _Ctx, t: dict) -> dict:
    a = t["aggregate"]
    oid = t["id_out"][0]
    across = a["across"]
    op = _AGG_OP_MAP.get(a["op"], a["op"])
    ref = ctx.ref(a["data"])

    if across == "member":
        raw_op = a["op"]
        q = _QUANTILE_OPS.get(raw_op)
        if q is not None:
            return {
                "type": "reduce",
                "across": "member",
                "expr": {"op": "quantile", "args": [ref], "params": {"q": q}},
                "out": {"data": oid, "var": oid},
            }
        return {
            "type": "reduce",
            "across": "member",
            "expr": {"op": op, "args": [ref]},
            "out": {"data": oid, "var": oid},
        }

    expr: dict[str, Any] = {"op": op, "args": [ref]}

    if across == "time":
        freq = a.get("frequency")
        if freq:
            n = freq.get("n", 1)
            u = freq.get("unit", "H")
            expr["freq"] = f"{n}{u}" if n > 1 else u

    if across == "space" and "geom" in a:
        expr["bin"] = {"type": a["geom"]}

    return {
        "type": "aggregate",
        "across": across,
        "by": ref.get("var", oid),
        "expr": expr,
        "out": {"data": oid, "var": oid},
    }


def _join(ctx: _Ctx, t: dict) -> dict:
    j = t["join"]
    oid = t["id_out"][0]
    ref1 = ctx.ref(j["data1"])
    ref2 = ctx.ref(j["data2"])
    rel = j.get("relationship", "nearest")

    expr: dict[str, Any] = {"op": "match", "args": [ref1, ref2]}
    if rel in ("nearest", "within"):
        expr["params"] = {"space": {"method": rel}}

    return {
        "type": "relate",
        "by": "space",
        "expr": expr,
        "out": {"data": oid, "var": oid},
    }


def _composition(ctx: _Ctx, comp: dict) -> dict:
    out: dict[str, Any] = {}

    if "context" in comp:
        out["context"] = comp["context"]

    views = comp.get("views", [])
    out["views"] = [_view(ctx, v) for v in views]

    if "interaction" in comp:
        out["interactions"] = [_interaction(ctx, i, views) for i in comp["interaction"]]

    return out


def _view(ctx: _Ctx, v: dict) -> dict:
    if v.get("type") == "chart":
        return _chart_view(ctx, v)
    return _map_view(ctx, v)


def _map_view(ctx: _Ctx, v: dict) -> dict:
    return {
        "id": v["id"],
        "frame": {"type": "map"},
        "layers": [_layer(ctx, l) for l in v.get("layers", [])],
    }


def _chart_view(_ctx: _Ctx, v: dict) -> dict:
    refs = v.get("data", [])
    spec = v.get("spec", {})
    vega_lite = spec if isinstance(spec, dict) else {}
    out: dict[str, Any] = {
        "id": v["id"],
        "frame": {"type": "chart"},
        "input": {"data": refs[0] if refs else ""},
        "vegaLite": vega_lite,
    }
    if v.get("floating"):
        out["floating"] = True
    return out


def _layer(ctx: _Ctx, l: dict) -> dict:
    out: dict[str, Any] = {
        "id": l["id"],
        "geometry": _geometry(ctx, l.get("geometry", {})),
    }
    if "mask" in l:
        out["mask"] = _mask(l["mask"])
    return out


def _geometry(ctx: _Ctx, g: dict) -> dict:
    mark = g.get("mark", {})
    mtype = mark.get("type", "heatmap")
    ftype = _MARK_TYPE_MAP.get(mtype, mtype)
    dr = ctx.ref(g.get("data", ""))
    enc = g.get("encoding", {})

    if ftype == "mesh":
        return _geom_scalar(ctx, "mesh", dr, enc)
    if ftype == "point":
        return _geom_scalar(ctx, "point", dr, enc)
    if ftype in ("isoband", "isoline"):
        return _geom_contour(ctx, ftype, mark, dr, enc)
    if ftype == "vector":
        geom = _geom_vector(ctx, mark, dr, enc)
        geom["sampling"] = g.get("sampling", {"skip": 2})
        return geom
    if ftype == "polygon":
        return _geom_polygon(ctx, dr, enc)
    return {"type": ftype, "input": dr, "encoding": _encoding(enc, dr.get("var", ""))}


def _geom_scalar(_ctx: _Ctx, gtype: str, dr: dict, enc: dict) -> dict:
    return {"type": gtype, "input": dr, "encoding": _encoding(enc, dr.get("var", ""))}


def _geom_contour(_ctx: _Ctx, gtype: str, mark: dict, dr: dict, enc: dict) -> dict:
    out: dict[str, Any] = {"type": gtype, "input": dr}
    steps = mark.get("steps")
    if steps and len(steps) == 3:
        out["build"] = [{
            "levels": {"type": "step", "start": steps[0], "stop": steps[1], "step": steps[2]}
        }]
    out["encoding"] = _encoding(enc, dr.get("var", ""))
    return out


def _geom_polygon(_ctx: _Ctx, dr: dict, enc: dict) -> dict:
    return {
        "type": "polygon",
        "input": {"data": dr.get("data", "")},
        "encoding": _encoding(enc, ""),
    }


def _geom_vector(_ctx: _Ctx, mark: dict, dr: dict, enc: dict, sampling: dict | None = None) -> dict:
    glyph_type = mark.get("type", "arrow")
    glyph_scale = mark.get("scale")

    channels: dict[str, Any] = {}

    fill_ref = enc.get("fill")
    if isinstance(fill_ref, str) and not fill_ref.startswith("#"):
        size_ch: dict[str, Any] = {
            "field": fill_ref,
            "scale": {"type": "linear", "domain": {"type": "extent"}},
        }
        domain = enc.get("domain")
        if domain:
            size_ch["scale"]["range"] = {"values": list(domain)}
        channels["size"] = size_ch

    color = enc.get("color")
    if color:
        channels["stroke"] = {"value": color}

    if "color_scale" in enc:
        cs = enc["color_scale"]
        fc: dict[str, Any] = {
            "field": dr.get("var", ""),
            "scale": {"scheme": cs["palette"], "domain": cs["domain"]},
        }
        if "clamp" in cs:
            fc["scale"]["clamp"] = cs["clamp"]
        channels["fill"] = fc

    result_enc: dict[str, Any] = {}
    if channels:
        result_enc["channels"] = channels
    result_enc["style"] = {"glyph": {"type": glyph_type}}
    if glyph_scale is not None:
        result_enc["style"]["glyph"]["scale"] = glyph_scale

    out = {"type": "vector", "input": dr, "encoding": result_enc}

    # Default vector sampling
    if sampling and isinstance(sampling, dict):
        out["sampling"] = sampling
    else:
        out["sampling"] = {"skip": 2}

    return out

def _encoding(enc: dict, var_name: str) -> dict:
    channels: dict[str, Any] = {}

    if "color_scale" in enc:
        cs = enc["color_scale"]
        scale: dict[str, Any] = {"scheme": cs["palette"], "domain": cs["domain"]}
        if "clamp" in cs:
            scale["clamp"] = cs["clamp"]
        if "gamma" in cs:
            scale["gamma"] = cs["gamma"]
        channels["fill"] = {"field": var_name, "scale": scale}

    if "stroke" in enc:
        channels["stroke"] = {"value": enc["stroke"]}

    if "fill" in enc:
        fv = enc["fill"]
        if isinstance(fv, str) and fv.startswith("#"):
            channels["fill"] = {"value": fv}

    if "opacity" in enc:
        channels["opacity"] = {"value": enc["opacity"]}

    if "width" in enc:
        channels["width"] = {"value": enc["width"]}

    if "size" in enc and isinstance(enc["size"], (int, float)):
        channels["size"] = {"value": enc["size"]}

    out: dict[str, Any] = {}
    if channels:
        out["channels"] = channels
    return out


def _mask(m: dict) -> dict:
    out: dict[str, Any] = {"type": m["type"]}

    if m["type"] == "bbox":
        out["bounds"] = dict(m["bounds"])
    elif m["type"] == "circle":
        out["center"] = {"lon": m["center"]["lng"], "lat": m["center"]["lat"]}
        out["radius"] = m["radius"]

    if m.get("lens"):
        out["interaction"] = {"on": ["drag", "resize"]}

    return out


def _interaction(_ctx: _Ctx, inter: dict, views: list[dict]) -> dict:
    if inter["type"] == "slider":
        return _int_slider(inter, views)
    if inter["type"] == "click":
        return _int_click(inter)
    return inter


def _int_slider(inter: dict, views: list[dict]) -> dict:
    dim = inter.get("select", "time")
    targets = inter.get("targets", [])
    full_targets: list[dict] = []
    for tgt in targets:
        ft: dict[str, Any] = {"view": tgt["view"]}
        for v in views:
            if v.get("id") == tgt["view"]:
                lids = [l["id"] for l in v.get("layers", [])]
                if lids:
                    ft["layers"] = lids
                break
        full_targets.append(ft)
    return {"type": "slider", "action": {"select": {"dim": dim, "target": full_targets}}}


def _int_click(inter: dict) -> dict:
    dim = inter.get("select", "id")
    sources = [dict(s) for s in inter.get("sources", [])]
    tgt = inter.get("target", {})
    return {
        "type": "click",
        "source": sources,
        "action": {"select": {"dim": dim, "target": [{"view": tgt["view"]}]}},
    }


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python translate_lite_to_full.py <input.json> [output.json]",
              file=sys.stderr)
        sys.exit(1)

    with open(sys.argv[1]) as f:
        lite = json.load(f)

    full = translate(lite)
    text = json.dumps(full, indent=2) + "\n"

    if len(sys.argv) > 2:
        with open(sys.argv[2], "w") as f:
            f.write(text)
        print(f"Written to {sys.argv[2]}", file=sys.stderr)
    else:
        print(text, end="")


if __name__ == "__main__":
    main()