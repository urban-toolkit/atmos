from __future__ import annotations

from atmos_server.adapters.filesystem.package_repo_root import PackageRepoRootResolver
from atmos_server.adapters.render.maplibre_render_builder import MapLibreRenderBuilder
from atmos_server.adapters.time.xarray_time import XarrayTimeLenResolver
from atmos_server.core.compiler.ports import CompilerPorts


def make_default_ports() -> CompilerPorts:
    repo = PackageRepoRootResolver()

    return CompilerPorts(
        repo_root=repo,
        time_len=XarrayTimeLenResolver(repo),
        render=MapLibreRenderBuilder(),
    )