# atmos-server

Reference runtime for the Atmos specification.

Atmos is a declarative grammar (language) defined in the `atmos` repository.
This repository does **not** define the language. It **consumes** a pinned
version of the Atmos JSON Schema to validate specs, then executes data loading,
transforms, and geometry building to produce artifacts for visualization clients.

## What this repo is
- A spec validator and interpreter (runtime)
- A data processing engine (NetCDF/CSV/GeoJSON, transforms, derived fields)
- An HTTP API to serve processed artifacts

## What this repo is NOT
- The Atmos grammar / schema source of truth (see `atmos`)
- A visualization client or UI (see `atmos-interface`)

## Schema version pinning
This repo pins a bundled Atmos schema in `schemas/` (e.g., `schemas/atmos-v0.1.schema.json`)
to ensure reproducible behavior.
