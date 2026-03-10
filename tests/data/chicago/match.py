import pandas as pd
import numpy as np
from scipy.spatial import cKDTree

# =========================================================
# Files
# =========================================================
wrf_file = "t2_wrf_t0_t71.csv"
station_file = "station-HourlyDryBulbTemperature.csv"
output_file = "matched_station_wrf.csv"

# =========================================================
# Settings
# =========================================================
chunk_size = 500_000

# =========================================================
# 1) Read station file
# =========================================================
station_df = pd.read_csv(station_file)

station_df["datetime"] = pd.to_datetime(station_df["datetime"], errors="coerce")
station_df["latitude"] = pd.to_numeric(station_df["latitude"], errors="coerce")
station_df["longitude"] = pd.to_numeric(station_df["longitude"], errors="coerce")

station_df["station_row_id"] = np.arange(len(station_df))

station_df = station_df.dropna(subset=["latitude", "longitude", "datetime"]).copy()

# =========================================================
# 2) Discover WRF start datetime from the file
#    In your file, datetime is the base run date, and timestamp is timestep.
# =========================================================
wrf_start_parts = []

for chunk in pd.read_csv(
    wrf_file,
    usecols=["datetime", "timestamp"],
    chunksize=chunk_size
):
    chunk["timestamp"] = pd.to_numeric(chunk["timestamp"], errors="coerce")
    chunk["datetime"] = pd.to_datetime(chunk["datetime"], errors="coerce")

    # timestep 0 gives the run start date/time
    t0 = chunk.loc[chunk["timestamp"] == 0, "datetime"].dropna()
    if not t0.empty:
        wrf_start_parts.append(t0)

if not wrf_start_parts:
    raise ValueError("Could not find WRF timestep 0 to determine start datetime.")

wrf_start_datetime = pd.concat(wrf_start_parts, ignore_index=True).min()
print("WRF start datetime:", wrf_start_datetime)

# =========================================================
# 3) Convert each station datetime to WRF timestep
# =========================================================
delta_hours = (station_df["datetime"] - wrf_start_datetime) / pd.Timedelta(hours=1)

# Keep only exact integer hours
station_df["wrf_timestep"] = delta_hours

# If station datetimes are exactly hourly, this should be near-integer
mask_valid_hour = station_df["wrf_timestep"].notna() & np.isclose(
    station_df["wrf_timestep"] % 1, 0, atol=1e-9
)

station_df = station_df.loc[mask_valid_hour].copy()
station_df["wrf_timestep"] = station_df["wrf_timestep"].astype(int)

# Optional: keep only non-negative timesteps
station_df = station_df[station_df["wrf_timestep"] >= 0].copy()

# =========================================================
# 4) Build WRF grid from timestep 0
# =========================================================
grid_parts = []

for chunk in pd.read_csv(
    wrf_file,
    usecols=["latitude", "longitude", "timestamp"],
    chunksize=chunk_size
):
    chunk["timestamp"] = pd.to_numeric(chunk["timestamp"], errors="coerce")
    chunk["latitude"] = pd.to_numeric(chunk["latitude"], errors="coerce")
    chunk["longitude"] = pd.to_numeric(chunk["longitude"], errors="coerce")

    chunk = chunk[chunk["timestamp"] == 0][["latitude", "longitude"]].dropna()

    if not chunk.empty:
        grid_parts.append(chunk)

if not grid_parts:
    raise ValueError("Could not find any WRF rows with timestamp == 0")

wrf_grid = pd.concat(grid_parts, ignore_index=True).drop_duplicates().reset_index(drop=True)

# =========================================================
# 5) Find nearest WRF grid point for each station location
# =========================================================
station_points = (
    station_df[["id", "name", "latitude", "longitude"]]
    .drop_duplicates()
    .dropna(subset=["latitude", "longitude"])
    .reset_index(drop=True)
)

tree = cKDTree(wrf_grid[["latitude", "longitude"]].to_numpy())

dist, idx = tree.query(station_points[["latitude", "longitude"]].to_numpy(), k=1)

station_points["wrf_latitude"] = wrf_grid.loc[idx, "latitude"].to_numpy()
station_points["wrf_longitude"] = wrf_grid.loc[idx, "longitude"].to_numpy()
station_points["grid_distance_deg"] = dist

station_df = station_df.merge(
    station_points[["id", "latitude", "longitude", "wrf_latitude", "wrf_longitude", "grid_distance_deg"]],
    on=["id", "latitude", "longitude"],
    how="left"
)

# =========================================================
# 6) Build lookup of station needs
# =========================================================
needed_keys = station_df[
    ["station_row_id", "wrf_latitude", "wrf_longitude", "wrf_timestep"]
].copy()

# =========================================================
# 7) Read WRF in chunks and match by timestep
# =========================================================
matches = []

for i, chunk in enumerate(pd.read_csv(
    wrf_file,
    usecols=["latitude", "longitude", "timestamp", "value"],
    chunksize=chunk_size
), start=1):
    print(f"Processing WRF chunk {i}...")

    chunk["latitude"] = pd.to_numeric(chunk["latitude"], errors="coerce")
    chunk["longitude"] = pd.to_numeric(chunk["longitude"], errors="coerce")
    chunk["timestamp"] = pd.to_numeric(chunk["timestamp"], errors="coerce")

    chunk = chunk.rename(columns={
        "latitude": "wrf_latitude",
        "longitude": "wrf_longitude",
        "timestamp": "wrf_timestep",
        "value": "wrf_value"
    })

    chunk = chunk.dropna(subset=["wrf_latitude", "wrf_longitude", "wrf_timestep"])
    chunk["wrf_timestep"] = chunk["wrf_timestep"].astype(int)

    chunk_match = needed_keys.merge(
        chunk[["wrf_latitude", "wrf_longitude", "wrf_timestep", "wrf_value"]],
        on=["wrf_latitude", "wrf_longitude", "wrf_timestep"],
        how="inner"
    )

    if not chunk_match.empty:
        matches.append(chunk_match[["station_row_id", "wrf_value", "wrf_timestep"]])

# =========================================================
# 8) Combine matches
# =========================================================
if matches:
    wrf_match_df = pd.concat(matches, ignore_index=True)
    wrf_match_df = wrf_match_df.drop_duplicates(subset=["station_row_id"])
else:
    wrf_match_df = pd.DataFrame(columns=["station_row_id", "wrf_value", "wrf_timestep"])

# =========================================================
# 9) Final output
# =========================================================
final_df = station_df.merge(
    wrf_match_df,
    on="station_row_id",
    how="left"
)

final_df = final_df.rename(columns={
    "value": "station_value",
    "timestamp": "station_timestamp"
})

final_df = final_df.sort_values(["id", "datetime"]).reset_index(drop=True)

final_df.to_csv(output_file, index=False)

print(f"\nDone. Output saved to: {output_file}")
print(f"Total rows: {len(final_df)}")
print(f"Matched rows: {final_df['wrf_value'].notna().sum()} / {len(final_df)}")