from __future__ import annotations

def v0_1_transform_derive_wind_vector(params, step_id, derived_data_to_step, derived_data_to_base_data, _var_id_to_key):
    tin = params.get("input") or {}
    if not isinstance(tin, dict):
        raise ValueError("derive_wind_vector requires input object")

    base_data = tin.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("derive_wind_vector requires input.data")

    vars_map = tin.get("variables") or {}
    if not isinstance(vars_map, dict):
        raise ValueError("derive_wind_vector requires input.variables object")

    u_id = vars_map.get("u")
    v_id = vars_map.get("v")
    if not isinstance(u_id, str) or not isinstance(v_id, str):
        raise ValueError("derive_wind_vector requires input.variables.u and .v (ids)")

    u_key = _var_id_to_key(base_data, u_id)
    v_key = _var_id_to_key(base_data, v_id)
    if not u_key or not v_key:
        raise ValueError(f"derive_wind_vector could not resolve keys for u='{u_id}' v='{v_id}'")

    resolved = dict(params.get("_resolved") or {})
    resolved["uKey"] = u_key
    resolved["vKey"] = v_key
    params["_resolved"] = resolved

    # derived-data tracking (so geometry can find base lat/lon keys later)
    out = params.get("output") or {}
    if isinstance(out, dict):
        out_data = out.get("data")
        if isinstance(out_data, str) and out_data:
            derived_data_to_step[out_data] = step_id
            derived_data_to_base_data[out_data] = base_data