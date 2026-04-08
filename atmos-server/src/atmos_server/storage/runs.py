# src/atmos_server/storage/runs.py
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass(frozen=True)
class RunStorage:
    root: Path = Path("artifacts")

    @property
    def runs_root(self) -> Path:
        return self.root / "runs"

    def ensure_runs_root(self) -> None:
        self.runs_root.mkdir(parents=True, exist_ok=True)

    def run_dir(self, run_id: str) -> Path:
        return self.runs_root / run_id

    def ensure_run_dir(self, run_id: str) -> Path:
        self.ensure_runs_root()
        d = self.run_dir(run_id)
        d.mkdir(parents=True, exist_ok=True)
        return d

    def manifest_path(self, run_id: str) -> Path:
        return self.run_dir(run_id) / "manifest.json"

    def step_dir(self, run_id: str, step_id: str) -> Path:
        return self.run_dir(run_id) / "steps" / step_id

    def ensure_step_dir(self, run_id: str, step_id: str) -> Path:
        d = self.step_dir(run_id, step_id)
        d.mkdir(parents=True, exist_ok=True)
        return d