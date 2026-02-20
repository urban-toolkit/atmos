from __future__ import annotations

from pathlib import Path

from atmos_server.schema import SchemaRegistry, load_schema


def test_schema_registry_lists_versions():
    repo_root = Path(__file__).resolve().parents[1]
    registry = SchemaRegistry(repo_root / "schemas")
    # This will pass as long as at least one schema exists.
    versions = registry.list_versions()
    assert isinstance(versions, list)


def test_pinned_schema_file_exists_for_v0_1():
    repo_root = Path(__file__).resolve().parents[1]
    schema_path = repo_root / "schemas" / "v0.1" / "atmos.schema.json"
    assert schema_path.exists(), "Pinned schema missing: schemas/v0.1/atmos.schema.json"


def test_schema_loads():
    repo_root = Path(__file__).resolve().parents[1]
    schema_path = repo_root / "schemas" / "v0.1" / "atmos.schema.json"
    schema = load_schema(schema_path)
    assert isinstance(schema, dict)
    assert "$schema" in schema or "title" in schema