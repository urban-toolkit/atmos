"""
test_translate_e2e.py — End-to-end translation integration test.

Takes a real Atmos-Lite spec file as input, runs normalize_spec(),
and writes the translated Atmos spec to a JSON file.

Usage
─────
# Run and save the translated JSON next to the input file:
    pytest test_translate_e2e.py -v --save-json

# Run without saving (CI mode — just assert correctness):
    pytest test_translate_e2e.py -v

Input/output paths can be overridden via pytest options:
    pytest test_translate_e2e.py -v --save-json \
        --lite-input path/to/my_spec.json \
        --atmos-output path/to/translated.json

Defaults:
    --lite-input   lite_ex8_simple_heatmap_slider.json  (same dir as this file)
    --atmos-output <input-stem>__atmos.json             (same dir as this file)
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest

from atmos_server.core.translator import normalize_spec


HERE = Path(__file__).parent


# ---------------------------------------------------------------------------
# Fixtures  (CLI options --lite-input, --atmos-output, --save-json live in conftest.py)
# ---------------------------------------------------------------------------

@pytest.fixture
def lite_input_path(request: pytest.FixtureRequest) -> Path:
    raw = request.config.getoption("--lite-input")
    if not raw:
        pytest.fail(
            "Missing required option: --lite-input PATH"
            "  Example: pytest test_translate_e2e.py -v --save-json "
            "--lite-input path/to/my_spec.json"
        )
    path = Path(raw)
    if not path.exists():
        pytest.fail(f"Atmos-Lite input file not found: {path}")
    return path


@pytest.fixture
def atmos_output_path(request: pytest.FixtureRequest, lite_input_path: Path) -> Path:
    raw = request.config.getoption("--atmos-output")
    if raw:
        return Path(raw)
    return lite_input_path.parent / f"{lite_input_path.stem}__atmos.json"


@pytest.fixture
def lite_spec(lite_input_path: Path) -> dict[str, Any]:
    return json.loads(lite_input_path.read_text())


@pytest.fixture
def atmos_spec(lite_spec: dict[str, Any]) -> dict[str, Any]:
    return normalize_spec(lite_spec)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestTranslation:

    def test_translation_succeeds(self, atmos_spec):
        """normalize_spec() must return a dict without raising."""
        assert isinstance(atmos_spec, dict)

    def test_required_top_level_keys_present(self, atmos_spec):
        assert "data"        in atmos_spec
        assert "composition" in atmos_spec

    def test_data_entries_have_atmos_shape(self, atmos_spec):
        for entry in atmos_spec["data"]:
            assert "source" in entry,  f"data entry '{entry.get('id')}' missing 'source'"
            assert "dims"   in entry,  f"data entry '{entry.get('id')}' missing 'dims'"
            assert "grid"   in entry,  f"data entry '{entry.get('id')}' missing 'grid'"
            assert "vars"   in entry,  f"data entry '{entry.get('id')}' missing 'vars'"
            assert "file"   not in entry, "'file' key must not survive translation"
            assert "variables" not in entry, "'variables' key must not survive translation"

    def test_dims_are_structured_objects(self, atmos_spec):
        for entry in atmos_spec["data"]:
            dims = entry["dims"]
            assert "lon" in dims, "dims must use 'lon', not 'lng'"
            assert "lng" not in dims, "'lng' must be renamed to 'lon'"
            for dim_name, dim_obj in dims.items():
                assert isinstance(dim_obj, dict), \
                    f"dim '{dim_name}' must be an object, got {type(dim_obj)}"
                assert "key" in dim_obj, f"dim '{dim_name}' missing 'key'"
            if "time" in dims:
                time_dim = dims["time"]
                assert time_dim.get("type")     == "datetime"
                assert time_dim.get("timezone") == "UTC"
                assert "format" in time_dim

    def test_vars_are_objects(self, atmos_spec):
        for entry in atmos_spec["data"]:
            for v in entry["vars"]:
                assert "id"  in v
                assert "key" in v

    def test_grid_type_is_valid(self, atmos_spec):
        valid = {"curvilinear", "scattered"}
        for entry in atmos_spec["data"]:
            assert entry["grid"]["type"] in valid

    def test_source_has_type_discriminator(self, atmos_spec):
        for entry in atmos_spec["data"]:
            assert "type" in entry["source"]

    def test_views_use_frame(self, atmos_spec):
        for view in atmos_spec["composition"]["views"]:
            assert "frame" in view,  f"view '{view.get('id')}' missing 'frame'"
            assert "type"  not in view, \
                f"view '{view.get('id')}' must not have a top-level 'type' key"
            assert "type" in view["frame"]

    def test_geometry_type_is_valid(self, atmos_spec):
        valid = {"mesh", "isoline", "isoband", "point", "vector", "polygon", "trajectory", "particle"}
        for view in atmos_spec["composition"]["views"]:
            for layer in view.get("layers", []):
                geom = layer["geometry"]
                assert geom["type"] in valid, \
                    f"layer '{layer.get('id')}' has invalid geometry type '" + geom['type'] + "'"

    def test_geometry_has_input(self, atmos_spec):
        for view in atmos_spec["composition"]["views"]:
            for layer in view.get("layers", []):
                geom = layer["geometry"]
                assert "input" in geom
                assert "data" in geom["input"]
                # var is optional — omitted when the data ref has no variable
                # component (e.g. bracket-only selector like "wind[time:70]")

    def test_encoding_uses_channels(self, atmos_spec):
        for view in atmos_spec["composition"]["views"]:
            for layer in view.get("layers", []):
                enc = layer["geometry"].get("encoding", {})
                assert "channels" in enc

    def test_color_scale_translated_to_fill_scale(self, atmos_spec):
        for view in atmos_spec["composition"]["views"]:
            for layer in view.get("layers", []):
                channels = layer["geometry"]["encoding"]["channels"]
                if "fill" in channels and "scale" in channels["fill"]:
                    scale = channels["fill"]["scale"]
                    assert "scheme" in scale, "color_scale.palette must become scale.scheme"
                    assert "palette" not in scale, "'palette' key must not survive"
                    assert "domain"  in scale
                    assert "clamp"   in scale, "clamp must always be present (default False)"
                    assert scale["clamp"] is False or isinstance(scale["clamp"], bool)

    def test_bbox_lens_true_becomes_interaction(self, atmos_spec):
        for view in atmos_spec["composition"]["views"]:
            for layer in view.get("layers", []):
                mask = layer.get("mask")
                if mask and mask.get("type") == "bbox":
                    assert "lens" not in mask, "'lens' must not survive translation"
                    if mask.get("interaction"):
                        assert mask["interaction"]["on"] == ["drag", "resize"]

    def test_interactions_renamed_and_reshaped(self, atmos_spec):
        comp = atmos_spec["composition"]
        assert "interaction" not in comp, "'interaction' (singular) must be renamed"
        if "interactions" not in comp:
            return  # no interactions in this spec — nothing further to check
        for ia in comp["interactions"]:
            assert "action" in ia
            sel = ia["action"]["select"]
            assert "dim"    in sel
            assert "target" in sel


class TestOutputFile:

    def test_save_translated_json(
        self,
        request: pytest.FixtureRequest,
        lite_input_path: Path,
        atmos_output_path: Path,
        atmos_spec: dict[str, Any],
    ):
        """Write the translated Atmos spec to disk when --save-json is passed."""
        if not request.config.getoption("--save-json"):
            pytest.skip("Pass --save-json to write the translated output file.")

        atmos_output_path.parent.mkdir(parents=True, exist_ok=True)
        atmos_output_path.write_text(json.dumps(atmos_spec, indent=2))

        print(f"\n  📥  input  → {lite_input_path}")
        print(f"  📤  output → {atmos_output_path}")

        # Verify the written file round-trips cleanly
        reloaded = json.loads(atmos_output_path.read_text())
        assert reloaded == atmos_spec, "Written JSON does not round-trip correctly"