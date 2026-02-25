from __future__ import annotations

from pathlib import Path
from uuid import uuid4
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from atmos_server.schema import SchemaProvider, validate_spec
from atmos_server.compiler import compile_plan
from atmos_server.executor import run_plan

from atmos_server.constants.paths import REPO_ROOT, SCHEMAS_DIR

app = FastAPI(title="atmos-server", version="0.1.0")

# Resolve repo root (…/atmos-server)
# REPO_ROOT = Path(__file__).resolve().parents[3]
# SCHEMAS_DIR = REPO_ROOT / "schemas"

# Where runs go (committed? NO. keep ignored.)
RUNS_DIR = REPO_ROOT / "artifacts" / "runs"
RUNS_DIR.mkdir(parents=True, exist_ok=True)

# Serve artifacts under /artifacts/...
app.mount("/artifacts", StaticFiles(directory=REPO_ROOT / "artifacts"), name="artifacts")


@app.get("/api/health")
def health() -> dict[str, str]:
  return {"status": "ok"}


@app.post("/api/run")
def api_run(
    payload: dict[str, Any],
    version: str = Query(..., description="Schema version, e.g. v0.1"),
) -> JSONResponse:
    """
    Minimal prototype endpoint:
      - expects { "spec": <json> }
      - validates against registry version
      - compiles + runs
      - returns { manifest, baseUrl }
    """
    if "spec" not in payload:
        raise HTTPException(status_code=400, detail="Missing 'spec' in request body")

    spec = payload["spec"]
    if not isinstance(spec, dict):
        raise HTTPException(status_code=400, detail="'spec' must be a JSON object")

    # Load schema
    registry = SchemaProvider(SCHEMAS_DIR)
    try:
        schema = registry.load(version)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unknown schema version '{version}': {e}")

    # Validate
    try:
        validate_spec(spec, schema)
    except Exception as e:
        # Your validate_spec raises SpecValidationError; stringify is OK for prototype
        raise HTTPException(status_code=422, detail=str(e))

    # Compile + run
    run_id = uuid4().hex[:10]
    out_dir = RUNS_DIR / run_id
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        plan = compile_plan(spec, schema_version=version)
        manifest = run_plan(plan, out_dir)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {e}")

    # IMPORTANT: baseUrl should end with /
    base_url = f"/artifacts/runs/{run_id}/"
    return JSONResponse({"manifest": manifest, "baseUrl": base_url})