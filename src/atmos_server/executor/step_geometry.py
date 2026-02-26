from atmos_server.runtime.model import DataObject
from atmos_server.compiler.types import Step

from atmos_server.executor.context import ExecutionContext

import xarray as xr
from typing import Any

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

        levels: list[float] | None = None

        if isinstance(levels_obj, list):
            levels = [float(x) for x in levels_obj]

        elif isinstance(levels_obj, dict):
            values = levels_obj.get("values")
            if isinstance(values, list):
                levels = [float(x) for x in values]

        if not levels or len(levels) < 1:
            raise ValueError("isoline requires explicit levels (at least one value)")

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

        return _isoline_to_geojson(
            ds,
            var_key=var_key,
            lat_key=lat_key,
            lon_key=lon_key,
            levels=levels,
            out_field=str(var_id),
        )

    
    raise NotImplementedError(f"Unsupported geometry type '{gtype}' in step {step.id}")