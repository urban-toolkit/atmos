from __future__ import annotations

import json
from pathlib import Path
from typing import Any
import pandas as pd
import re

from atmos_server.core.executor.context import ExecutionContext
from atmos_server.core.executor.dispatch import execute_step
from atmos_server.core.executor.dag import topological_sort
from atmos_server.core.compiler.models import Plan


_TEMPLATE_RE = re.compile(r"\{([A-Za-z_][A-Za-z0-9_]*)\}")

def _resolve_legend_sources(
    legend: dict[str, Any],
    expanded_views: list[dict[str, Any]],
) -> dict[str, Any]:
    out = dict(legend)
    sources = legend.get("source") or []
    resolved = []

    for src in sources:
        if not isinstance(src, dict):
            continue

        src_view = src.get("view")
        src_layers = src.get("layers")
        src_channel = src.get("channel")

        for v in expanded_views:
            vid = v.get("id")
            rep = v.get("_repeat") or {}
            base_view_id = rep.get("baseViewId", vid)

            if src_view == vid or src_view == base_view_id:
                resolved.append({
                    "view": vid,
                    "layers": src_layers,
                    "channel": src_channel,
                })

    out["resolvedSource"] = resolved
    return out

def _resolve_template_string(template: str, values: dict[str, Any]) -> str:
    def repl(match):
        key = match.group(1)
        value = values.get(key)
        return str(value) if value is not None else match.group(0)
    return _TEMPLATE_RE.sub(repl, template)

# def _resolve_title_spec(title: dict[str, Any] | None, values: dict[str, Any]) -> dict[str, Any] | None:
#     if not isinstance(title, dict):
#         return None

#     out = dict(title)

#     template = title.get("template")
#     if isinstance(template, str):
#         out["text"] = _resolve_template_string(template, values)

#     subtitle_template = title.get("subtitleTemplate")
#     if isinstance(subtitle_template, str):
#         out["subtitle"] = _resolve_template_string(subtitle_template, values)

#     return out

def _resolve_title_spec(title: dict[str, Any] | None, values: dict[str, Any]) -> dict[str, Any] | None:
    if not isinstance(title, dict):
        return None

    out = dict(title)

    template = title.get("template")
    if isinstance(template, str):
        if values:
            out["text"] = _resolve_template_string(template, values)
        elif not isinstance(out.get("text"), str):
            out["text"] = template

    subtitle_template = title.get("subtitleTemplate")
    if isinstance(subtitle_template, str):
        if values:
            out["subtitle"] = _resolve_template_string(subtitle_template, values)
        elif not isinstance(out.get("subtitle"), str):
            out["subtitle"] = subtitle_template

    return out

