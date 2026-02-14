from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from atmos_server.errors import AtmosServerError, SpecValidationError
from atmos_server.schema import load_json_file, load_schema, validate_spec


def _default_schema_path() -> Path:
    # repo_root / schemas / atmos-v0.1.schema.json
    # This file should be copied from atmos/dist/v0.1/atmos.schema.json (or similar).
    return Path(__file__).resolve().parents[2] / "schemas" / "atmos-v0.1.schema.json"


def cmd_validate(args: argparse.Namespace) -> int:
    schema_path = Path(args.schema) if args.schema else _default_schema_path()
    schema = load_schema(schema_path)
    spec = load_json_file(args.spec)

    try:
        validate_spec(spec, schema)
    except SpecValidationError as e:
        print("❌ Instance is NOT valid. Errors:", file=sys.stderr)
        for i, issue in enumerate(e.issues, start=1):
            print(f"{i}) At {issue.path}: {issue.message}", file=sys.stderr)
            print(f"   ↳ Schema rule: {issue.schema_path}", file=sys.stderr)
        return 2

    print("✅ Instance is valid.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="atmos-server")
    sub = p.add_subparsers(dest="command", required=True)

    v = sub.add_parser("validate", help="Validate an Atmos spec against a pinned schema")
    v.add_argument("spec", help="Path to Atmos spec JSON file")
    v.add_argument(
        "--schema",
        help="Path to pinned bundled schema JSON file (defaults to schemas/atmos-v0.1.schema.json)",
        default=None,
    )
    v.set_defaults(func=cmd_validate)

    return p


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        rc = args.func(args)
    except AtmosServerError as e:
        print(f"❌ {e}", file=sys.stderr)
        rc = 2
    except Exception as e:
        print(f"💥 Unexpected error: {e}", file=sys.stderr)
        rc = 1

    raise SystemExit(rc)
