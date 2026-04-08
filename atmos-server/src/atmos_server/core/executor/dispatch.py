from __future__ import annotations

from pathlib import Path
from typing import Any

from atmos_server.core.compiler.models import Step
from atmos_server.core.executor.context import ExecutionContext

from atmos_server.core.executor.step_load import execute_step_load
from atmos_server.core.executor.step_transform import execute_step_transform
from atmos_server.core.executor.step_geometry import execute_step_geometry

def execute_step(step: Step, *, repo_root: Path, ctx: ExecutionContext | None = None) -> Any:
    """
    Execute a single step.

    Supported now:
      - kind=load with source.type=geojson
      - kind=transform for derive_wind_speed / derive_wind_direction on GeoJSON upstream
    """
    if step.kind == "load":
        return execute_step_load(step, repo_root)

    if step.kind == "transform":
        return execute_step_transform(step, ctx)

    # geometry etc later
    if step.kind == "geometry":
        return execute_step_geometry(step, ctx)

    raise NotImplementedError(f"Unsupported step kind '{step.kind}' in step {step.id}")
