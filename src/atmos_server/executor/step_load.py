from atmos_server.runtime.model import DataObject
from atmos_server.compiler.types import Step
from pathlib import Path
from atmos_server.io.readers.geojson import load_geojson
import xarray as xr
import pandas as pd

def _member_ids(members: dict) -> list[str]:
    count = int(members.get("count", 0))
    start = int(members.get("indexStart", 0))
    pat = str(members.get("idPattern", "m{index}"))
    return [pat.format(index=i) for i in range(start, start + count)]

def _pick_keep_vars(ds: xr.Dataset, *, variables_spec: list[dict] | None, dims_spec: dict | None) -> xr.Dataset:
    keep = set()

    # keep requested variables by their NetCDF keys
    if isinstance(variables_spec, list):
        for v in variables_spec:
            if isinstance(v, dict):
                k = v.get("key")
                if isinstance(k, str) and k:
                    keep.add(k)

    # keep dimension “key” variables (XLAT/XLONG/Times etc)
    if isinstance(dims_spec, dict):
        for dim_name, dim in dims_spec.items():
            if isinstance(dim, dict):
                k = dim.get("key")
                if isinstance(k, str) and k:
                    keep.add(k)

    # only keep what exists
    keep_existing = [k for k in keep if k in ds.variables]
    if keep_existing:
        ds = ds[keep_existing]

    # extra safety: drop any remaining vars involving soil_layers_stag (if any slipped in)
    drop = [name for name, da in ds.data_vars.items() if "soil_layers_stag" in da.dims]
    if drop:
        ds = ds.drop_vars(drop)

    return ds


def _resolve_path(repo_root: Path, p: str) -> Path:
    path = Path(p)
    return path if path.is_absolute() else (repo_root / path)

def load_dataset(data_id, params, step, repo_root):
    source = params.get("source") or {}
    
    if not isinstance(source, dict):
        raise TypeError(f"Invalid source for step {step.id}: expected object, got {type(source)}")
    
    source_type = source.get("type")
    source_path = source.get("path")

    if source_type == "geojson":
        if not isinstance(source_path, str) or not source_path:
            raise ValueError(f"GeoJSON source.path missing/invalid for step {step.id}")
        p = _resolve_path(repo_root, source_path)
        
        return load_geojson(p)

    if source_type == "csv":
        if not isinstance(source_path, str) or not source_path:
            raise ValueError(f"CSV source.path missing/invalid for step {step.id}")
        p = _resolve_path(repo_root, source_path)
        if not p.exists():
            raise FileNotFoundError(f"CSV not found: {p}")

        df = pd.read_csv(p)

        dims = params.get("dimensions") or {}
        if isinstance(dims, dict):
            time_dim = dims.get("time")
            if isinstance(time_dim, dict):
                time_key = time_dim.get("key")
                time_type = time_dim.get("type")
                if isinstance(time_key, str) and time_key in df.columns and time_type == "datetime":
                    df[time_key] = pd.to_datetime(df[time_key], errors="coerce", utc=True)

        return df
    
    if source_type == "netcdf":
        if not isinstance(source_path, str) or not source_path:
            raise ValueError(f"NetCDF source.path missing/invalid for step {step.id}")
        p = _resolve_path(repo_root, source_path)

        engine = source.get("engine")
        if engine is not None and not isinstance(engine, str):
            raise ValueError(f"NetCDF source.engine must be a string if provided (step {step.id})")
        if not p.exists():
            raise FileNotFoundError(f"NetCDF not found: {p}")

        ds = xr.open_dataset(p, engine=engine)
        return DataObject(id=data_id, dataset=ds)
    
    raise NotImplementedError(f"Unsupported source type '{source_type}' in step {step.id}")

def load_collection(data_id, params, step, repo_root, variables, dimensions):
    members = params.get("members") or {}
    source_t = params.get("sourceTemplate") or {}
    member_dim = params.get("memberDimension") or "member"

    if not isinstance(members, dict):
        raise TypeError(f"members must be an object (step {step.id})")
    if not isinstance(source_t, dict):
        raise TypeError(f"sourceTemplate must be an object (step {step.id})")

    stype = source_t.get("type")
    path_t = source_t.get("pathTemplate")
    engine = source_t.get("engine", None)

    if stype not in (None, "netcdf"):
        raise NotImplementedError(
            f"collection sourceTemplate.type must be 'netcdf' (step {step.id})"
        )
    if not isinstance(path_t, str) or not path_t:
        raise ValueError(f"sourceTemplate.pathTemplate missing/invalid (step {step.id})")
    if engine is not None and not isinstance(engine, str):
        raise ValueError(f"sourceTemplate.engine must be a string if provided (step {step.id})")

    dsets: list[xr.Dataset] = []

    for mid in _member_ids(members):
        p_str = path_t.format(id=mid)
        p = _resolve_path(repo_root, p_str)
        if not p.exists():
            raise FileNotFoundError(f"NetCDF not found: {p} (member {mid}, step {step.id})")

        ds = xr.open_dataset(p, engine=engine)

        # keep only requested vars + dimension key vars, drop soil_layers_stag vars
        ds = _pick_keep_vars(ds, variables_spec=variables, dims_spec=dimensions)

        # label member dimension with the actual member id
        ds = ds.expand_dims({member_dim: [mid]})

        # OPTIONAL but often helps avoid too many open files:
        # ds = ds.load()

        dsets.append(ds)

    ds_all = xr.concat(dsets, dim=member_dim, coords="minimal", compat="override", join="override")
    
    return DataObject(id=data_id, dataset=ds_all)


def execute_step_load(step: Step, repo_root: Path):
    params = step.params or {}

    kind = params.get("kind")
    variables = params.get("variables")
    dimensions = params.get("dimensions")

    data_id = params.get("dataId")
    if not isinstance(data_id, str) or not data_id:
        data_id = step.id.split(":", 1)[1] if ":" in step.id else step.id

   
    # -------------------------
    # COLLECTION (ensemble)
    # -------------------------
    if kind == "collection":
        return load_collection(data_id, params, step, repo_root, variables, dimensions)

    # -------------------------
    # NON-COLLECTION (existing)
    # -------------------------
    return load_dataset(data_id, params, step, repo_root)

    