from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, Protocol, runtime_checkable


# -------------------------
# Core compile context types (shared shape)
# -------------------------

Json = dict[str, Any]
JsonLike = Mapping[str, Any]


@dataclass(frozen=True)
class DataRef:
    """
    Minimal reference to a data item used during compilation for lookups
    (e.g., time length inference). Keep it lightweight on purpose.
    """
    data_id: str


# -------------------------
# Ports (interfaces)
# -------------------------

@runtime_checkable
class RepoRootResolver(Protocol):
    """
    Resolves a "repo root" or base path used for locating local data referenced by a spec.

    Keep it as a port because:
    - tests can point it to a temp dir
    - production can derive it from package structure / env var
    """

    def repo_root(self) -> Path: ...


@runtime_checkable
class TimeLenResolver(Protocol):
    """
    Answers: 'how many time steps does this data_id have?'

    Used for repeat expansion and/or validation. Return None when unknown.
    """

    def time_len(self, *, spec: Json, data_id: str) -> int | None: ...


@runtime_checkable
class RenderBuilder(Protocol):
    """
    Builds renderer-specific metadata payloads from geometry + encoding.

    Keep it as a port so compilation can stay renderer-agnostic,
    and render metadata can evolve independently (MapLibre today, other renderers later).
    """

    def build_render(
        self,
        *,
        geometry_type: str,
        encoding: JsonLike | None,
        defaults: JsonLike | None = None,
    ) -> dict[str, Any] | None: ...


# -------------------------
# Optional: small helper for dependency injection grouping
# -------------------------

@dataclass(frozen=True)
class CompilerPorts:
    """
    Convenience bundle so compile_v0_1 can accept a single object if desired.
    (You can also pass ports individually; this is just ergonomic.)
    """
    repo_root: RepoRootResolver
    time_len: TimeLenResolver
    render: RenderBuilder