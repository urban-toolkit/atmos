from __future__ import annotations

from typing import Any
import math

import numpy as np
import pandas as pd
import xarray as xr

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from shapely.geometry import Polygon


def _json_safe_value(value: Any) -> Any:
    if value is None:
        return None

    if isinstance(value, pd.Timestamp):
        return value.isoformat()

    if isinstance(value, np.generic):
        return value.item()

    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None

    if pd.isna(value):
        return None

    return value

def _levels_from_spec(levels_obj: Any) -> list[float] | None:
    if isinstance(levels_obj, list):
        return [float(x) for x in levels_obj]

    if isinstance(levels_obj, dict):

        # explicit list
        values = levels_obj.get("values")
        if isinstance(values, list):
            return [float(x) for x in values]

        # step pattern
        if levels_obj.get("type") == "step":
            start = levels_obj.get("start")
            stop = levels_obj.get("stop")
            step = levels_obj.get("step")

            if isinstance(start, (int, float)) and isinstance(stop, (int, float)) and isinstance(step, (int, float)):
                vals = []
                v = float(start)
                stop = float(stop)
                step = float(step)

                while v <= stop + 1e-9:
                    vals.append(v)
                    v += step

                return vals

    return None

def _midpoint_of_linestring(coords: list[Any]) -> list[float] | None:
    if len(coords) < 2:
        return None

    seg_lengths: list[float] = []
    total = 0.0

    for i in range(len(coords) - 1):
        x1, y1 = coords[i]
        x2, y2 = coords[i + 1]
        d = math.hypot(float(x2) - float(x1), float(y2) - float(y1))
        seg_lengths.append(d)
        total += d

    if total == 0:
        x0, y0 = coords[0]
        return [float(x0), float(y0)]

    half = total / 2.0
    acc = 0.0

    for i, d in enumerate(seg_lengths):
        if acc + d >= half:
            x1, y1 = coords[i]
            x2, y2 = coords[i + 1]
            t = (half - acc) / d if d > 0 else 0.0
            xm = float(x1) + t * (float(x2) - float(x1))
            ym = float(y1) + t * (float(y2) - float(y1))
            return [xm, ym]
        acc += d

    x0, y0 = coords[-1]
    return [float(x0), float(y0)]

# def _mesh_to_geojson(
#     ds: xr.Dataset,
#     *,
#     var_key: str,
#     lat_key: str,
#     lon_key: str,
#     out_field: str,
#     target_cells: int = 100000,
#     footprint: float = 1.0,
# ) -> dict[str, Any]:
#     lat = ds[lat_key].values
#     lon = ds[lon_key].values
#     val = ds[var_key].values

#     while getattr(lat, "ndim", 0) > 2:
#         lat = lat[0]

#     while getattr(lon, "ndim", 0) > 2:
#         lon = lon[0]

#     while getattr(val, "ndim", 0) > 2:
#         val = val[0]

#     ny, nx = lat.shape[-2], lat.shape[-1]
#     n_cells = max((ny - 1) * (nx - 1), 1)

#     step = max(1, int(math.sqrt(n_cells / max(target_cells, 1))))
#     fp = max(0.0, min(1.0, float(footprint)))

#     features: list[dict[str, Any]] = []

#     for j in range(0, ny - 1, step):
#         for i in range(0, nx - 1, step):
#             v = val[j, i]
#             try:
#                 v = float(v)
#             except Exception:
#                 continue

#             p00 = [float(lon[j, i]), float(lat[j, i])]
#             p10 = [float(lon[j, i + 1]), float(lat[j, i + 1])]
#             p11 = [float(lon[j + 1, i + 1]), float(lat[j + 1, i + 1])]
#             p01 = [float(lon[j + 1, i]), float(lat[j + 1, i])]

#             cx = (p00[0] + p10[0] + p11[0] + p01[0]) / 4.0
#             cy = (p00[1] + p10[1] + p11[1] + p01[1]) / 4.0

#             def shrink(p: list[float]) -> list[float]:
#                 return [cx + fp * (p[0] - cx), cy + fp * (p[1] - cy)]

#             coords = [shrink(p00), shrink(p10), shrink(p11), shrink(p01)]
#             coords.append(coords[0])

