from __future__ import annotations

from pathlib import Path


def resolve_repo_path(repo_root: Path, value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else (repo_root / path)