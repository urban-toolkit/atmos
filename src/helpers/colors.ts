import {
  interpolateRdYlBu,
  interpolateViridis,
  interpolatePlasma,
  interpolateMagma,
  interpolateInferno,
  interpolateBlues,
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

export function convertPaint(paint: Record<string, any> | undefined) {
  if (!paint || typeof paint !== "object") return paint
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(paint)) out[k] = toMapLibreColorExpr(v)
  return out
}

export function schemeToInterpolator(name: string) {
  switch (name) {
    case "RdYlBu": return interpolateRdYlBu
    case "Viridis": return interpolateViridis
    case "Plasma": return interpolatePlasma
    case "Magma": return interpolateMagma
    case "Inferno": return interpolateInferno
    case "Blues": return interpolateBlues
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