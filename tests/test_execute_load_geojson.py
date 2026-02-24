from __future__ import annotations

from pathlib import Path

from atmos_server.executor import run_plan
from atmos_server.compiler import compile_plan
from atmos_server.schema import SchemaRegistry, validate_spec
from atmos_server.io.readers.json_loader import load_json_file


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def test_run_executes_geojson_load(tmp_path: Path):
    root = repo_root()

    # Load an existing valid v0.1 fixture (pick one that includes a geojson data source)
    spec_path = root / "tests" / "fixtures" / "v0.1" / "ex1-1.json"
    spec = load_json_file(spec_path)

    # Patch any geojson sources to point at our tiny test geojson
    # (only for this test run; does not modify the file)
    for d in spec.get("data", []):
        if isinstance(d, dict) and isinstance(d.get("source"), dict):
            if d["source"].get("type") == "geojson":
                d["source"]["path"] = "tests/data/boundaries.geojson"

    registry = SchemaRegistry(root / "schemas")
    schema = registry.load("v0.1")
    validate_spec(spec, schema)

    plan = compile_plan(spec, schema_version="v0.1")
    manifest = run_plan(plan, tmp_path / "artifacts")

    # Find at least one load step and confirm it executed or is marked todo/error appropriately
    load_steps = [s for s in manifest["steps"] if s["kind"] == "load"]
    assert load_steps, "Expected at least one load step"

    # If the fixture contains a geojson data source, at least one load should be ok
    assert any(s["status"] == "ok" for s in load_steps), f"Load steps statuses: {load_steps}"