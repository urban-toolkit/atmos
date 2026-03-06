from __future__ import annotations

import argparse
import sys
from pathlib import Path

from atmos_server.runtime.errors import AtmosServerError, SpecValidationError
from atmos_server.schema import SchemaProvider, load_schema, validate_spec
from atmos_server.adapters.readers.json_loader import load_json_file
import json
from atmos_server.core.compiler import compile_spec
from atmos_server.core.executor import run_plan


def _repo_root() -> Path:
    # src/atmos_server/cli.py -> repo root
    return Path(__file__).resolve().parents[3]


def _default_registry() -> SchemaProvider:
    return SchemaProvider(_repo_root() / "schemas")


def _default_version(registry: SchemaProvider) -> str:
    """
    Default to the highest available version by lexical sort.
    Since versions are 'v0.1', 'v0.2', this is usually fine.
    If you later use 'v0.10', consider implementing semantic parsing.
    """
    versions = registry.list_versions()
    if not versions:
        # If repo is misconfigured, fail with a helpful message later.
        return "v0.1"
    return versions[-1]


def cmd_validate(args: argparse.Namespace) -> int:
    spec = load_json_file(args.spec)

    # Schema selection rules:
    # 1) --schema explicit path overrides everything
    # 2) else use registry + --version (or default version)
    if args.schema:
        schema_path = Path(args.schema)
        schema = load_schema(schema_path)
        chosen = str(schema_path)
    else:
        registry = _default_registry()
        version = args.version or _default_version(registry)
        schema = registry.load(version)
        chosen = f"registry:{version}"

    try:
        validate_spec(spec, schema)
    except SpecValidationError as e:
        print(f"❌ Instance is NOT valid under {chosen}. Errors:", file=sys.stderr)
        for i, issue in enumerate(e.issues, start=1):
            print(f"{i}) At {issue.path}: {issue.message}", file=sys.stderr)
            print(f"   ↳ Schema rule: {issue.schema_path}", file=sys.stderr)
        return 2

    print(f"✅ Instance is valid under {chosen}.")
    return 0


def cmd_versions(args: argparse.Namespace) -> int:
    registry = _default_registry()
    versions = registry.list_versions()
    if not versions:
        print("No schemas found. Expected: schemas/<version>/atmos.schema.json", file=sys.stderr)
        return 2
    for v in versions:
        print(v)
    return 0

def cmd_compile(args: argparse.Namespace) -> int:
    spec = load_json_file(args.spec)

    if args.schema:
        schema = load_schema(Path(args.schema))
        chosen_version = args.version or "custom"
    else:
        registry = _default_registry()
        chosen_version = args.version or _default_version(registry)
        schema = registry.load(chosen_version)

    validate_spec(spec, schema)
    plan = compile_spec(spec, schema_version=chosen_version)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps({
        "meta": {"schema_version": plan.meta.schema_version, "spec_id": plan.meta.spec_id},
        "data": [d.data_id for d in plan.inputs],
    }, indent=2), encoding="utf-8")

    print(f"✅ Wrote plan: {out_path}")
    return 0


def cmd_run(args: argparse.Namespace) -> int:
    spec = load_json_file(args.spec)

    if args.schema:
        schema = load_schema(Path(args.schema))
        chosen_version = args.version or "custom"
    else:
        registry = _default_registry()
        chosen_version = args.version or _default_version(registry)
        schema = registry.load(chosen_version)

    validate_spec(spec, schema)
    plan = compile_spec(spec, schema_version=chosen_version)
    manifest = run_plan(plan, args.out)

    print(f"✅ Wrote manifest: {Path(args.out) / 'manifest.json'}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="atmos-server")
    sub = p.add_subparsers(dest="command", required=True)

    v = sub.add_parser("validate", help="Validate an Atmos spec against a pinned schema")
    v.add_argument("spec", help="Path to Atmos spec JSON file")

    v.add_argument(
        "--version",
        help="Pinned schema version (e.g., v0.1). Uses schemas/<version>/atmos.schema.json",
        default=None,
    )

    v.add_argument(
        "--schema",
        help="Explicit schema file path override (bypasses registry).",
        default=None,
    )

    v.set_defaults(func=cmd_validate)

    ls = sub.add_parser("versions", help="List available pinned schema versions")
    ls.set_defaults(func=cmd_versions)

    c = sub.add_parser("compile", help="Validate + compile an Atmos spec into an execution plan")
    c.add_argument("spec", help="Path to Atmos spec JSON file")
    c.add_argument("--version", default=None, help="Pinned schema version (e.g., v0.1)")
    c.add_argument("--schema", default=None, help="Explicit schema path override")
    c.add_argument("--out", required=True, help="Output plan file path (JSON)")
    c.set_defaults(func=cmd_compile)

    r = sub.add_parser("run", help="Validate + compile + run an Atmos spec (writes a manifest)")
    r.add_argument("spec", help="Path to Atmos spec JSON file")
    r.add_argument("--version", default=None, help="Pinned schema version (e.g., v0.1)")
    r.add_argument("--schema", default=None, help="Explicit schema path override")
    r.add_argument("--out", required=True, help="Output directory for artifacts")
    r.set_defaults(func=cmd_run)

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