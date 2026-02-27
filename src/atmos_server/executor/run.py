from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from atmos_server.executor.context import ExecutionContext
from atmos_server.executor.dispatch import execute_step
from atmos_server.executor.dag import topological_sort
from atmos_server.compiler.types import Plan



def _repo_root() -> Path:
    # src/atmos_server/execute/run.py -> repo root
    return Path(__file__).resolve().parents[3]


def run_plan(plan: Plan, out_dir: str | Path) -> dict[str, Any]:
    """
    Version-agnostic runner.

    v0.x behavior:
      - executes load steps (currently geojson only)
      - records step execution status in manifest
      - does not yet materialize plan.artifacts (later)
    """
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    ctx = ExecutionContext()
    root = _repo_root()

    executed: list[dict[str, Any]] = []

    ordered_steps = topological_sort(plan.steps)
    
    step_status: dict[str, str] = {}
    executed: list[dict[str, Any]] = []

    for step in ordered_steps:
        status = "skipped"
        error: str | None = None

        # If any dependency failed, skip this step
        failed_deps = [dep for dep in step.depends_on if step_status.get(dep) == "error"]
        if failed_deps:
            status = "skipped"
            error = f"Skipped due to failed dependencies: {', '.join(failed_deps)}"
        else:
            try:
                if step.kind == "load":
                    result = execute_step(step, repo_root=root, ctx=ctx)
                    ctx.put(step.id, result)
                    status = "ok"
                elif step.kind == "transform":
                    result = execute_step(step, repo_root=root, ctx=ctx)
                    ctx.put(step.id, result)
                    status = "ok"
                elif step.kind == "geometry":
                    result = execute_step(step, repo_root=root, ctx=ctx)
                    ctx.put(step.id, result)
                    status = "ok"
                else:
                    status = "todo"
            except Exception as e:
                status = "error"
                error = f"{type(e).__name__}: {e}"

        step_status[step.id] = status

        executed.append(
            {
                "id": step.id,
                "kind": step.kind,
                "dependsOn": list(step.depends_on),
                "status": status,
                **({"error": error} if error else {}),
            }
        )

    # Materialize artifacts (prototype: geojson only for now)
    materialized: list[dict[str, Any]] = []
    for a in plan.artifacts:
        if step_status.get(a.producer_step) != "ok":
            continue

        obj = ctx.get(a.producer_step)
        out_path = out / a.path
        out_path.parent.mkdir(parents=True, exist_ok=True)

        if a.format == "geojson":

            # ---------- CASE 1 — multi-geometry output (isolines + labels) ----------
            if isinstance(obj, dict) and "lines" in obj and "labels" in obj:

                # write isoline lines
                out_path.write_text(json.dumps(obj["lines"], indent=2), encoding="utf-8")

                materialized.append(
                    {
                        "id": a.id,
                        "format": a.format,
                        "path": a.path,
                        "producerStep": a.producer_step,
                        "metadata": a.metadata,
                    }
                )

                # write labels as a second artifact
                label_path = out_path.with_name(out_path.stem + "-labels.geojson")

                label_meta = dict(a.metadata or {})
                # label_meta["render"] = {
                #     "renderer": "maplibre",
                #     "layerType": "symbol"
                # }
                label_meta["render"] = {
                    "renderer": "maplibre",
                    "layerType": "symbol",
                    "layout": {"text-field": ["get", "label"], "text-size": 12},
                    "paint": {"text-color": "#000000"},
                }

                label_meta["role"] = "label"

                label_id = f"{a.id}:labels"
                base_layer_id = (label_meta.get("layerId") or a.id)
                label_meta["layerId"] = f"{base_layer_id}:labels"

                label_path.write_text(json.dumps(obj["labels"], indent=2), encoding="utf-8")

                materialized.append(
                    {
                        "id": label_id,
                        "format": a.format,
                        "path": label_path.name,
                        "producerStep": a.producer_step,
                        "metadata": label_meta,
                    }
                )

            # ---------- CASE 2 — normal single-geometry ----------
            else:
                if not isinstance(obj, dict):
                    raise TypeError(f"Artifact {a.id} expects dict GeoJSON from {a.producer_step}")

                out_path.write_text(json.dumps(obj, indent=2), encoding="utf-8")

                materialized.append(
                    {
                        "id": a.id,
                        "format": a.format,
                        "path": a.path,
                        "producerStep": a.producer_step,
                        "metadata": a.metadata,
                    }
                )

        # if a.format == "geojson":
        #     if not isinstance(obj, dict):
        #         raise TypeError(f"Artifact {a.id} expects dict GeoJSON from {a.producer_step}")
        #     out_path.write_text(json.dumps(obj, indent=2), encoding="utf-8")
        #     materialized.append(
        #         {
        #             "id": a.id,
        #             "format": a.format,
        #             "path": a.path,
        #             "producerStep": a.producer_step,
        #             "metadata": a.metadata,
        #         }
        #     )
        else:
            raise NotImplementedError(f"Artifact format not supported yet: {a.format}")
    
    manifest: dict[str, Any] = {
        "kind": "atmos-server-manifest",
        "schemaVersion": plan.meta.schema_version,
        "specId": plan.meta.spec_id,
        "inputs": [{"dataId": i.data_id} for i in plan.inputs],
        "steps": executed,
        "artifacts": materialized,
    }

    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest