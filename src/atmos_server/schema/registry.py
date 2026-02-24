from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from atmos_server.runtime.errors import SchemaLoadError
from atmos_server.schema.schema_loader import load_schema


@dataclass(frozen=True)
class SchemaRef:
    """Resolved schema reference inside this server repo."""
    version: str
    path: Path


class SchemaRegistry:
    """
    Server-local registry for pinned Atmos schema versions.

    Convention:
      schemas/<version>/atmos.schema.json

    Example:
      schemas/v0.1/atmos.schema.json
    """

    def __init__(self, root_dir: str | Path):
        self.root_dir = Path(root_dir)

    def list_versions(self) -> list[str]:
        if not self.root_dir.exists():
            return []
        if not self.root_dir.is_dir():
            return []

        versions: list[str] = []
        for child in self.root_dir.iterdir():
            if child.is_dir():
                schema_file = child / "atmos.schema.json"
                if schema_file.exists() and schema_file.is_file():
                    versions.append(child.name)

        # Keep stable ordering
        return sorted(versions)

    def resolve(self, version: str) -> SchemaRef:
        version_dir = self.root_dir / version
        schema_path = version_dir / "atmos.schema.json"

        if not schema_path.exists():
            available = ", ".join(self.list_versions()) or "(none)"
            raise SchemaLoadError(
                f"Unknown schema version '{version}'. Available: {available}. "
                f"Expected file at: {schema_path}"
            )

        if not schema_path.is_file():
            raise SchemaLoadError(f"Schema path is not a file: {schema_path}")

        return SchemaRef(version=version, path=schema_path)

    def load(self, version: str) -> dict:
        ref = self.resolve(version)
        return load_schema(ref.path)