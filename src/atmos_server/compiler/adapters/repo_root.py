from __future__ import annotations

import os
from pathlib import Path

import atmos_server  # uses installed package location (works in editable dev too)

from atmos_server.compiler.ports import RepoRootResolver


class PackageRepoRootResolver(RepoRootResolver):
    """
    Default: infer repo root from the installed package path:
      .../repo/src/atmos_server/__init__.py  -> repo root = parents[2]
    You can override with ATMOS_REPO_ROOT for tests or deployments.
    """

    def __init__(self, *, env_var: str = "ATMOS_REPO_ROOT") -> None:
        self._env_var = env_var

    def repo_root(self) -> Path:
        override = os.environ.get(self._env_var)
        if override:
            return Path(override).expanduser().resolve()

        pkg_path = Path(atmos_server.__file__).resolve()  # .../src/atmos_server/__init__.py
        return pkg_path.parents[2]  # .../repo