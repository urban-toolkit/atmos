import { interpolateRdYlBu, interpolateViridis, interpolatePlasma, interpolateMagma, interpolateInferno } from "d3-scale-chromatic"
// import { rgb } from "d3-interpolate"
import { rgb } from "d3-color"

export function schemeToInterpolator(name: string) {
  switch (name) {
    case "RdYlBu": return interpolateRdYlBu
    case "Viridis": return interpolateViridis
    case "Plasma": return interpolatePlasma
    case "Magma": return interpolateMagma
    case "Inferno": return interpolateInferno
    default: return interpolateRdYlBu
  }
}

export function schemeToColors(scheme: string, steps: number) {
  const interp = schemeToInterpolator(scheme)
  if (steps <= 1) return [rgb(interp(0.5)).formatHex()]
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    return rgb(interp(t)).formatHex()
  })
}

type ColorStops = {
  kind: "color-stops"
  field: string
  type?: "linear" | string
  stops: Array<{ value: number; color: string }>
  clamp?: boolean
  nodataColor?: string
}

export function toMaplibreFillColor(x: any): any {
  // already a constant color string
  if (typeof x === "string") return x

  if (!x || typeof x !== "object") return undefined
  if (x.kind !== "color-stops") return undefined

  const cs = x as ColorStops
  const field = cs.field
  const nodata = cs.nodataColor ?? "rgba(0,0,0,0)"

  const interp: any[] = ["interpolate", ["linear"], ["get", field]]
  for (const s of cs.stops ?? []) {
    interp.push(s.value, s.color)
  }

  // If stops are missing/invalid, fall back to nodata color
  if (interp.length <= 3) return nodata

  return [
    "case",
    ["any", ["==", ["get", field], null], ["!", ["has", field]]],
    nodata,
    interp,
  ]
}

export function toFillColorExpression(fillColor: any) {
  if (typeof fillColor === "string") return fillColor
  if (!fillColor || typeof fillColor !== "object") return fillColor

  if (fillColor.kind === "color-stops") {
    const field = fillColor.field
    const nodata = fillColor.nodataColor ?? "rgba(0,0,0,0)"

    const interp: any[] = ["interpolate", ["linear"], ["get", field]]
    const stops = Array.isArray(fillColor.stops) ? fillColor.stops : []
    for (const s of stops) {
      if (s && typeof s.value === "number" && typeof s.color === "string") {
        interp.push(s.value, s.color)
      }
    }

    // If we don't have enough pieces to interpolate, fall back safely
    if (interp.length <= 3) return nodata

    return [
      "case",
      ["any", ["==", ["get", field], null], ["!", ["has", field]]],
      nodata,
      interp,
    ]
  }

  return fillColor
}

export function convertPaint(paint: any) {
  if (!paint || typeof paint !== "object") return paint
  const out: any = { ...paint }

  if ("fill-color" in out) out["fill-color"] = toFillColorExpression(out["fill-color"])
  return out
}