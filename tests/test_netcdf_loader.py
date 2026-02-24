import xarray as xr
import numpy as np
from pathlib import Path

from atmos_server.executor import run_plan
from atmos_server.compiler.types import Plan, PlanMeta, Step, InputRef


def test_real_netcdf_loader(tmp_path: Path):
    # Create synthetic dataset
    ds = xr.Dataset(
        {
            "T2": (("time", "lat", "lon"), np.random.rand(2, 3, 4))
        },
        coords={
            "time": [0, 1],
            "lat": [10, 20, 30],
            "lon": [100, 110, 120, 130]
        }
    )

    nc_path = tmp_path / "test.nc"
    ds.to_netcdf(nc_path)

    plan = Plan(
        meta=PlanMeta(schema_version="v0.1", spec_id="test"),
        inputs=(InputRef(data_id="r001"),),
        steps=(
            Step(
                id="load:r001",
                kind="load",
                depends_on=(),
                params={"source": {"type": "netcdf", "path": str(nc_path)}},
            ),
        ),
        artifacts=(),
        raw_spec={},
    )

    manifest = run_plan(plan, tmp_path / "out")

    assert manifest["steps"][0]["status"] == "ok"