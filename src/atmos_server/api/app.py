from __future__ import annotations

from pathlib import Path
from uuid import uuid4
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from atmos_server.schema import SchemaProvider, validate_spec
from atmos_server.core.compiler import compile_spec
from atmos_server.core.executor import run_plan
from atmos_server.bootstrap.wiring import make_default_ports


app = FastAPI(title="atmos-server", version="0.1.0")

# Resolve repo root (…/atmos-server)
REPO_ROOT = Path(__file__).resolve().parents[3]
SCHEMAS_DIR = REPO_ROOT / "schemas"

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
    if "spec" not in payload:
        raise HTTPException(status_code=400, detail="Missing 'spec' in request body")

    spec = payload["spec"]
    runtime_state = payload.get("runtimeState", {})
    print("API runtime_state =", runtime_state)

    if not isinstance(spec, dict):
        raise HTTPException(status_code=400, detail="'spec' must be a JSON object")

    registry = SchemaProvider(SCHEMAS_DIR)
    try:
        schema = registry.load(version)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unknown schema version '{version}': {e}")

    try:
        validate_spec(spec, schema)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    run_id = uuid4().hex[:10]
    out_dir = RUNS_DIR / run_id
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        ports = make_default_ports()
        plan = compile_spec(spec, schema_version=version, ports=ports, runtime_state=runtime_state)
        manifest = run_plan(plan, out_dir, repo_root=REPO_ROOT)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {e}")

    base_url = f"/artifacts/runs/{run_id}/"
    return JSONResponse({"manifest": manifest, "baseUrl": base_url})