from __future__ import annotations

import json
from pathlib import Path
from typing import Iterator

import pytest

from atmos_server.executor import run_plan
from atmos_server.compiler import compile_plan
from atmos_server.schema import SchemaRegistry, validate_spec
from atmos_server.io.readers.json_loader import load_json_file


def repo_root() -> Path:
    # tests/test_compile_and_run.py -> repo root
    return Path(__file__).resolve().parents[1]


def iter_fixture_specs() -> Iterator[object]:
    """
    Discover all fixture specs under tests/fixtures/<version>/*.json

    Expected structure:
      tests/fixtures/v0.1/ex1-1.json
      tests/fixtures/v0.1/ex1-2.json
      ...

    Yields pytest.param(version, name, spec_path, id="v0.1/ex1-1").
    """
    root = repo_root() / "tests" / "fixtures"
    if not root.exists():
        return

    for version_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        version = version_dir.name
        if not version.startswith("v"):
            continue

        for spec_path in sorted(version_dir.glob("*.json")):
            if spec_path.name.endswith(".meta.json"):
                continue

            yield pytest.param(
                version,
                spec_path.name,
                spec_path,
                id=f"{version}/{spec_path.name}",
            )


@pytest.mark.parametrize("version,name,spec_path", list(iter_fixture_specs()))
def test_compile_and_run_fixtures(version: str, name: str, spec_path: Path, tmp_path: Path):
    """
    End-to-end smoke test:
      spec.json -> validate -> compile plan -> run -> writes manifest.json

    Auto-discovers fixtures from:
      tests/fixtures/<version>/*.json
    """
    root = repo_root()

    registry = SchemaRegistry(root / "schemas")
    schema = registry.load(version)

    spec = load_json_file(spec_path)

    # Validate
    validate_spec(spec, schema)

    # Compile
    plan = compile_plan(spec, schema_version=version)

    # Run
    out_dir = tmp_path / version / spec_path.stem
    run_plan(plan, out_dir)

    # Assert manifest exists and matches version
    manifest_path = out_dir / "manifest.json"
    assert manifest_path.exists(), f"Expected manifest at {manifest_path}"

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest["kind"] == "atmos-server-manifest"
    assert manifest["schemaVersion"] == version