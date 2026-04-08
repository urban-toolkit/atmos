import {
  interpolateYlGnBu,
  interpolateRdYlBu,
  interpolateViridis,
  interpolatePlasma,
  interpolateMagma,
  interpolateInferno,
  interpolateBlues,
  interpolateGreens,
  interpolateCividis,
  interpolateTurbo,
  interpolateWarm,
  interpolateCool,
  interpolateCubehelixDefault,
} from "d3-scale-chromatic"
import { rgb } from "d3-color"

type ColorSchemeSpec = {
  kind: "color-scheme"
  field: string
  scheme: string
  type?: "sequential" | "diverging" | string
  domain?: [number, number]
  reverse?: boolean
  clamp?: boolean
  nodataColor?: string
  steps?: number
}

function clampExpr(x: any, d0: number, d1: number, lo: any, hi: any) {
  return [
    "case",
    ["<=", x, d0], lo,
    [">=", x, d1], hi,
    null,
  ]
}

function colorSchemeToExpr(spec: ColorSchemeSpec): any {
  const field = spec.field
  const nodata = spec.nodataColor ?? "rgba(0,0,0,0)"

  if (!field) return nodata

  const domain = Array.isArray(spec.domain) && spec.domain.length === 2
    ? [Number(spec.domain[0]), Number(spec.domain[1])] as [number, number]
    : null

  if (!domain || !Number.isFinite(domain[0]) || !Number.isFinite(domain[1])) {
    return nodata
  }

  const [d0, d1] = domain
  const steps = typeof spec.steps === "number" && spec.steps >= 2 ? Math.floor(spec.steps) : 9

  let colors = schemeToColors(spec.scheme ?? "RdYlBu", steps)
  if (spec.reverse) colors = [...colors].reverse()

  const x = ["to-number", ["get", field]]

  const interp: any[] = ["interpolate", ["linear"], x]
  for (let i = 0; i < colors.length; i++) {
    const t = colors.length === 1 ? 0.5 : i / (colors.length - 1)
    const v = d0 + t * (d1 - d0)
    interp.push(v, colors[i])
  }

  let expr: any = interp

  if (spec.clamp) {
    const lo = colors[0]
    const hi = colors[colors.length - 1]
    const clamped = clampExpr(x, d0, d1, lo, hi)
    clamped[7] = interp
    expr = clamped
  }

  return [
    "case",
    ["any", ["==", ["get", field], null], ["!", ["has", field]]],
    nodata,
    expr,
  ]
}

function toMapLibreColorExpr(spec: any): any {
  if (!spec || typeof spec !== "object") return spec

  if (spec.kind === "color-stops") {
    const field = spec.field
    const stops = Array.isArray(spec.stops) ? spec.stops : []
    if (!field || stops.length === 0) return spec

    const interp: any[] = ["interpolate", ["linear"], ["to-number", ["get", field]]]
    for (const s of stops) {
      if (typeof s?.value === "number" && typeof s?.color === "string") {
        interp.push(s.value, s.color)
      }
    }

    if (spec.nodataColor) {
      return [
        "case",
        ["any", ["==", ["get", field], null], ["!", ["has", field]]],
        spec.nodataColor,
        interp,
      ]
    }
    return interp
  }

  if (spec.kind === "color-scheme") {
    return colorSchemeToExpr(spec as ColorSchemeSpec)
  }

  return spec
}

export function convertPaint(
  paint: Record<string, any> | undefined,
  layerType?: "circle" | "line" | "fill"
) {
  if (!paint || typeof paint !== "object") return paint

  const out: Record<string, any> = {}

  for (const [k, v] of Object.entries(paint)) {
    const val = toMapLibreColorExpr(v)

    if (k === "stroke") {
      if (layerType === "circle") {
        out["circle-stroke-color"] = val
        out["circle-stroke-width"] = 1.5
      } else if (layerType === "line") {
        out["line-color"] = val
      } else if (layerType === "fill") {
        out["fill-outline-color"] = val
      }
      continue
    }

    if (k === "strokeWidth") {
      if (layerType === "circle") {
        out["circle-stroke-width"] = val
      } else if (layerType === "line") {
        out["line-width"] = val
      }
      continue
    }

    out[k] = val
  }

  return out
}

