from __future__ import annotations
from dataclasses import dataclass
import xarray as xr

@dataclass(frozen=True, slots=True)
class DataObject:
  id:str
  dataset: xr.Dataset