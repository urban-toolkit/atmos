from atmos_server.runtime.model import DataObject
from atmos_server.compiler.types import Step

from atmos_server.executor.context import ExecutionContext

import xarray as xr
from typing import Any

def _midpoint_of_linestring(coords: list[list[float]]) -> list[float] | None:
    if len(coords) < 2:
        return coords[0] if coords else None

    # distance along polyline
    seglens: list[float] = []
    total = 0.0
    for i in range(len(coords) - 1):
        x1, y1 = coords[i]
        x2, y2 = coords[i + 1]
        d = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
        seglens.append(d)
        total += d

    if total <= 0:
        return coords[len(coords) // 2]

    half = total / 2.0
    acc = 0.0
    for i, d in enumerate(seglens):
        if acc + d >= half:
            t = (half - acc) / d if d > 0 else 0.0
            x1, y1 = coords[i]
            x2, y2 = coords[i + 1]
            return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]
        acc += d

    return coords[len(coords) // 2]

def _levels_from_spec(levels_obj) -> list[float] | None:
    # 1) explicit list
    if isinstance(levels_obj, list):
        return [float(x) for x in levels_obj]

    if not isinstance(levels_obj, dict):
        return None

    # 2) explicit {values:[...]}
    values = levels_obj.get("values")
    if isinstance(values, list):
        return [float(x) for x in values]

    # 3) step {type:"step", start, stop, step}
    if levels_obj.get("type") == "step":
        start = levels_obj.get("start")
        stop  = levels_obj.get("stop")
        step  = levels_obj.get("step")

        if not isinstance(start, (int, float)) or not isinstance(stop, (int, float)) or not isinstance(step, (int, float)):
            return None
        if step <= 0:
            return None

        out: list[float] = []
        x = float(start)
        stopf = float(stop)
        stepf = float(step)

        # Include stop (like typical contour usage)
        # guard against floating drift with a small epsilon
        eps = stepf * 1e-6
        while x <= stopf + eps:
            out.append(float(x))
            x += stepf
        return out

    return None

def _mesh_to_geojson(
    ds: xr.Dataset,
    *,
    var_key: str,
    lat_key: str,
    lon_key: str,
    out_field: str,
    target_cells: int = 5000,
    footprint: float = 1.0,   # NEW
) -> dict[str, Any]:
    lat = ds[lat_key].values
    lon = ds[lon_key].values
    val = ds[var_key].values

    # squeeze to 2D if needed
    while getattr(val, "ndim", 0) > 2:
        val = val[0]

    ny, nx = lat.shape[-2], lat.shape[-1]
    ncells = max(0, (ny - 1) * (nx - 1))

    if ncells <= 0:
        return {"type": "FeatureCollection", "features": []}

    # Clamp footprint to [0, 1]
    fp = float(footprint)
    if fp < 0.0:
        fp = 0.0
    elif fp > 1.0:
        fp = 1.0

    # stride so we don't explode file size
    stride = 1
    if ncells > target_cells:
        import math as _math
        stride = int(_math.ceil(_math.sqrt(ncells / target_cells)))

    features: list[dict[str, Any]] = []
    for j in range(0, ny - 1, stride):
        for i in range(0, nx - 1, stride):
            v = float(val[j, i])
            if v != v:  # NaN check
                continue

            # corners
            p00 = (float(lon[j, i]),         float(lat[j, i]))
            p10 = (float(lon[j, i + 1]),     float(lat[j, i + 1]))
            p11 = (float(lon[j + 1, i + 1]), float(lat[j + 1, i + 1]))
            p01 = (float(lon[j + 1, i]),     float(lat[j + 1, i]))

            # center
            cx = (p00[0] + p10[0] + p11[0] + p01[0]) / 4.0
            cy = (p00[1] + p10[1] + p11[1] + p01[1]) / 4.0

            # shrink toward center (fp=1 -> same cell; fp<1 -> gaps)
            def shrink(p):
                return [cx + fp * (p[0] - cx), cy + fp * (p[1] - cy)]

            coords = [shrink(p00), shrink(p10), shrink(p11), shrink(p01)]
            coords.append(coords[0])  # close ring

            features.append(
                {
                    "type": "Feature",
                    "properties": {out_field: v},
                    "geometry": {"type": "Polygon", "coordinates": [coords]},
                }
            )

    return {"type": "FeatureCollection", "features": features}

def _isoband_to_geojson(
    ds: xr.Dataset,
    *,
    var_key: str,
    lat_key: str,
    lon_key: str,
    levels: list[float],
    out_field: str,
) -> dict[str, Any]:

    import matplotlib.pyplot as plt
    import numpy as np

    lat = ds[lat_key].values
    lon = ds[lon_key].values
    val = ds[var_key].values

    while getattr(val, "ndim", 0) > 2:
        val = val[0]

    cs = plt.contourf(lon, lat, val, levels=levels)

    features = []
    
    allsegs = cs.allsegs  # band-indexed polygons
    for i, segs in enumerate(allsegs):
        lo = levels[i]
        hi = levels[i + 1]
        mid = (lo + hi) / 2.0

        for seg in segs:
            # seg is Nx2 array-like of lon/lat vertices
            poly = [[float(x), float(y)] for x, y in seg]
            if len(poly) < 4:
                continue
            # close ring if needed
            if poly[0] != poly[-1]:
                poly.append(poly[0])

            features.append(
                {
                    "type": "Feature",
                    "properties": {out_field: mid, f"{out_field}_lo": lo, f"{out_field}_hi": hi},
                    "geometry": {"type": "Polygon", "coordinates": [poly]},
                }
            )
    plt.close()

    return {"type": "FeatureCollection", "features": features}

def _isoline_to_geojson(
    ds: xr.Dataset,
    *,
    var_key: str,
    lat_key: str,
    lon_key: str,
    levels: list[float],
    out_field: str,
) -> dict[str, Any]:
    import matplotlib.pyplot as plt

    lat = ds[lat_key].values
    lon = ds[lon_key].values
    val = ds[var_key].values
    while getattr(val, "ndim", 0) > 2:
        val = val[0]

    cs = plt.contour(lon, lat, val, levels=levels)

    features: list[dict[str, Any]] = []

    # Avoid indexing cs.levels (typed as Iterable in stubs)
    for level, segs in zip(cs.levels, cs.allsegs):
        lvl = float(level)
        for seg in segs:
            coords = [[float(x), float(y)] for x, y in seg]
            if len(coords) < 2:
                continue
            features.append(
                {
                    "type": "Feature",
                    "properties": {out_field: lvl},
                    "geometry": {"type": "LineString", "coordinates": coords},
                }
            )

    plt.close()
    return {"type": "FeatureCollection", "features": features}

def _vector_to_geojson(
    ds: xr.Dataset,
    *,
    lat_key: str,
    lon_key: str,
    speed_key: str,
    direction_key: str,
    out_var_id: str,
    skip: int = 0,
) -> dict[str, Any]:
    lat = ds[lat_key].values
    lon = ds[lon_key].values
    spd = ds[speed_key].values
    direc = ds[direction_key].values

    # squeeze to 2D if needed
    while getattr(spd, "ndim", 0) > 2:
        spd = spd[0]
    while getattr(direc, "ndim", 0) > 2:
        direc = direc[0]

    ny, nx = lat.shape[-2], lat.shape[-1]

    step = (skip + 1) if isinstance(skip, int) and skip >= 0 else 1

    feats: list[dict[str, Any]] = []
    for j in range(0, ny, step):
        for i in range(0, nx, step):
            x = float(lon[j, i])
            y = float(lat[j, i])

            s = spd[j, i]
            d = direc[j, i]

            # handle NaNs gracefully
            try:
                s_val = float(s)
                d_val = float(d)
            except Exception:
                continue

            feats.append(
                {
                    "type": "Feature",
                    "properties": {
                        f"{out_var_id}.speed": s_val,
                        f"{out_var_id}.direction": d_val,
                    },
                    "geometry": {"type": "Point", "coordinates": [x, y]},
                }
            )

    return {"type": "FeatureCollection", "features": feats}

def _points_to_geojson_table(
    rows, *,
    lat_key: str,
    lon_key: str,
    value_key: str | None,
    out_field: str,
    extra_props: list[str] | None = None,
) -> dict[str, Any]:
    features: list[dict[str, Any]] = []
    extra_props = extra_props or []

    # rows may be a pandas DataFrame, or list[dict]
    if hasattr(rows, "iterrows"):
        iterator = (r for _, r in rows.iterrows())
        get = lambda r, k: r.get(k) if hasattr(r, "get") else r[k]
    elif isinstance(rows, list):
        iterator = (r for r in rows if isinstance(r, dict))
        get = lambda r, k: r.get(k)
    else:
        raise TypeError("point geometry expects a pandas.DataFrame or list[dict] upstream")

    for r in iterator:
        try:
            lat = float(get(r, lat_key))
            lon = float(get(r, lon_key))
        except Exception:
            continue

        props: dict[str, Any] = {}

        if value_key:
            v = get(r, value_key)
            # keep numeric if possible
            try:
                props[out_field] = float(v)
            except Exception:
                props[out_field] = v

        for k in extra_props:
            if not k:
                continue
            v = get(r, k)
            if v is None:
                continue
            # best-effort JSON-serializable values
            try:
                import pandas as _pd
                if isinstance(v, _pd.Timestamp):
                    v = v.isoformat()
            except Exception:
                pass
            props[k] = v

        features.append(
            {
                "type": "Feature",
                "properties": props,
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )

    return {"type": "FeatureCollection", "features": features}

def execute_step_geometry(step: Step, ctx: ExecutionContext | None = None):
    if ctx is None:
        raise RuntimeError("Geometry execution requires an ExecutionContext")

    g = step.params or {}
    gtype = g.get("type")

    if not step.depends_on:
        raise ValueError(f"Geometry step '{step.id}' has no depends_on")

    upstream_step = step.depends_on[-1]
    upstream_obj = ctx.get(upstream_step)

    # polygon: passthrough GeoJSON
    if gtype == "polygon":
        if not (isinstance(upstream_obj, dict) and upstream_obj.get("type") == "FeatureCollection"):
            raise TypeError(f"polygon geometry expects GeoJSON FeatureCollection upstream (step {step.id})")
        return upstream_obj

    # mesh: DataObject(xarray) -> GeoJSON grid
    if gtype == "mesh":
        if not isinstance(upstream_obj, DataObject):
            raise TypeError(f"mesh geometry expects DataObject upstream (step {step.id})")

        resolved = g.get("_resolved") or {}
        if not isinstance(resolved, dict):
            resolved = {}

        var_key = resolved.get("variableKey")
        lat_key = resolved.get("latKey")
        lon_key = resolved.get("lonKey")
        var_id = (resolved.get("variableId") or "value")

        if not isinstance(var_key, str) or not var_key:
            raise ValueError(f"mesh geometry missing resolved variableKey (step {step.id})")
        if not isinstance(lat_key, str) or not isinstance(lon_key, str) or not lat_key or not lon_key:
            raise ValueError(f"mesh geometry missing resolved latKey/lonKey (step {step.id})")

        # ---- NEW: read build params (mesh)
        build = g.get("build")
        build0 = build[0] if isinstance(build, list) and build and isinstance(build[0], dict) else {}

        # Defaults (match your schema defaults)
        interpolate = build0.get("interpolate", "bilinear")  # not used yet unless you implement it
        target_cells = build0.get("targetCells", 100000)
        cell_footprint = build0.get("cellFootprint", 1.0)

        # Type-safe coercion
        try:
            target_cells = int(target_cells)
        except Exception:
            target_cells = 5000
        if target_cells < 1:
            target_cells = 1

        try:
            cell_footprint = float(cell_footprint)
        except Exception:
            cell_footprint = 1.0
        if cell_footprint < 0:
            cell_footprint = 0.0
        if cell_footprint > 1:
            cell_footprint = 1.0

        ds = upstream_obj.dataset
        return _mesh_to_geojson(
            ds,
            var_key=var_key,
            lat_key=lat_key,
            lon_key=lon_key,
            out_field=str(var_id),
            target_cells=target_cells,
            footprint=cell_footprint,
            # interpolate=interpolate,  # only add if/when you implement it
        )

    if gtype == "isoband":
        if not isinstance(upstream_obj, DataObject):
            raise TypeError("isoband geometry expects DataObject upstream")

        resolved = g.get("_resolved") or {}
        if not isinstance(resolved, dict):
            resolved = {}

        # levels may be flattened by compiler, or live inside build
        levels_obj = g.get("levels")
        if levels_obj is None:
            build = g.get("build")
            if isinstance(build, list):
                for item in build:
                    if isinstance(item, dict) and "levels" in item:
                        levels_obj = item["levels"]
                        break

        levels: list[float] | None = None
        if isinstance(levels_obj, list):
            levels = [float(x) for x in levels_obj]
        elif isinstance(levels_obj, dict):
            values = levels_obj.get("values")
            if isinstance(values, list):
                levels = [float(x) for x in values]

        if not levels or len(levels) < 2:
            raise ValueError("isoband requires explicit levels (levels must be a list or {values:[...]})")

        var_key = resolved.get("variableKey")
        lat_key = resolved.get("latKey")
        lon_key = resolved.get("lonKey")
        var_id = resolved.get("variableId") or "value"

        if not isinstance(var_key, str) or not var_key:
            raise ValueError(f"isoband geometry missing resolved variableKey (step {step.id})")
        if not isinstance(lat_key, str) or not lat_key or not isinstance(lon_key, str) or not lon_key:
            raise ValueError(f"isoband geometry missing resolved latKey/lonKey (step {step.id})")

        ds = upstream_obj.dataset
        return _isoband_to_geojson(
            ds,
            var_key=var_key,
            lat_key=lat_key,
            lon_key=lon_key,
            levels=levels,
            out_field=str(var_id),
        )
    
    if gtype == "isoline":
        if not isinstance(upstream_obj, DataObject):
            raise TypeError(f"isoline geometry expects DataObject upstream (step {step.id})")

        resolved = g.get("_resolved") or {}
        if not isinstance(resolved, dict):
            resolved = {}

        # ---- Extract levels (same logic as isoband)
        levels_obj = g.get("levels")

        if levels_obj is None:
            build = g.get("build")
            if isinstance(build, list):
                for item in build:
                    if isinstance(item, dict) and "levels" in item:
                        levels_obj = item["levels"]
                        break

        levels: list[float] | None = _levels_from_spec(levels_obj)

        if not levels or len(levels) < 1:
            raise ValueError("isoline requires levels (need at least 1)")

        # ---- Resolve dataset keys
        var_key = resolved.get("variableKey")
        lat_key = resolved.get("latKey")
        lon_key = resolved.get("lonKey")
        var_id = resolved.get("variableId") or "value"

        if not isinstance(var_key, str) or not var_key:
            raise ValueError(f"isoline geometry missing resolved variableKey (step {step.id})")

        if (
            not isinstance(lat_key, str)
            or not lat_key
            or not isinstance(lon_key, str)
            or not lon_key
        ):
            raise ValueError(f"isoline geometry missing resolved latKey/lonKey (step {step.id})")

        ds = upstream_obj.dataset

        # ---- Read label config from encoding.style.label
        enc = g.get("encoding") or {}
        if not isinstance(enc, dict):
            enc = {}
        style = enc.get("style") or {}
        if not isinstance(style, dict):
            style = {}
        label_cfg = style.get("label") or {}
        if not isinstance(label_cfg, dict):
            label_cfg = {}

        labels_enabled = bool(label_cfg.get("enabled", False))
        fmt = label_cfg.get("format", ".0f")
        if not isinstance(fmt, str) or not fmt:
            fmt = ".0f"

        # 1) line features
        lines_fc = _isoline_to_geojson(
            ds,
            var_key=var_key,
            lat_key=lat_key,
            lon_key=lon_key,
            levels=levels,
            out_field=str(var_id),
        )

        # 2) label features (optional)
        if labels_enabled:
            label_features: list[dict[str, Any]] = []
            for feat in lines_fc.get("features", []):
                if not isinstance(feat, dict):
                    continue
                geom = feat.get("geometry") or {}
                if not isinstance(geom, dict) or geom.get("type") != "LineString":
                    continue
                coords = geom.get("coordinates")
                if not isinstance(coords, list) or len(coords) < 2:
                    continue

                mid = _midpoint_of_linestring(coords)
                if mid is None:
                    continue

                props = feat.get("properties") or {}
                lvl = props.get(str(var_id))
                if not isinstance(lvl, (int, float)):
                    continue

                try:
                    label_txt = format(float(lvl), fmt)
                except Exception:
                    label_txt = str(lvl)

                label_features.append(
                    {
                        "type": "Feature",
                        "properties": {"value": float(lvl), "label": label_txt},
                        "geometry": {"type": "Point", "coordinates": mid},
                    }
                )

            labels_fc = {"type": "FeatureCollection", "features": label_features}
            return {"lines": lines_fc, "labels": labels_fc}

        return lines_fc

        # return _isoline_to_geojson(
        #     ds,
        #     var_key=var_key,
        #     lat_key=lat_key,
        #     lon_key=lon_key,
        #     levels=levels,
        #     out_field=str(var_id),
        # )

    if gtype == "vector":
        if not isinstance(upstream_obj, DataObject):
            raise TypeError(f"vector geometry expects DataObject upstream (step {step.id})")

        resolved = g.get("_resolved") or {}
        if not isinstance(resolved, dict):
            resolved = {}

        lat_key = resolved.get("latKey")
        lon_key = resolved.get("lonKey")
        speed_key = resolved.get("speedKey")
        direction_key = resolved.get("directionKey")
        var_id = resolved.get("variableId") or "wind"

        if not isinstance(lat_key, str) or not lat_key:
            raise ValueError(f"vector geometry missing resolved latKey (step {step.id})")
        if not isinstance(lon_key, str) or not lon_key:
            raise ValueError(f"vector geometry missing resolved lonKey (step {step.id})")
        if not isinstance(speed_key, str) or not speed_key:
            raise ValueError(f"vector geometry missing resolved speedKey (step {step.id})")
        if not isinstance(direction_key, str) or not direction_key:
            raise ValueError(f"vector geometry missing resolved directionKey (step {step.id})")

        # optional: read style.skip to thin arrows server-side
        skip = 0
        enc = g.get("encoding") or {}
        if isinstance(enc, dict):
            style = enc.get("style") or {}
            if isinstance(style, dict) and isinstance(style.get("skip"), int):
                skip = int(style["skip"])

        ds = upstream_obj.dataset
        return _vector_to_geojson(
            ds,
            lat_key=lat_key,
            lon_key=lon_key,
            speed_key=speed_key,
            direction_key=direction_key,
            out_var_id=str(var_id),
            skip=skip,
        )
    
    if gtype == "point":
        resolved = g.get("_resolved") or {}
        if not isinstance(resolved, dict):
            resolved = {}

        lat_key = resolved.get("latKey")
        lon_key = resolved.get("lonKey")
        var_key = resolved.get("variableKey")  # CSV column for the variable
        var_id  = resolved.get("variableId") or "value"

        if not isinstance(lat_key, str) or not lat_key:
            raise ValueError(f"point geometry missing resolved latKey (step {step.id})")
        if not isinstance(lon_key, str) or not lon_key:
            raise ValueError(f"point geometry missing resolved lonKey (step {step.id})")

        extra = []
        site_key = resolved.get("siteKey")
        time_key = resolved.get("timeKey")
        if isinstance(site_key, str): extra.append(site_key)
        if isinstance(time_key, str): extra.append(time_key)

        # upstream_obj is the CSV DataFrame from load
        return _points_to_geojson_table(
            upstream_obj,
            lat_key=lat_key,
            lon_key=lon_key,
            value_key=var_key if isinstance(var_key, str) and var_key else None,
            out_field=str(var_id),
            extra_props=extra,
        )
    
    raise NotImplementedError(f"Unsupported geometry type '{gtype}' in step {step.id}")