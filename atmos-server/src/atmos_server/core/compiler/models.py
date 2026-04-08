from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal


# -------------------------
# Inputs
# -------------------------

@dataclass(frozen=True)
class InputRef:
    """A reference to a data item declared in the Atmos spec."""
    data_id: str


# -------------------------
# Steps (IR nodes)
# -------------------------

StepKind = Literal["load", "transform", "geometry"]


@dataclass(frozen=True)
class Step:
    """
    A single execution step in the plan.
    `depends_on` are step ids that must run first.
    """
    id: str
    kind: StepKind
    depends_on: tuple[str, ...] = ()
    params: dict[str, Any] = field(default_factory=dict)


# -------------------------
# Artifacts
# -------------------------

ArtifactFormat = Literal["json", "geojson", "parquet", "arrow", "zarr", "bin", "vega-lite"]


@dataclass(frozen=True)
class Artifact:
    """
    A declared output artifact produced by the run.
    `producer_step` points to the step responsible for producing it.
    `path` is relative to the chosen output directory.
    """
    id: str
    format: ArtifactFormat
    producer_step: str
    path: str
    metadata: dict[str, Any] = field(default_factory=dict)


# -------------------------
# Plan + metadata
# -------------------------

@dataclass(frozen=True)
class PlanMeta:
    schema_version: str
    spec_id: str | None = None


@dataclass(frozen=True)
class Plan:
    meta: PlanMeta
    inputs: tuple[InputRef, ...]
    steps: tuple[Step, ...]
    artifacts: tuple[Artifact, ...]
    raw_spec: dict[str, Any]