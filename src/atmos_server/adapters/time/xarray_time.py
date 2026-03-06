from __future__ import annotations

from pathlib import Path
from typing import Any

import xarray as xr

from atmos_server.core.compiler.ports import RepoRootResolver, TimeLenResolver


class XarrayTimeLenResolver(TimeLenResolver):
    """
    Open NetCDF metadata (xarray) to infer time length for repeatView.

    Mirrors current v0.1 behavior:
      - requires data[source.type="netcdf"]
      - uses source.path (absolute or repo-root-relative)
      - uses dimensions.time.dim when declared; else Time/time
    """

    def __init__(self, repo_root: RepoRootResolver) -> None:
        self._repo_root = repo_root

    def time_len(self, *, spec: dict[str, Any], data_id: str) -> int | None:
        data_list = spec.get("data") or []
        if not isinstance(data_list, list):
            raise ValueError("spec.data must be a list")

        data_by_id: dict[str, Any] = {}
        for d in data_list:
            if isinstance(d, dict) and isinstance(d.get("id"), str) and d["id"].strip():
                data_by_id[d["id"].strip()] = d

        d = data_by_id.get(data_id)
        if not isinstance(d, dict):
            raise ValueError(f"repeatView: data '{data_id}' not found in spec.data")

        source = d.get("source") or {}
        if not (isinstance(source, dict) and source.get("type") == "netcdf"):
            raise ValueError(
                f"repeatView: cannot infer timesteps for data '{data_id}' because it is not a netcdf source"
            )

        source_path = source.get("path")
        if not isinstance(source_path, str) or not source_path:
            raise ValueError(f"repeatView: netcdf source.path missing for data '{data_id}'")

        # Prefer declared time dim
        dims = d.get("dimensions") or {}
        time_spec = dims.get("time") if isinstance(dims, dict) else None
        declared_time_dim = time_spec.get("dim") if isinstance(time_spec, dict) else None

        p = Path(source_path)
        if not p.is_absolute():
            p = self._repo_root.repo_root() / source_path

        ds = xr.open_dataset(p)
        try:
            for cand in [declared_time_dim, "Time", "time"]:
                if isinstance(cand, str) and cand in ds.dims:
                    return int(ds.sizes[cand])
            raise ValueError(f"repeatView: could not find a time dimension in dataset '{data_id}'")
        finally:
            ds.close()