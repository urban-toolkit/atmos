from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class CSVHandle:
    path: Path

def open_csv_handle(path: str | Path) -> CSVHandle:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"CSV not found: {p}")
    if not p.is_file():
        raise FileNotFoundError(f"CSV path is not a file: {p}")
    return CSVHandle(path=p)