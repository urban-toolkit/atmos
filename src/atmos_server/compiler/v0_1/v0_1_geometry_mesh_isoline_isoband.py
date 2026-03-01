
def v0_1_geometry_mesh_isoline_isoband(ginput, data_by_id, derived_data_to_base_data, derived_data_to_step, geom_params):
    input_data = ginput.get("data")
    input_var = ginput.get("variable")

    base_data: str | None = None
    if isinstance(input_data, str):
        if input_data in data_by_id:
            base_data = input_data
        elif input_data in derived_data_to_base_data:
            base_data = derived_data_to_base_data[input_data]

    lat_key = None
    lon_key = None
    var_key = None

    if base_data is not None:
        d = data_by_id[base_data]
        dims = d.get("dimensions") or {}
        lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
        lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None

        # For derived datasets, the xarray variable name should be the derived variable id itself
        if isinstance(input_data, str) and input_data in derived_data_to_step:
            if isinstance(input_var, str):
                var_key = input_var
        else:
            vars_ = d.get("variables") or []
            if isinstance(input_var, str) and isinstance(vars_, list):
                for vv in vars_:
                    if isinstance(vv, dict) and vv.get("id") == input_var:
                        var_key = vv.get("key")
                        break

    geom_params["_resolved"] = {
        "dataId": input_data,
        "variableId": input_var,
        "variableKey": var_key,
        "latKey": lat_key,
        "lonKey": lon_key,
        "baseDataId": base_data,
    }