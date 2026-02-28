export type TimeBinding =
  | { scope: "view"; viewIndex: number; value: number }
  | { scope: "composition"; value: number }

export function getTimeBinding(specObj: any): TimeBinding | null {
  const comp = specObj?.composition
  const views = comp?.views ?? []

  for (let i = 0; i < views.length; i++) {
    const t = views[i]?.time
    if (t?.type === "index" && typeof t.value === "number") {
      return { scope: "view", viewIndex: i, value: t.value }
    }
  }

  const ct = comp?.time
  if (ct?.type === "index" && typeof ct.value === "number") {
    return { scope: "composition", value: ct.value }
  }

  return null
}

export function setTimeBinding(specObj: any, nextValue: number): any {
  const next = structuredClone(specObj)
  const binding = getTimeBinding(next)
  if (!binding) return next

  if (binding.scope === "view") {
    next.composition.views[binding.viewIndex].time.value = nextValue
  } else {
    next.composition.time.value = nextValue
  }
  return next
}