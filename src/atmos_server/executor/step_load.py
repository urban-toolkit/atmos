from atmos_server.runtime.model import DataObject
from atmos_server.compiler.types import Step
from pathlib import Path
from atmos_server.io.readers.geojson import load_geojson
import xarray as xr

def execute_step_load(step: Step, repo_root: Path,):
    source = (step.params or {}).get("source") or {}
    if not isinstance(source, dict):
        raise TypeError(f"Invalid source for step {step.id}: expected object, got {type(source)}")

    source_type = source.get("type")
    source_path = source.get("path")

    if source_type == "geojson":
        if not isinstance(source_path, str) or not source_path:
            raise ValueError(f"GeoJSON source.path missing/invalid for step {step.id}")

        p = Path(source_path)
        if not p.is_absolute():
            p = repo_root / source_path

        return load_geojson(p)

    if source_type == "netcdf":
        if not isinstance(source_path, str) or not source_path:
            raise ValueError(f"NetCDF source.path missing/invalid for step {step.id}")

        p = Path(source_path)
        if not p.is_absolute():
            p = repo_root / source_path

        engine = source.get("engine")
        if engine is not None and not isinstance(engine, str):
            raise ValueError(f"NetCDF source.engine must be a string if provided (step {step.id})")

        if not p.exists():
            raise FileNotFoundError(f"NetCDF not found: {p}")

        ds = xr.open_dataset(p, engine=engine)
        data_id = step.id.split(":", 1)[1]

        return DataObject(id=data_id, dataset=ds)

    raise NotImplementedError(f"Unsupported source type '{source_type}' in step {step.id}")