def _dataframe_to_vl_values(df, field_map: dict[str, str]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []

    for _, row in df.iterrows():
        rec: dict[str, Any] = {}
        for atmos_field, source_col in field_map.items():
            if source_col in row:
                value = row[source_col]
                if hasattr(value, "isoformat"):
                    try:
                        value = value.isoformat()
                    except Exception:
                        pass
                rec[atmos_field] = value
        records.append(rec)

    return records

def _infer_time_len_from_ctx(ctx: ExecutionContext, plan: Plan) -> int | None:
    """
    Try to infer time length from any time-indexable loaded/derived object already in ctx.
    Returns None if we can't infer.
    """
    # Prefer any netcdf DataObject from load steps
    for step in plan.steps:
        if step.kind != "load":
            continue
        try:
            obj = ctx.get(step.id)
        except KeyError:
            continue
        # DataObject: has .dataset with dims
        ds = getattr(obj, "dataset", None)
        if ds is not None:
            for dim in ("Time", "time"):
                if dim in getattr(ds, "dims", {}):
                    return int(ds.sizes[dim])

    # Fallback: any DataFrame with a datetime-like column (if present)
    # (This is weaker; better is to pass a resolved timeKey later.)
    try:
        import pandas as pd
    except Exception:
        pd = None

    if pd is not None:
        for step in plan.steps:
            if step.kind != "load":
                continue
            try:
                obj = ctx.get(step.id)
            except KeyError:
                continue
            if isinstance(obj, pd.DataFrame):
                # heuristic: pick the first datetime64 column
                for c in obj.columns:
                    if str(obj[c].dtype).startswith("datetime64"):
                        return int(obj[c].dropna().nunique())
    return None

def run_plan(plan: Plan, out_dir: str | Path, *, repo_root: Path) -> dict[str, Any]:
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
    executed: list[dict[str, Any]] = []

    ordered_steps = topological_sort(plan.steps)
    
    step_status: dict[str, str] = {}
    executed: list[dict[str, Any]] = []

    for step in ordered_steps:
        status = "skipped"
        error: str | None = None

        # If any dependency did not succeed, skip this step
        blocked_deps = [dep for dep in step.depends_on if step_status.get(dep) != "ok"]
        if blocked_deps:
            status = "skipped"
            error = f"Skipped due to non-ok dependencies: {', '.join(blocked_deps)}"
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
            continue

        # Extra safety: if a dep is 'ok' but the ctx doesn't contain it (shouldn't happen, but protects you)
        missing_ctx = []
        for dep in step.depends_on:
            try:
                ctx.get(dep)
            except KeyError:
                missing_ctx.append(dep)

        if missing_ctx:
            status = "skipped"
            error = f"Skipped due to missing deps in context: {', '.join(missing_ctx)}"
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
            continue

        try:
            result = execute_step(step, repo_root=repo_root, ctx=ctx)
            ctx.put(step.id, result)
            status = "ok"
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
    written_paths: set[str] = set()

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

                path_key = str(out_path)

                if path_key not in written_paths:
                    out_path.write_text(json.dumps(obj, indent=2), encoding="utf-8")
                    written_paths.add(path_key)

                # out_path.write_text(json.dumps(obj, indent=2), encoding="utf-8")

                materialized.append(
                    {
                        "id": a.id,
                        "format": a.format,
                        "path": a.path,
                        "producerStep": a.producer_step,
                        "metadata": a.metadata,
                    }
                )
        elif a.format == "vega-lite":
            if not isinstance(obj, pd.DataFrame):
                raise TypeError(f"Artifact {a.id} expects DataFrame from {a.producer_step}")

            meta = a.metadata or {}
            vl_spec = dict(meta.get("vegaLite") or {})
            field_map = dict(meta.get("fieldMap") or {})

            vl_spec["data"] = {
                "values": _dataframe_to_vl_values(obj, field_map)
            }

            out_path.write_text(json.dumps(vl_spec, indent=2), encoding="utf-8")

            materialized.append(
                {
                    "id": a.id,
                    "format": a.format,
                    "path": a.path,
                    "producerStep": a.producer_step,
                    "metadata": a.metadata,
                }
            )
        
        else:
            raise NotImplementedError(f"Artifact format not supported yet: {a.format}")
    
    
    raw_spec = plan.raw_spec or {}
    expanded_views = raw_spec.get("_expandedViews") or []
    composition = raw_spec.get("composition") or {}

    resolved_views = []

    for v in expanded_views:
        if not isinstance(v, dict):
            continue

        vid = v.get("id")
        base = (v.get("_repeat") or {}).get("baseViewId", vid)
        repeat = v.get("_repeat") or {}
        template_vars = v.get("_templateVars") or {}

        vctx = v.get("context") or {}
        # title = _resolve_title_spec(vctx.get("title"), template_vars)
        title = vctx.get("title")

        layers = []
        for layer in v.get("layers") or []:
            if isinstance(layer, dict):
                lid = layer.get("id")
                if isinstance(lid, str):
                    layers.append(lid)

        resolved_views.append({
            "id": vid,
            "baseViewId": base,
            "repeat": repeat,
            "context": {
                "title": title
            },
            "layers": layers
        })

    comp_ctx = composition.get("context") or {}
    resolved_comp_ctx: dict[str, Any] = {}

    # Title (static, no template resolution needed here)
    if "title" in comp_ctx:
        resolved_comp_ctx["title"] = comp_ctx["title"]

    # Legends
    legends = comp_ctx.get("legends") or []
    if isinstance(legends, list):
        resolved_legends = []
        for lg in legends:
            if isinstance(lg, dict):
                resolved_legends.append(
                    _resolve_legend_sources(lg, expanded_views)
                )
        if resolved_legends:
            resolved_comp_ctx["legends"] = resolved_legends
    
    # manifest: dict[str, Any] = {
    #     "kind": "atmos-server-manifest",
    #     "schemaVersion": plan.meta.schema_version,
    #     "specId": plan.meta.spec_id,
    #     "inputs": [{"dataId": i.data_id} for i in plan.inputs],
    #     "steps": executed,
    #     "artifacts": materialized,
    # }

    manifest: dict[str, Any] = {
        "kind": "atmos-server-manifest",
        "schemaVersion": plan.meta.schema_version,
        "specId": plan.meta.spec_id,
        "inputs": [{"dataId": i.data_id} for i in plan.inputs],
        "steps": executed,
        "artifacts": materialized,
    }

    # Add composition
    manifest["composition"] = {
        "layout": composition.get("layout"),
        "context": resolved_comp_ctx
    }

    # Add views
    manifest["views"] = resolved_views

    tlen = _infer_time_len_from_ctx(ctx, plan)
    if isinstance(tlen, int) and tlen > 0:
        manifest["uiState"] = {"timeMax": tlen - 1}

    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest