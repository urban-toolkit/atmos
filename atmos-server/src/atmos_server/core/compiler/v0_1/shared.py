from atmos_server.core.compiler.v0_1.context import CompileContext


def resolve_base_data_id(ctx: CompileContext, data_id: str) -> str:
    current = data_id
    seen: set[str] = set()

    while current in ctx.derived_data_to_base_data:
        if current in seen:
            break
        seen.add(current)
        nxt = ctx.derived_data_to_base_data[current]
        if not isinstance(nxt, str) or not nxt:
            break
        current = nxt

    return current