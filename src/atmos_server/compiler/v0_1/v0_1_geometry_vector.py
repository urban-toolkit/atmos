



def v0_1_geometry_vector(geom, derived_data_to_base_data, data_by_id, geom_params):
    inp = geom.get("input") or {}
    if not isinstance(inp, dict):
        raise ValueError("vector geometry requires input object")

    input_data = inp.get("data")
    input_var = inp.get("variable")
    if not isinstance(input_data, str) or not isinstance(input_var, str):
        raise ValueError("vector geometry requires input.data and input.variable")

    base_data = input_data
    if input_data in derived_data_to_base_data:
        base_data = derived_data_to_base_data[input_data]

    base = data_by_id.get(base_data) or {}
    dims = base.get("dimensions") or {}
    lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
    lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

    if not isinstance(lat_key, str) or not isinstance(lon_key, str):
        raise ValueError(f"vector geometry could not resolve lat/lon keys for base data '{base_data}'")

    resolved = dict(geom.get("_resolved") or {})
    resolved["latKey"] = lat_key
    resolved["lonKey"] = lon_key

    # convention we used in step_transform: f"{var_id}.speed"/".direction"
    resolved["speedKey"] = f"{input_var}.speed"
    resolved["directionKey"] = f"{input_var}.direction"
    resolved["variableId"] = input_var

    geom_params["_resolved"] = resolved