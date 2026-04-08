import numpy as np
import matplotlib.pyplot as plt
from netCDF4 import Dataset

# ----------------------------
# Configuration
# ----------------------------
wrf_file = "./data/wrfout_d03_2011-01-10_00_00_00"
time_index = 70          # choose the time step
skip = 2               # subsampling for arrows
scale = 250             # arrow scaling; adjust if needed

# ----------------------------
# Open WRF output
# ----------------------------
nc = Dataset(wrf_file)

# WRF latitude and longitude
lats = nc.variables["XLAT"][time_index, :, :]
lons = nc.variables["XLONG"][time_index, :, :]

# 10 m wind components
# U10 = zonal wind (west-east)
# V10 = meridional wind (south-north)
u10 = nc.variables["U10"][time_index, :, :]
v10 = nc.variables["V10"][time_index, :, :]

# Optional: wind speed
wspd = np.sqrt(u10**2 + v10**2)

# Time label
times = nc.variables["Times"][:]
time_str = b"".join(times[time_index]).decode("utf-8")

# ----------------------------
# Plot
# ----------------------------
fig, ax = plt.subplots(figsize=(10, 8))

# Background speed field (optional, but helps visualization)
pcm = ax.pcolormesh(lons, lats, wspd, shading="auto")
cbar = plt.colorbar(pcm, ax=ax, pad=0.02)
cbar.set_label("Wind speed at 10 m (m/s)")

# Wind arrows
q = ax.quiver(
    lons[::skip, ::skip],
    lats[::skip, ::skip],
    u10[::skip, ::skip],
    v10[::skip, ::skip],
    scale=scale
)

# Optional quiver key
ax.quiverkey(q, 0.9, 1.03, 10, "10 m/s", labelpos="E", coordinates="axes")

ax.set_title(f"10 m Wind Arrows\n{time_str}")
ax.set_xlabel("Longitude")
ax.set_ylabel("Latitude")

plt.tight_layout()
plt.show()

nc.close()