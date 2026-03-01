from __future__ import annotations

from typing import Any

def v0_1_transform_diagnostixsslp(params, step_id, derived_data_to_step, derived_data_to_base_data, _var_id_to_key):
    inp = params.get("input") or {}
    if not isinstance(inp, dict):
        raise ValueError("diagnostic.slp input must be an object")

    # NEW: prefer input.data (matches your desired pattern)
    base_data = inp.get("data")
    if not isinstance(base_data, str) or not base_data:
        # Back-compat fallback: allow old transform.data
        base_data = params.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("diagnostic.slp requires input.data (or legacy transform.data)")

    # Optional but useful: normalize so downstream logic can assume params["data"]
    params["data"] = base_data

    sp = inp.get("surfacePressure")
    t2 = inp.get("airTemperature2m")
    r2 = inp.get("waterVaporMixingRatio2m")
    sh = inp.get("surfaceHeight")
    sg = inp.get("surfaceGeopotential")

    resolved: dict[str, Any] = {}

    if isinstance(sp, str):
        k = _var_id_to_key(base_data, sp)
        if k:
            resolved["surfacePressureKey"] = k

    if isinstance(t2, str):
        k = _var_id_to_key(base_data, t2)
        if k:
            resolved["airTemperature2mKey"] = k

    if isinstance(r2, str):
        k = _var_id_to_key(base_data, r2)
        if k:
            resolved["waterVaporMixingRatio2mKey"] = k

    if isinstance(sh, str):
        k = _var_id_to_key(base_data, sh)
        if k:
            resolved["surfaceHeightKey"] = k

    if isinstance(sg, str):
        k = _var_id_to_key(base_data, sg)
        if k:
            resolved["surfaceGeopotentialKey"] = k

    params["_resolved"] = resolved

    # derived-data tracking so geometry can map derived -> base (same as wind)
    out = params.get("output") or {}
    if isinstance(out, dict):
        out_data = out.get("data")
        if isinstance(out_data, str) and out_data:
            derived_data_to_step[out_data] = step_id
            derived_data_to_base_data[out_data] = base_data