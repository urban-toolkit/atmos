from dataclasses import dataclass
import xarray as xr

@dataclass
class DataObject:
  id:str
  dataset: xr.Dataset