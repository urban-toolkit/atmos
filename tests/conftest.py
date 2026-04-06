import json
from pathlib import Path
from typing import Any

import pytest


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--save-json",
        action="store_true",
        default=False,
        help="Write each translated spec to a JSON file next to the test.",
    )
    parser.addoption(
        "--lite-input",
        default=None,
        metavar="PATH",
        help="Path to the Atmos-Lite input JSON file for the e2e test.",
    )
    parser.addoption(
        "--atmos-output",
        default=None,
        metavar="PATH",
        help=(
            "Path where the translated Atmos JSON will be written (requires --save-json). "
            "Defaults to <input-stem>__atmos.json next to the input file."
        ),
    )


@pytest.fixture
def save_result(request: pytest.FixtureRequest):
    """Return a callable that saves a translated spec to disk when --save-json is set."""

    def _save(spec: dict[str, Any], test_name: str) -> None:
        if not request.config.getoption("--save-json"):
            return
        out_path = Path(__file__).parent / f"{test_name}__translated.json"
        out_path.write_text(json.dumps(spec, indent=2))
        print(f"\n  💾  saved → {out_path}")

    return _save