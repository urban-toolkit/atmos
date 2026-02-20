from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass
from typing import Iterable

from atmos_server.errors import AtmosServerError
from atmos_server.plan.types import Step


class DagError(AtmosServerError):
    """Raised when the execution DAG is invalid (missing deps, cycles)."""


def topological_sort(steps: Iterable[Step]) -> list[Step]:
    """
    Topologically sort steps using Kahn's algorithm.

    Validates:
      - every depends_on reference exists
      - no cycles

    Returns:
      Steps in an order that respects depends_on.
    """
    steps_list = list(steps)
    by_id: dict[str, Step] = {s.id: s for s in steps_list}

    # Validate uniqueness of ids
    if len(by_id) != len(steps_list):
        # Find duplicates
        seen: set[str] = set()
        dupes: set[str] = set()
        for s in steps_list:
            if s.id in seen:
                dupes.add(s.id)
            seen.add(s.id)
        raise DagError(f"Duplicate step ids: {', '.join(sorted(dupes))}")

    # Validate dependencies exist and build indegree + adjacency
    indegree: dict[str, int] = {s.id: 0 for s in steps_list}
    adj: dict[str, list[str]] = defaultdict(list)

    for s in steps_list:
        for dep in s.depends_on:
            if dep not in by_id:
                raise DagError(f"Step '{s.id}' depends on missing step '{dep}'")
            adj[dep].append(s.id)
            indegree[s.id] += 1

    # Kahn's algorithm
    q = deque([sid for sid, deg in indegree.items() if deg == 0])
    ordered_ids: list[str] = []

    while q:
        sid = q.popleft()
        ordered_ids.append(sid)
        for nxt in adj.get(sid, []):
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)

    if len(ordered_ids) != len(steps_list):
        # Cycle exists. Provide a helpful message (the nodes still with indegree > 0).
        cyclic = [sid for sid, deg in indegree.items() if deg > 0]
        raise DagError(
            "Cycle detected in plan steps. Steps involved (or downstream of cycle): "
            + ", ".join(sorted(cyclic))
        )

    return [by_id[sid] for sid in ordered_ids]