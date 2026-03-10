from pathlib import Path
import numpy as np
import pandas as pd
from netCDF4 import Dataset

CSV_PATH = "t2_wrf_t0_t71.csv"
OUT_PATH = "t2_reconstructed.nc"

# Names in the CSV
LAT_COL = "latitude"
LON_COL = "longitude"
TIME_COL = "timestamp"   # this is the timestep index, not a real datetime axis
VAL_COL = "value"

# Names in the NetCDF
TIME_DIM = "Time"
Y_DIM = "south_north"
X_DIM = "west_east"
VAR_NAME = "T2"


def infer_grid_shape(csv_path: str):
    """
    Infer the 2D grid shape from the first timestep.
    Assumes the CSV is already sorted row-major within each timestep.
    """
    # Read enough rows to capture the first timestep
    sample = pd.read_csv(
        csv_path,
        usecols=[LAT_COL, LON_COL, TIME_COL],
        dtype={
            LAT_COL: "float32",
            LON_COL: "float32",
            TIME_COL: "int32",
        },
    )

    t0 = sample[sample[TIME_COL] == sample[TIME_COL].min()].reset_index(drop=True)

    if t0.empty:
        raise ValueError("Could not find the first timestep in the CSV.")

    npoints = len(t0)

    # Detect row width by finding where longitude resets strongly
    lon = t0[LON_COL].to_numpy()
    dlon = np.diff(lon)

    reset_idx = np.where(dlon < -1.0)[0]
    if len(reset_idx) == 0:
        raise ValueError(
            "Could not infer row width from longitude resets. "
            "The CSV may not be sorted row-major."
        )

    nx = int(reset_idx[0] + 1)
    if npoints % nx != 0:
        raise ValueError(
            f"Inferred nx={nx}, but first timestep has {npoints} points, "
            "which is not divisible by nx."
        )

    ny = npoints // nx
    return ny, nx, npoints


def get_time_info(csv_path: str):
    """
    Count time steps and points per timestep.
    Assumes each timestep has the same number of rows.
    """
    counts = {}

    for chunk in pd.read_csv(
        csv_path,
        usecols=[TIME_COL],
        chunksize=500_000,
        dtype={TIME_COL: "int32"},
    ):
        vc = chunk[TIME_COL].value_counts()
        for ts, ct in vc.items():
            counts[int(ts)] = counts.get(int(ts), 0) + int(ct)

    if not counts:
        raise ValueError("No timestamp values found.")

    timesteps = sorted(counts.keys())
    pts_per_ts = set(counts.values())

    if len(pts_per_ts) != 1:
        raise ValueError(
            f"Not all timesteps have the same number of rows: {counts}"
        )

    return timesteps, pts_per_ts.pop()


def csv_to_netcdf(csv_path: str, out_path: str):
    ny, nx, npoints = infer_grid_shape(csv_path)
    timesteps, points_per_timestep = get_time_info(csv_path)

    if points_per_timestep != npoints:
        raise ValueError(
            f"Mismatch: inferred {npoints} points from first timestep, "
            f"but counted {points_per_timestep} rows per timestep."
        )

    nt = len(timesteps)

    print(f"Inferred grid: ny={ny}, nx={nx}")
    print(f"Number of time steps: {nt}")
    print(f"Points per time step: {npoints}")

    # Create NetCDF
    with Dataset(out_path, "w", format="NETCDF4") as ds:
        # Dimensions
        ds.createDimension(TIME_DIM, nt)
        ds.createDimension(Y_DIM, ny)
        ds.createDimension(X_DIM, nx)

        # Coordinate / metadata variables
        time_var = ds.createVariable(TIME_DIM, "i4", (TIME_DIM,))
        lat_var = ds.createVariable("XLAT", "f4", (Y_DIM, X_DIM), zlib=True, complevel=4)
        lon_var = ds.createVariable("XLONG", "f4", (Y_DIM, X_DIM), zlib=True, complevel=4)

        # Main data variable
        t2_var = ds.createVariable(
            VAR_NAME,
            "f4",
            (TIME_DIM, Y_DIM, X_DIM),
            zlib=True,
            complevel=4,
            fill_value=np.float32(np.nan),
        )

        # Basic attributes
        ds.description = "Reconstructed NetCDF from CSV"
        ds.source = Path(csv_path).name
        ds.note = "timestamp in CSV is stored as timestep index"
        time_var.long_name = "time step"
        lat_var.long_name = "latitude"
        lon_var.long_name = "longitude"
        t2_var.long_name = "2-meter temperature"

        # Set units only if you are sure.
        # Uncomment and adjust if needed:
        # lat_var.units = "degrees_north"
        # lon_var.units = "degrees_east"
        # t2_var.units = "K"  # or "degC" if your CSV is already Celsius

        time_var[:] = np.array(timesteps, dtype=np.int32)

        # Read the file in exact timestep-sized chunks.
        # This assumes the CSV is sorted by timestamp and each timestep occupies a contiguous block.
        reader = pd.read_csv(
            csv_path,
            usecols=[LAT_COL, LON_COL, TIME_COL, VAL_COL],
            chunksize=npoints,
            dtype={
                LAT_COL: "float32",
                LON_COL: "float32",
                TIME_COL: "int32",
                VAL_COL: "float32",
            },
        )

        for i, chunk in enumerate(reader):
            chunk = chunk.reset_index(drop=True)

            if len(chunk) != npoints:
                raise ValueError(
                    f"Chunk {i} has {len(chunk)} rows, expected {npoints}. "
                    "This usually means the CSV is not grouped cleanly by timestep."
                )

            ts_unique = chunk[TIME_COL].unique()
            if len(ts_unique) != 1:
                raise ValueError(
                    f"Chunk {i} contains multiple timestamps: {ts_unique}. "
                    "The CSV is likely not sorted by timestep."
                )

            ts = int(ts_unique[0])

            lat2d = chunk[LAT_COL].to_numpy().reshape(ny, nx)
            lon2d = chunk[LON_COL].to_numpy().reshape(ny, nx)
            val2d = chunk[VAL_COL].to_numpy().reshape(ny, nx)

            # Store lat/lon once
            if i == 0:
                lat_var[:, :] = lat2d
                lon_var[:, :] = lon2d

            # Store T2
            t2_var[ts, :, :] = val2d

            print(f"Wrote timestep {ts}")

    print(f"Done. NetCDF written to: {out_path}")


if __name__ == "__main__":
    csv_to_netcdf(CSV_PATH, OUT_PATH)