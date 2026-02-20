from __future__ import annotations

import json
from pathlib import Path

from atmos_server.execute import run_plan
from atmos_server.plan.types import Artifact, InputRef, Plan, PlanMeta, Step


def test_wind_speed_and_direction_on_geojson(tmp_path: Path):
    # Create a tiny GeoJSON with u10=3, v10=4 -> speed=5
    geojson_path = tmp_path / "wind.geojson"
    geojson_path.write_text(
        json.dumps(
            {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {"u10": 3, "v10": 4},
                        "geometry": {"type": "Point", "coordinates": [0, 0]},
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    plan = Plan(
        meta=PlanMeta(schema_version="v0.1", spec_id="test"),
        inputs=(InputRef(data_id="wind"),),
        steps=(
            Step(
                id="load:wind",
                kind="load",
                depends_on=(),
                params={"source": {"type": "geojson", "path": str(geojson_path)}},
            ),
            Step(
                id="transform:speed",
                kind="transform",
                depends_on=("load:wind",),
                params={"type": "derive_wind_speed", "as": {"id": "wind_speed"}, "u": "u10", "v": "v10"},
            ),
            Step(
                id="transform:dir",
                kind="transform",
                depends_on=("transform:speed",),
                params={"type": "derive_wind_direction", "as": {"id": "wind_dir"}, "u": "u10", "v": "v10"},
            ),
        ),
        artifacts=(),
        raw_spec={},
    )

    manifest = run_plan(plan, tmp_path / "out")

    # Ensure both transforms executed
    by_id = {s["id"]: s for s in manifest["steps"]}
    assert by_id["load:wind"]["status"] == "ok"
    assert by_id["transform:speed"]["status"] == "ok"
    assert by_id["transform:dir"]["status"] == "ok"