export function schemeToInterpolator(name: string) {
  switch (name) {
    case "YlGnBu": return interpolateYlGnBu
    case "RdYlBu": return interpolateRdYlBu
    case "Viridis": return interpolateViridis
    case "Plasma": return interpolatePlasma
    case "Magma": return interpolateMagma
    case "Inferno": return interpolateInferno
    case "Blues": return interpolateBlues
    case "Greens": return interpolateGreens
    case "Cividis": return interpolateCividis
    case "Turbo": return interpolateTurbo
    case "Warm": return interpolateWarm
    case "Cool": return interpolateCool
    case "Cubehelix": return interpolateCubehelixDefault
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

export function getGradientFromScheme(
  scheme?: string,
  options?: {
    steps?: number
    direction?: "to right" | "to left" | "to top" | "to bottom"
    reverse?: boolean
    fallback?: string
  }
) {
  const {
    steps = 7,
    direction = "to right",
    reverse = false,
    fallback = "linear-gradient(to right, #ccc, #333)",
  } = options ?? {}

  if (!scheme) return fallback

  let colors = schemeToColors(scheme, steps)
  if (reverse) colors = [...colors].reverse()

  return `linear-gradient(${direction}, ${colors.join(", ")})`
}

export function getGradientFromPaintSpec(
  paintSpec: any,
  options?: {
    steps?: number
    direction?: "to right" | "to left" | "to top" | "to bottom"
    fallback?: string
  }
) {
  if (!paintSpec || typeof paintSpec !== "object") {
    return options?.fallback ?? "linear-gradient(to right, #ccc, #333)"
  }

  if (paintSpec.kind === "color-scheme") {
    return getGradientFromScheme(paintSpec.scheme, {
      steps: paintSpec.steps ?? options?.steps ?? 7,
      direction: options?.direction ?? "to right",
      reverse: paintSpec.reverse === true,
      fallback: options?.fallback,
    })
  }

  if (paintSpec.kind === "color-stops" && Array.isArray(paintSpec.stops) && paintSpec.stops.length > 0) {
    const colors = paintSpec.stops
      .filter((s: any) => typeof s?.color === "string")
      .map((s: any) => s.color)

    if (colors.length > 0) {
      return `linear-gradient(${options?.direction ?? "to right"}, ${colors.join(", ")})`
    }
  }

  return options?.fallback ?? "linear-gradient(to right, #ccc, #333)"
}

export function evaluateColorSpec(
  spec: any,
  value: number | null | undefined
): string | null {
  if (!spec || typeof spec !== "object") return null

  if (value == null || !Number.isFinite(value)) {
    return spec.nodataColor ?? null
  }

  if (spec.kind === "color-stops") {
    const stops = Array.isArray(spec.stops) ? spec.stops : []
    if (!stops.length) return spec.nodataColor ?? null

    const validStops = stops
      .filter((s: any) => typeof s?.value === "number" && typeof s?.color === "string")
      .sort((a: any, b: any) => a.value - b.value)

    if (!validStops.length) return spec.nodataColor ?? null

    if (value <= validStops[0].value) {
      return spec.clamp ? validStops[0].color : validStops[0].color
    }
    if (value >= validStops[validStops.length - 1].value) {
      return spec.clamp ? validStops[validStops.length - 1].color : validStops[validStops.length - 1].color
    }

    for (let i = 0; i < validStops.length - 1; i++) {
      const a = validStops[i]
      const b = validStops[i + 1]
      if (value >= a.value && value <= b.value) {
        const mid = (a.value + b.value) / 2
        return value <= mid ? a.color : b.color
      }
    }

    return validStops[validStops.length - 1].color
  }

  if (spec.kind === "color-scheme") {
    const domain = Array.isArray(spec.domain) && spec.domain.length === 2
      ? [Number(spec.domain[0]), Number(spec.domain[1])] as [number, number]
      : null

    if (!domain || !Number.isFinite(domain[0]) || !Number.isFinite(domain[1])) {
      return spec.nodataColor ?? null
    }

    const [d0, d1] = domain
    if (d0 === d1) {
      const colors = schemeToColors(spec.scheme ?? "RdYlBu", spec.steps ?? 9)
      return spec.reverse ? colors[colors.length - 1] : colors[0]
    }

    let t = (value - d0) / (d1 - d0)

    if (spec.clamp) {
      t = Math.max(0, Math.min(1, t))
    }

    if (!spec.clamp && (t < 0 || t > 1)) {
      return spec.nodataColor ?? null
    }

    const steps = typeof spec.steps === "number" && spec.steps >= 2
      ? Math.floor(spec.steps)
      : 9

    let colors = schemeToColors(spec.scheme ?? "RdYlBu", steps)
    if (spec.reverse) colors = [...colors].reverse()

    const idx = Math.max(0, Math.min(colors.length - 1, Math.round(t * (colors.length - 1))))
    return colors[idx]
  }

  return null
}

export function evaluatePaintColor(
  paintValue: any,
  props: Record<string, any>
): string | null {
  if (typeof paintValue === "string") return paintValue
  if (!paintValue || typeof paintValue !== "object") return null

  if ((paintValue.kind === "color-scheme" || paintValue.kind === "color-stops") && typeof paintValue.field === "string") {
    const raw = props?.[paintValue.field]
    const value = typeof raw === "number" ? raw : Number(raw)
    return evaluateColorSpec(paintValue, Number.isFinite(value) ? value : null)
  }

  return null
}