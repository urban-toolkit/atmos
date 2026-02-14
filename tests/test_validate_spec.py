from __future__ import annotations

from pathlib import Path

import pytest

from atmos_server.schema import load_schema, validate_spec


def test_schema_file_exists():
    repo_root = Path(__file__).resolve().parents[1]
    schema_path = repo_root / "schemas" / "atmos-v0.1.schema.json"
    assert schema_path.exists(), "Pinned schema missing: schemas/atmos-v0.1.schema.json"


def test_schema_loads():
    repo_root = Path(__file__).resolve().parents[1]
    schema_path = repo_root / "schemas" / "atmos-v0.1.schema.json"
    schema = load_schema(schema_path)
    assert isinstance(schema, dict)
    assert "$schema" in schema or "title" in schema


@pytest.mark.skip(reason="Enable once you add a known-good minimal example spec for v0.1")
def test_minimal_spec_validates():
    repo_root = Path(__file__).resolve().parents[1]
    schema_path = repo_root / "schemas" / "atmos-v0.1.schema.json"
    schema = load_schema(schema_path)

    # Replace with a real minimal example that matches your v0.1 schema.
    minimal = {
        "data": [],
        "views": [],
    }

    validate_spec(minimal, schema)
