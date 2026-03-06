from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class NetCDFHandle:
    path: Path
    engine: str | None = None  # e.g. "netcdf4" or "h5netcdf"

def open_netcdf_handle(path: str | Path, *, engine: str | None = None) -> NetCDFHandle:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"NetCDF not found: {p}")
    if not p.is_file():
        raise FileNotFoundError(f"NetCDF path is not a file: {p}")
    return NetCDFHandle(path=p, engine=engine)