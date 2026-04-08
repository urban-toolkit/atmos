from __future__ import annotations

from pathlib import Path
from typing import Protocol


class RepoRootResolver(Protocol):
    def repo_root(self) -> Path: ...