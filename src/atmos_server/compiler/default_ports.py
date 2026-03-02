from __future__ import annotations

from atmos_server.compiler.adapters.repo_root import PackageRepoRootResolver
from atmos_server.compiler.adapters.render_maplibre import MapLibreRenderBuilder
from atmos_server.compiler.adapters.xarray_time import XarrayTimeLenResolver
from atmos_server.compiler.ports import CompilerPorts


def make_default_ports() -> CompilerPorts:
    repo = PackageRepoRootResolver()
    return CompilerPorts(
        repo_root=repo,
        time_len=XarrayTimeLenResolver(repo),
        render=MapLibreRenderBuilder(),
    )