#             features.append(
#                 {
#                     "type": "Feature",
#                     "properties": {out_field: v},
#                     "geometry": {"type": "Polygon", "coordinates": [coords]},
#                 }
#             )

#     return {"type": "FeatureCollection", "features": features}

def _mesh_to_geojson(
    ds: xr.Dataset,
    *,
    var_key: str,
    lat_key: str,
    lon_key: str,
    out_field: str,
    target_cells: int = 100000,
    footprint: float = 1.0,
) -> dict[str, Any]:
    lat = ds[lat_key].values
    lon = ds[lon_key].values
    val = ds[var_key].values

    while getattr(lat, "ndim", 0) > 2:
        lat = lat[0]

    while getattr(lon, "ndim", 0) > 2:
        lon = lon[0]

    while getattr(val, "ndim", 0) > 2:
        val = val[0]

    ny, nx = lat.shape[-2], lat.shape[-1]
    n_cells = max((ny - 1) * (nx - 1), 1)

    step = max(1, int(math.sqrt(n_cells / max(target_cells, 1))))
    fp = max(0.0, min(1.0, float(footprint)))

    features: list[dict[str, Any]] = []

    for j in range(0, ny - 1, step):
        for i in range(0, nx - 1, step):
            # span the whole sampled block, not just one native cell
            j2 = min(j + step, ny - 1)
            i2 = min(i + step, nx - 1)

            # use a representative value for the block
            block = val[j:j2, i:i2]
            try:
                v = float(np.nanmean(block))
            except Exception:
                continue

            if np.isnan(v):
                continue

            p00 = [float(lon[j,  i ]), float(lat[j,  i ])]
            p10 = [float(lon[j,  i2]), float(lat[j,  i2])]
            p11 = [float(lon[j2, i2]), float(lat[j2, i2])]
            p01 = [float(lon[j2, i ]), float(lat[j2, i ])]

            cx = (p00[0] + p10[0] + p11[0] + p01[0]) / 4.0
            cy = (p00[1] + p10[1] + p11[1] + p01[1]) / 4.0

            def shrink(p: list[float]) -> list[float]:
                return [cx + fp * (p[0] - cx), cy + fp * (p[1] - cy)]

            coords = [shrink(p00), shrink(p10), shrink(p11), shrink(p01)]
            coords.append(coords[0])

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
    lat = ds[lat_key].values
    lon = ds[lon_key].values
    val = ds[var_key].values

    while getattr(val, "ndim", 0) > 2:
        val = val[0]

    cs = plt.contourf(lon, lat, val, levels=levels)

    features: list[dict[str, Any]] = []

    allsegs = cs.allsegs
    for i, segs in enumerate(allsegs):
        lo = float(levels[i])
        hi = float(levels[i + 1])
        mid = (lo + hi) / 2.0

        for seg in segs:
            poly = [[float(x), float(y)] for x, y in seg]
            poly_geom = Polygon(poly)
            if poly_geom.area == 0:
                continue
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
    lat = ds[lat_key].values
    lon = ds[lon_key].values
    val = ds[var_key].values

    while getattr(val, "ndim", 0) > 2:
        val = val[0]

    cs = plt.contour(lon, lat, val, levels=levels)

    features: list[dict[str, Any]] = []

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
    rows: pd.DataFrame,
    *,
    lat_key: str,
    lon_key: str,
    value_key: str | None,
    out_field: str,
    extra_props: list[str] | None = None,
) -> dict[str, Any]:
    if not isinstance(rows, pd.DataFrame):
        raise TypeError("point geometry expects pandas DataFrame upstream")

    extra_props = extra_props or []
    features: list[dict[str, Any]] = []

    for _, row in rows.iterrows():
        try:
            lat = float(row[lat_key])
            lon = float(row[lon_key])
        except Exception:
            continue

        props: dict[str, Any] = {}
        
        if value_key is not None and value_key in row:
            props[out_field] = _json_safe_value(row[value_key])

        for k in extra_props:
            if k in row:
                props[k] = _json_safe_value(row[k])

        features.append(
            {
                "type": "Feature",
                "properties": props,
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )

    return {"type": "FeatureCollection", "features": features}