
def v0_1_geometry_point(ginput, data_by_id, geom_params):
    input_data = ginput.get("data")
    input_var  = ginput.get("variable")

    if isinstance(input_data, str) and input_data in data_by_id:
        d = data_by_id[input_data]

        dims = d.get("dimensions") or {}
        lat_key = (dims.get("latitude") or {}).get("key") if isinstance(dims.get("latitude"), dict) else None
        lon_key = (dims.get("longitude") or {}).get("key") if isinstance(dims.get("longitude"), dict) else None
        site_key = (dims.get("site") or {}).get("key") if isinstance(dims.get("site"), dict) else None
        time_key = (dims.get("time") or {}).get("key") if isinstance(dims.get("time"), dict) else None

        var_key = None
        vars_ = d.get("variables") or []
        if isinstance(input_var, str) and isinstance(vars_, list):
            for vv in vars_:
                if isinstance(vv, dict) and vv.get("id") == input_var:
                    k = vv.get("key")
                    if isinstance(k, str) and k.strip():
                        var_key = k.strip()
                    break

        geom_params["_resolved"] = {
            "dataId": input_data,
            "variableId": input_var,
            "variableKey": var_key,
            "latKey": lat_key,
            "lonKey": lon_key,
            "siteKey": site_key,
            "timeKey": time_key,
            "baseDataId": input_data,
        }