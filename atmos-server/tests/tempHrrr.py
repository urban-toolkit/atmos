import numpy as np
import matplotlib.pyplot as plt
from netCDF4 import Dataset

# ----------------------------
# Configuration
# ----------------------------
wrf_file = "./data/hrrr_20240923_20240927/2024092604_single.nc"
time_index = 0          # choose the time step

# ----------------------------
# Open WRF output
# ----------------------------
nc = Dataset(wrf_file)

print(nc.variables["gh"])

# # # WRF latitude and longitude
# lats = nc.variables["latitude"]
# lons = nc.variables["longitude"]

# air_temp = nc.variables["t"]
# relative_humidity = nc.variables["r"]

# # # Time label
# # times = nc.variables["time"]
# # time_str = b"".join(times).decode("utf-8")

# # ----------------------------
# # Plot
# # ----------------------------
# fig, ax = plt.subplots(figsize=(10, 8))

# pcm = ax.pcolormesh(lons, lats, air_temp, shading="auto")
# cbar = plt.colorbar(pcm, ax=ax, pad=0.02)
# cbar.set_label("Air temperature K")


# # ax.set_title(f"10 m Wind Arrows\n{time_str}")
# ax.set_xlabel("Longitude")
# ax.set_ylabel("Latitude")

# plt.tight_layout()
# plt.show()

nc.close()