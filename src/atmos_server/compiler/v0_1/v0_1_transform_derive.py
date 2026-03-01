from __future__ import annotations

def v0_1_transform_derive(params, step_id, derived_data_to_step, derived_data_to_base_data, _var_id_to_key):
    tin = params.get("input") or {}
    if not isinstance(tin, dict):
        raise ValueError("derive requires input object")
    base_data = tin.get("data")
    if not isinstance(base_data, str) or not base_data:
        raise ValueError("derive requires input.data")
    
    base_data_id: str = base_data

    expr = params.get("expression") or {}
    if isinstance(expr, dict):
        def _walk(node):
            if not isinstance(node, dict):
                return
            if "variable" in node and isinstance(node["variable"], str):
                var_id = node["variable"]

                k = _var_id_to_key(base_data_id, var_id)
                if k:
                    resolved = dict(params.get("_resolved") or {})
                    var_map = dict(resolved.get("varKeyById") or {})
                    var_map[var_id] = k
                    resolved["varKeyById"] = var_map
                    params["_resolved"] = resolved
            args = node.get("args")
            if isinstance(args, list):
                for a in args:
                    _walk(a)

        _walk(expr)

    # track derived output so geometry can route upstream correctly
    out = params.get("output") or {}
    if isinstance(out, dict):
        out_data = out.get("data")
        if isinstance(out_data, str) and out_data:
            derived_data_to_step[out_data] = step_id
            derived_data_to_base_data[out_data] = base_data