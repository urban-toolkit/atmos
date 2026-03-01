from __future__ import annotations
from atmos_server.compiler.types import ( InputRef, Step )


def v0_1_load(spec_data, data_id_to_upstream_step, data_by_id, steps, _safe_id, inputs):
    data_items = spec_data or []

    for i, d in enumerate(data_items):
        if not isinstance(d, dict):
            continue
        data_id = _safe_id("data_", d.get("id"), i)
        inputs.append(InputRef(data_id=data_id))
        data_by_id[data_id] = d

        step_id = f"load:{data_id}"
        data_id_to_upstream_step[data_id] = step_id

        kind = d.get("kind")

        params = {
            "dataId": data_id,
            "kind": kind,
            "dimensions": d.get("dimensions"),
            "variables": d.get("variables"),
        }

        if kind == "collection":
            params["members"] = d.get("members")
            params["sourceTemplate"] = d.get("sourceTemplate")
            params["memberDimension"] = d.get("memberDimension", "member")
        else:
            params["source"] = d.get("source")

        steps.append(
            Step(
                id=step_id,
                kind="load",
                depends_on=(),
                params=params,
            )
        )

  

