import { useEffect, useMemo, useRef, useState } from "react"
import maplibregl, { Map } from "maplibre-gl"
// import { convertPaint } from "../../helpers/colors"
import { convertPaint } from "../../helpers/colors"
import earcut from "earcut"
import { interpolateViridis } from "d3-scale-chromatic"
import bboxClip from "@turf/bbox-clip"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import bboxPolygon from "@turf/bbox-polygon"

type GeoJSONFeatureCollection = GeoJSON.FeatureCollection

type MapLayerRole = "field" | "boundary" | "unknown"
type MapLibreLayerType = "fill" | "line" | "circle" | "symbol"

type MapLibreRenderSpec =
  | {
      renderer: "maplibre"
      layers: Array<{
        id?: string
        type: MapLibreLayerType
        paint?: Record<string, any>
        layout?: Record<string, any>
        filter?: any[]
        minzoom?: number
        maxzoom?: number
        "source-layer"?: string
        beforeId?: string
      }>
    }
  | {
      renderer: "maplibre"
      layerType: "fill" | "line" | "circle"
      paint?: Record<string, any>
      layout?: Record<string, any>
    }

type RenderSpec = MapLibreRenderSpec | undefined

type MapOp =
  | { kind: "source"; id: string; data: GeoJSONFeatureCollection }
  | { kind: "layer"; id: string; def: any; beforeId?: string; atmosLayerId?: string }
  | {
      kind: "custom-mask"
      id: string
      targetSourceId: string
      bounds: { west: number; south: number; east: number; north: number }
      atmosLayerId: string
      interactive?: { on?: string[] }
      beforeId?: string
    }
  | {
      kind: "masked-layer-group"
      atmosLayerId: string
      sourceId: string
      data: GeoJSONFeatureCollection
      bounds: { west: number; south: number; east: number; north: number }
      layers: Array<{ id: string; def: any; beforeId?: string }>
      beforeId?: string
    }

type MaskBounds = { west: number; south: number; east: number; north: number }

type DragMode =
  | { type: "move"; layerId: string; startLngLat: maplibregl.LngLat; startBounds: MaskBounds }
  | { type: "resize"; layerId: string; handle: "sw" | "se" | "ne" | "nw"; startLngLat: maplibregl.LngLat; startBounds: MaskBounds }
  | null

function buildMaskedMapLibreLayers(
  atmosLayer: AtmosMapLayer,
  maskedSource: string
): Array<{ id: string; def: any; beforeId?: string }> {
  const render = atmosLayer.render
  if (!render || render.renderer !== "maplibre") return []

  const layers =
    "layers" in render
      ? render.layers
      : [{ id: "main", type: render.layerType, paint: render.paint, layout: render.layout }]

  return layers.map((l, i) => {
    const id = lyrId(atmosLayer.layerId, `masked:${l.id ?? String(i)}`)
    const def: any = { id, type: l.type, source: maskedSource }

    if (l.paint) def.paint = convertPaint(resolvePaintWithData(l.paint, atmosLayer.geojson))
    if (l.layout) def.layout = l.layout
    if (l.filter) def.filter = l.filter
    if (typeof l.minzoom === "number") def.minzoom = l.minzoom
    if (typeof l.maxzoom === "number") def.maxzoom = l.maxzoom
    if (l["source-layer"]) def["source-layer"] = l["source-layer"]

    return {
      id,
      def,
      beforeId: (l as any).beforeId,
    }
  })
}

function clipFeatureCollectionToBounds(
  fc: GeoJSONFeatureCollection,
  bounds: { west: number; south: number; east: number; north: number }
): GeoJSONFeatureCollection {
  const bbox: [number, number, number, number] = [
    bounds.west,
    bounds.south,
    bounds.east,
    bounds.north,
  ]

  const bboxPoly = bboxPolygon(bbox)

  const out: GeoJSON.Feature[] = []

  for (const f of fc.features ?? []) {
    if (!f.geometry) continue

    const g = f.geometry

    try {
      if (g.type === "Point") {
        if (booleanPointInPolygon(f as any, bboxPoly)) out.push(f)
        continue
      }

      if (g.type === "MultiPoint") {
        const kept = g.coordinates.filter((c) =>
          booleanPointInPolygon(
            { type: "Feature", geometry: { type: "Point", coordinates: c }, properties: {} } as any,
            bboxPoly
          )
        )
        if (kept.length) {
          out.push({
            ...f,
            geometry: { type: "MultiPoint", coordinates: kept },
          } as GeoJSON.Feature)
        }
        continue
      }

      if (
        g.type === "LineString" ||
        g.type === "MultiLineString" ||
        g.type === "Polygon" ||
        g.type === "MultiPolygon"
      ) {
        const clipped = bboxClip(f as any, bbox)
        if (clipped?.geometry) out.push(clipped as GeoJSON.Feature)
        continue
      }

      out.push(f)
    } catch {
      // fail soft: skip invalid feature
    }
  }

  return {
    type: "FeatureCollection",
    features: out,
  }
}

function normalizeBounds(b: MaskBounds): MaskBounds {
  return {
    west: Math.min(b.west, b.east),
    east: Math.max(b.west, b.east),
    south: Math.min(b.south, b.north),
    north: Math.max(b.south, b.north),
  }
}

function translateBounds(start: MaskBounds, dLng: number, dLat: number): MaskBounds {
  return {
    west: start.west + dLng,
    east: start.east + dLng,
    south: start.south + dLat,
    north: start.north + dLat,
  }
}

function resizeBounds(
  start: MaskBounds,
  handle: "sw" | "se" | "ne" | "nw",
  lng: number,
  lat: number
): MaskBounds {
  const next = { ...start }

  if (handle.includes("w")) next.west = lng
  if (handle.includes("e")) next.east = lng
  if (handle.includes("s")) next.south = lat
  if (handle.includes("n")) next.north = lat

  return normalizeBounds(next)
}

function pointInBounds(lng: number, lat: number, b: MaskBounds) {
  return lng >= b.west && lng <= b.east && lat >= b.south && lat <= b.north
}

function boundsKey(layerId: string) {
  return `mask:${layerId}`
}

function cloneBounds(b: MaskBounds): MaskBounds {
  return { west: b.west, south: b.south, east: b.east, north: b.north }
}

export type AtmosMapLayer = {
  layerId: string
  role: MapLayerRole
  geojson: GeoJSONFeatureCollection
  render?: RenderSpec
  geometryType?: string
  // glyph?: "arrow" | "barb"
  glyph?: any
  mask?: any
}

const vertexShaderSrc = `
  attribute vec2 a_pos;
  attribute vec2 a_lonlat;
  attribute vec4 a_color;

  uniform mat4 u_matrix;

  varying vec2 v_lonlat;
  varying vec4 v_color;

  void main() {
    v_lonlat = a_lonlat;
    v_color = a_color;
    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
  }
  `

const fragmentShaderSrc = `
  precision mediump float;

  uniform vec4 u_bounds; // west, south, east, north

  varying vec2 v_lonlat;
  varying vec4 v_color;

  void main() {
    float lon = v_lonlat.x;
    float lat = v_lonlat.y;

    if (lon < u_bounds.x || lon > u_bounds.z ||
        lat < u_bounds.y || lat > u_bounds.w) {
      discard;
    }

    gl_FragColor = v_color;
  }
  `

export type AtmosMapProps = {
  layers: AtmosMapLayer[]
  autoFitBounds?: boolean
  mapStyle?: string | any
  initialViewState?: ViewState
  onViewStateChange?: (vs: ViewState) => void
  onFeatureClick?: (info: {
    layerId: string
    viewId?: string
    feature: GeoJSON.Feature
    properties: Record<string, any>
  }) => void
}

export type ViewState = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}

function hexToRgba01(hex: string, alpha = 1): [number, number, number, number] {
  const clean = hex.replace("#", "")
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean

  const n = parseInt(full, 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  return [r, g, b, alpha]
}

function cssColorToRgba01(color: string, alpha = 1): [number, number, number, number] {
  if (color.startsWith("#")) return hexToRgba01(color, alpha)

  // very small fallback for now
  if (color === "transparent") return [0, 0, 0, 0]

  // fallback to red if parser is not implemented
  return [1, 0, 0, alpha]
}

function resolveMaskedFeatureColor(
  props: Record<string, any>,
  render?: RenderSpec
): [number, number, number, number] {
  if (!render || render.renderer !== "maplibre") {
    return [1, 0, 0, 0.9]
  }

  const paint =
    "layers" in render
      ? (render.layers?.[0]?.paint ?? {})
      : (render.paint ?? {})

  const opacity =
    typeof paint["fill-opacity"] === "number" ? paint["fill-opacity"] : 0.9

  const fillColor = paint["fill-color"]

  if (typeof fillColor === "string") {
    return cssColorToRgba01(fillColor, opacity)
  }

  if (
    fillColor &&
    typeof fillColor === "object" &&
    fillColor.kind === "color-scheme" &&
    typeof fillColor.field === "string"
  ) {
    const field = fillColor.field
    const v = Number(props[field])
    const domain = Array.isArray(fillColor.domain) ? fillColor.domain : [0, 1]
    const d0 = Number(domain[0])
    const d1 = Number(domain[1])

    if (Number.isFinite(v) && Number.isFinite(d0) && Number.isFinite(d1) && d1 !== d0) {
      const t = clamp01((v - d0) / (d1 - d0))

      if (fillColor.scheme === "Viridis") {
        return cssColorToRgba01(interpolateViridis(t), opacity)
      }
    }
  }

  return [1, 0, 0, opacity]
}

function triangulateIsobands(fc: GeoJSONFeatureCollection, render?: RenderSpec) {
  const positions: number[] = []
  const lonlats: number[] = []
  const colors: number[] = []

  function pushPolygon(rings: number[][][], f: GeoJSON.Feature) {
    if (!Array.isArray(rings) || !rings.length) return

    const outer = rings[0]
    if (!Array.isArray(outer) || outer.length < 3) return

    const flatLonLat: number[] = []
    for (const c of outer) {
      flatLonLat.push(c[0], c[1])
    }

    const triangles = earcut(flatLonLat)
    if (!triangles.length) return

    const props = (f.properties ?? {}) as Record<string, any>
    const color = resolveMaskedFeatureColor(props, render)

    for (let i = 0; i < triangles.length; i++) {
      const idx = triangles[i] * 2
      const lon = flatLonLat[idx]
      const lat = flatLonLat[idx + 1]

      const merc = maplibregl.MercatorCoordinate.fromLngLat([lon, lat])

      positions.push(merc.x, merc.y)
      lonlats.push(lon, lat)
      colors.push(...color)
    }
  }

  for (const f of fc.features ?? []) {
    const geom = f.geometry
    if (!geom) continue

    if (geom.type === "Polygon") {
      pushPolygon(geom.coordinates, f)
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) {
        pushPolygon(poly, f)
      }
    }
  }

  return {
    positions,
    lonlats,
    colors,
    vertexCount: positions.length / 2,
  }
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSrc: string,
  fragmentSrc: string
) {
  const vs = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vs, vertexSrc)
  gl.compileShader(vs)

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fs, fragmentSrc)
  gl.compileShader(fs)

  const program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  return program
}

function toKnots(speed: number, units: "m/s" | "kt" | "mph" = "m/s"): number {
  if (!Number.isFinite(speed)) return 0
  if (units === "kt") return speed
  if (units === "mph") return speed * 0.868976
  return speed * 1.94384 // m/s -> kt
}

function barbBucket(speed: number): number {
  const kt = toKnots(speed, "m/s")
  if (kt < 2.5) return 0
  return Math.round(kt / 5) * 5
}

function ensureBarbIcon(map: maplibregl.Map, bucket: number) {
  const name = `atmos-barb-${bucket}`
  if (map.hasImage(name)) return

  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, size, size)
  ctx.strokeStyle = "#000"
  ctx.fillStyle = "#000"
  ctx.lineWidth = 3
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  const cx = size / 2
  const cy = size / 2

  // Draw upright barb; MapLibre rotates it later
  const shaftTopY = 10
  const shaftBottomY = 50

  // shaft
  ctx.beginPath()
  ctx.moveTo(cx, shaftBottomY)
  ctx.lineTo(cx, shaftTopY)
  ctx.stroke()

  let remaining = bucket
  let y = shaftTopY + 2
  const spacing = 8

  // 50-unit flags
  while (remaining >= 50) {
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.lineTo(cx + 16, y + 6)
    ctx.lineTo(cx, y + 12)
    ctx.closePath()
    ctx.fill()
    remaining -= 50
    y += spacing + 4
  }

  // 10-unit full barbs
  while (remaining >= 10) {
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.lineTo(cx + 16, y + 6)
    ctx.stroke()
    remaining -= 10
    y += spacing
  }

  // 5-unit half barb
  if (remaining >= 5) {
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.lineTo(cx + 10, y + 4)
    ctx.stroke()
  }

  const imageData = ctx.getImageData(0, 0, size, size)
  map.addImage(name, imageData, { pixelRatio: 2, sdf: true })
}

function buildBarbIconGeoJSON(fc: GeoJSONFeatureCollection): GeoJSONFeatureCollection {
  const features: GeoJSON.Feature[] = []

  for (const f of fc.features ?? []) {
    if (!f || f.geometry?.type !== "Point") continue

    const props: any = { ...(f.properties ?? {}) }
    const speed = Number(props["wind10.speed"])
    const dir = Number(props["wind10.direction"])

    if (!Number.isFinite(speed) || !Number.isFinite(dir)) continue

    const bucket = barbBucket(speed)
    props.__barbIcon = `atmos-barb-${bucket}`

    features.push({
      type: "Feature",
      geometry: f.geometry,
      properties: props,
    })
  }

  return {
    type: "FeatureCollection",
    features,
  }
}

function buildBarbLayers(atmosLayer: AtmosMapLayer) {
  const source = derivedSrcId(atmosLayer.layerId, "barb-icons")
  const data = buildBarbIconGeoJSON(atmosLayer.geojson)
  const id = lyrId(atmosLayer.layerId, "barb")

  const resolvedPaint = resolvePaintWithData(getLegacyPaint(atmosLayer.render), atmosLayer.geojson) ?? {}
  const iconColor =
    typeof resolvedPaint["circle-color"] === "string" ? resolvedPaint["circle-color"] : "#2c7bb6"

  return {
    extraSources: [{ source, data }],
    layers: [
      {
        id,
        def: {
          id,
          type: "symbol",
          source,
          layout: {
            "icon-image": ["get", "__barbIcon"],
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-anchor": "center",
            "icon-rotation-alignment": "map",
            "icon-rotate": ["to-number", ["get", "wind10.direction"]],
            "icon-size": 0.8,
          },
          paint: {
            "icon-opacity": 0.9,
            "icon-color": iconColor,
          },
        },
      },
    ],
  }
}

function ensureArrowIcon(map: maplibregl.Map) {
  const name = "atmos-arrow"
  if (map.hasImage(name)) return

  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = "#000"
  ctx.translate(size / 2, size / 2)

  ctx.beginPath()
  ctx.rect(-3, -18, 6, 26)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, -30)
  ctx.lineTo(14, -10)
  ctx.lineTo(-14, -10)
  ctx.closePath()
  ctx.fill()

  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const imageData = ctx.getImageData(0, 0, size, size)
  map.addImage(name, imageData, { pixelRatio: 2, sdf: true })
}

function getPropNumber(props: any, key: string): number | null {
  if (!props) return null
  const v = props[key]
  if (typeof v === "number") return Number.isFinite(v) ? v : null
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function extentForField(fc: any, field: string): [number, number] | null {
  if (!fc || fc.type !== "FeatureCollection" || !Array.isArray(fc.features)) return null

  let min = Infinity
  let max = -Infinity

  for (const f of fc.features) {
    const n = getPropNumber(f?.properties, field)
    if (n == null) continue
    if (n < min) min = n
    if (n > max) max = n
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) return null
  return [min, max]
}

function resolveNumberScaleToExpression(scaleObj: any, fc: any) {
  const field = scaleObj?.field
  const scale = scaleObj?.scale
  const range = scale?.range?.values

  if (typeof field !== "string") return null
  if (!Array.isArray(range) || range.length !== 2) return null

  const r0 = Number(range[0])
  const r1 = Number(range[1])
  if (!Number.isFinite(r0) || !Number.isFinite(r1)) return null

  if (scale?.domain?.type !== "extent") return null

  const ext = extentForField(fc, field)
  if (!ext) return null

  const [d0, d1] = ext
  if (d0 === d1) return r0

  return [
    "interpolate",
    ["linear"],
    ["to-number", ["get", field]],
    d0,
    r0,
    d1,
    r1,
  ]
}

function resolvePaintWithData(paint: Record<string, any> | undefined, fc: any) {
  if (!paint) return paint
  const out: Record<string, any> = { ...paint }

  for (const [k, v] of Object.entries(out)) {
    if (v && typeof v === "object" && (v as any).kind === "number-scale") {
      const expr = resolveNumberScaleToExpression(v, fc)
      if (expr != null) out[k] = expr
    }
  }

  return out
}

function srcId(layerId: string) {
  return `src:${layerId}`
}

function derivedSrcId(layerId: string, suffix: string) {
  return `src:${layerId}:${suffix}`
}

function lyrId(layerId: string, local?: string) {
  return local ? `lyr:${layerId}:${local}` : `lyr:${layerId}`
}

function isAtmosSource(id: string) {
  return id.startsWith("src:")
}

function isAtmosLayer(id: string) {
  return id.startsWith("lyr:")
}

type BBox = [number, number, number, number]

function bboxFromFeatureCollection(fc: any): BBox | null {
  if (!fc || fc.type !== "FeatureCollection" || !Array.isArray(fc.features)) return null

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  const push = (x: number, y: number) => {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  const walk = (coords: any) => {
    if (!coords) return
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      push(coords[0], coords[1])
      return
    }
    for (const c of coords) walk(c)
  }

  for (const f of fc.features) {
    const coords = f?.geometry?.coordinates
    if (coords) walk(coords)
  }

  if (!Number.isFinite(minX)) return null
  return [minX, minY, maxX, maxY]
}

function firstNonEmptyBBox(layers: AtmosMapLayer[]): BBox | null {
  for (const l of layers) {
    const bb = bboxFromFeatureCollection(l.geojson)
    if (bb) return bb
  }
  return null
}

function upsertGeoJSONSource(map: Map, id: string, data: GeoJSONFeatureCollection) {
  const existing = map.getSource(id) as any
  if (!existing) {
    map.addSource(id, { type: "geojson", data })
    return
  }
  if (typeof existing.setData === "function") existing.setData(data)
}

function removeLayerIfExists(map: Map, id: string) {
  if (map.getLayer(id)) map.removeLayer(id)
}

function removeSourceIfExists(map: Map, id: string) {
  if (map.getSource(id)) map.removeSource(id)
}

// function upsertLayer(map: Map, layerDef: any, beforeId?: string) {
//   const id = layerDef.id
//   const existing = map.getLayer(id)

//   if (!existing) {
//     const safeBeforeId = beforeId && map.getLayer(beforeId) ? beforeId : undefined
//     map.addLayer(layerDef, safeBeforeId)
//     return
//   }

//   const existingType = (existing as any).type
//   const existingSource = (existing as any).source

//   if (existingType !== layerDef.type || existingSource !== layerDef.source) {
//     map.removeLayer(id)
//     const safeBeforeId = beforeId && map.getLayer(beforeId) ? beforeId : undefined
//     map.addLayer(layerDef, safeBeforeId)
//     return
//   }

//   patchLayer(map, id, layerDef)
// }

function upsertLayer(map: Map, layerDef: any, beforeId?: string) {
  const id = layerDef.id
  const existing = map.getLayer(id)
  const safeBeforeId = beforeId && map.getLayer(beforeId) ? beforeId : undefined

  if (!existing) {
    map.addLayer(layerDef, safeBeforeId)
    return
  }

  const existingType = (existing as any).type
  const existingSource = (existing as any).source

  if (existingType !== layerDef.type || existingSource !== layerDef.source) {
    map.removeLayer(id)
    map.addLayer(layerDef, safeBeforeId)
    return
  }

  patchLayer(map, id, layerDef)

  // IMPORTANT: if the layer already exists, enforce its order too
  if (safeBeforeId) {
    try {
      map.moveLayer(id, safeBeforeId)
    } catch {}
  }
}

function patchLayer(map: Map, id: string, nextDef: any) {
  const paint = nextDef.paint ?? {}
  for (const [k, v] of Object.entries(paint)) {
    try {
      map.setPaintProperty(id, k, v as any)
    } catch {}
  }

  const layout = nextDef.layout ?? {}
  for (const [k, v] of Object.entries(layout)) {
    try {
      map.setLayoutProperty(id, k, v as any)
    } catch {}
  }

  if ("filter" in nextDef) {
    try {
      map.setFilter(id, nextDef.filter)
    } catch {}
  }

  if (typeof nextDef.minzoom === "number" || typeof nextDef.maxzoom === "number") {
    const minz = typeof nextDef.minzoom === "number" ? nextDef.minzoom : 0
    const maxz = typeof nextDef.maxzoom === "number" ? nextDef.maxzoom : 24
    try {
      map.setLayerZoomRange(id, minz, maxz)
    } catch {}
  }
}

function upsertBBoxMaskLayers(
  map: Map,
  layerId: string,
  bounds: { west: number; south: number; east: number; north: number },
  beforeId?: string
) {
  const tuple: [number, number, number, number] = [
    bounds.west,
    bounds.south,
    bounds.east,
    bounds.north,
  ]

  upsertGeoJSONSource(map, maskFillSourceId(layerId), buildMaskFillGeoJSON(tuple))
  upsertGeoJSONSource(map, maskOutlineSourceId(layerId), buildMaskOutlineGeoJSON(tuple))

  // upsertLayer(map, {
  //   id: maskFillLayerId(layerId),
  //   type: "fill",
  //   source: maskFillSourceId(layerId),
  //   paint: {
  //     "fill-color": "#000000",
  //     "fill-opacity": 0.30,
  //   },
  // }, undefined)

  // upsertLayer(map, {
  //   id: maskOutlineLayerId(layerId),
  //   type: "line",
  //   source: maskOutlineSourceId(layerId),
  //   filter: ["==", ["get", "kind"], "outline"],
  //   paint: {
  //     "line-color": "#111111",
  //     "line-width": 2,
  //   },
  // })

  upsertLayer(map, {
    id: maskHandlesLayerId(layerId),
    type: "circle",
    source: maskOutlineSourceId(layerId),
    filter: ["==", ["get", "kind"], "handle"],
    paint: {
      "circle-radius": 5,
      "circle-color": "#ffffff",
      "circle-stroke-color": "#111111",
      "circle-stroke-width": 2,
    },
  }, beforeId)
}

function upsertMaskedIsobandLayer(
  map: Map,
  args: {
    id: string
    layerId: string
    geojson?: GeoJSONFeatureCollection
    bounds: { west: number; south: number; east: number; north: number }
    render?: RenderSpec
    beforeId?: string
  }
) {
  if (!args.geojson) return

  removeLayerIfExists(map, args.id)

  const customLayer = makeMaskedIsobandLayer({
    id: args.id,
    geojson: args.geojson,
    bounds: args.bounds,
    render: args.render,
  })

  // map.addLayer(customLayer as any)
  const safeBeforeId = args.beforeId && map.getLayer(args.beforeId) ? args.beforeId : undefined
    map.addLayer(customLayer as any, safeBeforeId)
  }

function makeMaskedIsobandLayer(args: {
  id: string
  geojson: GeoJSONFeatureCollection
  bounds: { west: number; south: number; east: number; north: number }
  render?: RenderSpec
}) {
  let program: WebGLProgram | null = null
  let posBuffer: WebGLBuffer | null = null
  let lonlatBuffer: WebGLBuffer | null = null
  let colorBuffer: WebGLBuffer | null = null
  let vertexCount = 0

  const triangles = triangulateIsobands(args.geojson, args.render)

  return {
    id: args.id,
    type: "custom",
    renderingMode: "2d",

    onAdd(map: any, gl: WebGLRenderingContext) {
      program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc)
      posBuffer = gl.createBuffer()
      lonlatBuffer = gl.createBuffer()
      colorBuffer = gl.createBuffer()

      const positions = new Float32Array(triangles.positions)
      const lonlats = new Float32Array(triangles.lonlats)
      const colors = new Float32Array(triangles.colors)
      vertexCount = triangles.vertexCount

      console.log("custom masked layer onAdd", {
        id: args.id,
        vertexCount,
        bounds: args.bounds,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, lonlatBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, lonlats, gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
    },

    render(gl: WebGLRenderingContext | WebGL2RenderingContext, options: any) {
      if (!program || !posBuffer || !lonlatBuffer || !colorBuffer) return

      gl.disable(gl.DEPTH_TEST)
      gl.depthMask(false)

      gl.useProgram(program)

      const uMatrix = gl.getUniformLocation(program, "u_matrix")
      const uBounds = gl.getUniformLocation(program, "u_bounds")

      const rawMatrix = options?.defaultProjectionData?.mainMatrix
        if (!rawMatrix) return

        const matrix =
          rawMatrix instanceof Float32Array
            ? rawMatrix
            : new Float32Array(Array.from(rawMatrix as ArrayLike<number>))

        gl.uniformMatrix4fv(uMatrix, false, matrix)

      gl.uniform4f(
        uBounds,
        args.bounds.west,
        args.bounds.south,
        args.bounds.east,
        args.bounds.north
      )

      const aPos = gl.getAttribLocation(program, "a_pos")
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

      const aLonLat = gl.getAttribLocation(program, "a_lonlat")
      gl.bindBuffer(gl.ARRAY_BUFFER, lonlatBuffer)
      gl.enableVertexAttribArray(aLonLat)
      gl.vertexAttribPointer(aLonLat, 2, gl.FLOAT, false, 0, 0)

      const aColor = gl.getAttribLocation(program, "a_color")
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.enableVertexAttribArray(aColor)
      gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0)

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      gl.drawArrays(gl.TRIANGLES, 0, vertexCount)

      const map = (this as any).map
      if (map) map.triggerRepaint()
    },
  }
}

function reconcileAtmosObjects(map: Map, keepLayerIds: Set<string>, keepSourceIds: Set<string>) {
  const style = map.getStyle()

  for (const l of style.layers ?? []) {
    if (isAtmosLayer(l.id) && !keepLayerIds.has(l.id)) {
      removeLayerIfExists(map, l.id)
    }
  }

  for (const id of Object.keys(style.sources ?? {})) {
    if (isAtmosSource(id) && !keepSourceIds.has(id)) {
      removeSourceIfExists(map, id)
    }
  }
}

function getLegacyPaint(render: RenderSpec) {
  if (!render || render.renderer !== "maplibre") return {}
  return "layers" in render ? (render.layers?.[0]?.paint ?? {}) : (render.paint ?? {})
}

function buildArrowLayer(atmosLayer: AtmosMapLayer) {
  const source = srcId(atmosLayer.layerId)
  const resolvedPaint = resolvePaintWithData(getLegacyPaint(atmosLayer.render), atmosLayer.geojson) ?? {}

  const radiusExpr = resolvedPaint["circle-radius"]
  const iconColor =
    typeof resolvedPaint["circle-color"] === "string" ? resolvedPaint["circle-color"] : "#2c7bb6"
  const iconOpacity =
    typeof resolvedPaint["circle-opacity"] === "number" ? resolvedPaint["circle-opacity"] : 1.0

  const iconSize =
    Array.isArray(radiusExpr)
      ? ["*", radiusExpr, 0.1]
      : typeof radiusExpr === "number"
        ? Math.max(0.05, radiusExpr * 0.1)
        : 0.6

  const id = lyrId(atmosLayer.layerId, "arrow")

  return [
    {
      id,
      def: {
        id,
        type: "symbol",
        source,
        layout: {
          "icon-image": "atmos-arrow",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "center",
          "icon-rotation-alignment": "map",
          // "icon-rotate": ["to-number", ["get", "wind10.direction"]],
          "icon-rotate": ["%", ["+", ["to-number", ["get", "wind10.direction"]], 180], 360],
          "icon-size": iconSize,
        },
        paint: {
          "icon-opacity": iconOpacity,
          "icon-color": iconColor,
        },
      },
    },
  ]
}

function isBBoxMask(mask: any): mask is {
  type: "bbox"
  bounds: { west: number; south: number; east: number; north: number }
  interaction?: { on?: string[] }
} {
  return (
    !!mask &&
    mask.type === "bbox" &&
    !!mask.bounds &&
    typeof mask.bounds.west === "number" &&
    typeof mask.bounds.south === "number" &&
    typeof mask.bounds.east === "number" &&
    typeof mask.bounds.north === "number"
  )
}

function buildMaskFillGeoJSON(bounds: [number, number, number, number]): GeoJSONFeatureCollection {
  const [west, south, east, north] = bounds

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-180, -85],
              [180, -85],
              [180, 85],
              [-180, 85],
              [-180, -85],
            ],
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
      },
    ],
  }
}

function buildMaskOutlineGeoJSON(bounds: [number, number, number, number]): GeoJSONFeatureCollection {
  const [west, south, east, north] = bounds

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { kind: "outline" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south],
          ]],
        },
      },
      {
        type: "Feature",
        properties: { kind: "handle", handle: "sw" },
        geometry: { type: "Point", coordinates: [west, south] },
      },
      {
        type: "Feature",
        properties: { kind: "handle", handle: "se" },
        geometry: { type: "Point", coordinates: [east, south] },
      },
      {
        type: "Feature",
        properties: { kind: "handle", handle: "ne" },
        geometry: { type: "Point", coordinates: [east, north] },
      },
      {
        type: "Feature",
        properties: { kind: "handle", handle: "nw" },
        geometry: { type: "Point", coordinates: [west, north] },
      },
    ],
  }
}

function maskFillSourceId(layerId: string) {
  return derivedSrcId(layerId, "mask-fill")
}

function maskOutlineSourceId(layerId: string) {
  return derivedSrcId(layerId, "mask-outline")
}

function maskFillLayerId(layerId: string) {
  return lyrId(layerId, "mask-fill")
}

function maskOutlineLayerId(layerId: string) {
  return lyrId(layerId, "mask-outline")
}

function maskHandlesLayerId(layerId: string) {
  return lyrId(layerId, "mask-handles")
}

const renderers = {
  maplibre: {
    buildPlan(atmosLayer: AtmosMapLayer, ctx: { maskBoundsByLayer: Record<string, MaskBounds> }) {
      const ops: MapOp[] = []

      const render = atmosLayer.render
      if (!render || render.renderer !== "maplibre") return ops

      const source = srcId(atmosLayer.layerId)
      ops.push({ kind: "source", id: source, data: atmosLayer.geojson })

      if (atmosLayer.geometryType === "vector") {
        const glyph = atmosLayer.glyph.type ?? "arrow"

        if (glyph === "barb") {
          const barb = buildBarbLayers(atmosLayer)
          for (const s of barb.extraSources) {
            ops.push({ kind: "source", id: s.source, data: s.data })
          }
         for (const l of barb.layers) {
          ops.push({
            kind: "layer",
            id: l.id,
            def: l.def,
            beforeId: (l as any).beforeId,
            atmosLayerId: atmosLayer.layerId,
          })
        }
          return ops
        }

        for (const l of buildArrowLayer(atmosLayer)) {
          ops.push({
            kind: "layer",
            id: l.id,
            def: l.def,
            beforeId: (l as any).beforeId,
            atmosLayerId: atmosLayer.layerId,
          })
        }
        return ops
      }

      
      // const isMaskedIsoband =
      // atmosLayer.geometryType === "isoband" && isBBoxMask(atmosLayer.mask)
      
      // if (isBBoxMask(atmosLayer.mask)) {
      //   // const { west, south, east, north } = atmosLayer.mask.bounds

      //   const runtimeBounds =
      //     ctx.maskBoundsByLayer[boundsKey(atmosLayer.layerId)] ?? atmosLayer.mask.bounds

      //   const { west, south, east, north } = runtimeBounds

      //   ops.push({
      //     kind: "custom-mask",
      //     id: `mask:${atmosLayer.layerId}`,
      //     targetSourceId: source,
      //     bounds: { west, south, east, north },
      //     atmosLayerId: atmosLayer.layerId,
      //     interactive: atmosLayer.mask.interaction,
      //   })

      //   return ops
      // }

      if (isBBoxMask(atmosLayer.mask)) {
        const runtimeBounds =
          ctx.maskBoundsByLayer[boundsKey(atmosLayer.layerId)] ?? atmosLayer.mask.bounds

        const { west, south, east, north } = runtimeBounds

        if (atmosLayer.geometryType === "isoband") {
          ops.push({
            kind: "custom-mask",
            id: `mask:${atmosLayer.layerId}`,
            targetSourceId: source,
            bounds: { west, south, east, north },
            atmosLayerId: atmosLayer.layerId,
            interactive: atmosLayer.mask.interaction,
          })
          return ops
        }

        const maskedSource = derivedSrcId(atmosLayer.layerId, "masked")
        const clipped = clipFeatureCollectionToBounds(atmosLayer.geojson, runtimeBounds)
        const maskedLayers = buildMaskedMapLibreLayers(atmosLayer, maskedSource)

        ops.push({
          kind: "masked-layer-group",
          atmosLayerId: atmosLayer.layerId,
          sourceId: maskedSource,
          data: clipped,
          bounds: { west, south, east, north },
          layers: maskedLayers,
        })

        return ops
      }


      const layers =
        "layers" in render
          ? render.layers
          : [{ id: "main", type: render.layerType, paint: render.paint, layout: render.layout }]

      for (const [i, l] of layers.entries()) {
        const id = lyrId(atmosLayer.layerId, l.id ?? String(i))
        const def: any = { id, type: l.type, source }

        if (l.paint) def.paint = convertPaint(resolvePaintWithData(l.paint, atmosLayer.geojson))
        if (l.layout) def.layout = l.layout
        if (l.filter) def.filter = l.filter
        if (typeof l.minzoom === "number") def.minzoom = l.minzoom
        if (typeof l.maxzoom === "number") def.maxzoom = l.maxzoom
        if (l["source-layer"]) def["source-layer"] = l["source-layer"]

        ops.push({
          kind: "layer",
          id,
          def,
          beforeId: (l as any).beforeId,
          atmosLayerId: atmosLayer.layerId,
        })
      }

      return ops
    },
  },
} as const

export default function AtmosMap({
  layers,
  autoFitBounds = true,
  mapStyle = "https://demotiles.maplibre.org/style.json",
  initialViewState,
  onViewStateChange,
  onFeatureClick
}: AtmosMapProps) {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const didAutoFitRef = useRef(false)
  
  const [maskBoundsByLayer, setMaskBoundsByLayer] = useState<Record<string, MaskBounds>>({})
  
  const maskBoundsRef = useRef(maskBoundsByLayer)
  
  const dragStateRef = useRef<DragMode>(null)

  useEffect(() => {
    maskBoundsRef.current = maskBoundsByLayer
  }, [maskBoundsByLayer])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const interactiveMaskedLayers = (layers ?? []).filter(
      (l) =>
        isBBoxMask(l.mask) &&
        Array.isArray(l.mask?.interaction?.on)
    )

    if (!interactiveMaskedLayers.length) return

    const onMouseDown = (e: maplibregl.MapMouseEvent) => {
      for (const layer of interactiveMaskedLayers) {
        const on = layer.mask?.interaction?.on ?? []
        const layerId = layer.layerId
        const bounds = maskBoundsRef.current[boundsKey(layerId)] ?? layer.mask.bounds

        const handleLayerId = maskHandlesLayerId(layerId)
        const outlineLayerId = maskOutlineLayerId(layerId)

        const handleHits = map.queryRenderedFeatures(e.point, { layers: [handleLayerId] })
        // if (handleHits.length && on.includes("resize")) {
        //   const handle = handleHits[0].properties?.handle as "sw" | "se" | "ne" | "nw"
        //   dragStateRef.current = {
        //     type: "resize",
        //     layerId,
        //     handle,
        //     startLngLat: e.lngLat,
        //     startBounds: cloneBounds(bounds),
        //   }
        //   map.dragPan.disable()
        //   return
        // }
        if (handleHits.length && on.includes("resize")) {
          const handle = handleHits[0].properties?.handle as "sw" | "se" | "ne" | "nw"

          e.preventDefault()
          e.originalEvent.stopPropagation()

          dragStateRef.current = {
            type: "resize",
            layerId,
            handle,
            startLngLat: e.lngLat,
            startBounds: cloneBounds(bounds),
          }

          map.dragPan.disable()
          return
        }

        const outlineHits = map.queryRenderedFeatures(e.point, { layers: [outlineLayerId] })
        // if ((outlineHits.length || pointInBounds(e.lngLat.lng, e.lngLat.lat, bounds)) && on.includes("drag")) {
        //   dragStateRef.current = {
        //     type: "move",
        //     layerId,
        //     startLngLat: e.lngLat,
        //     startBounds: cloneBounds(bounds),
        //   }
        //   map.dragPan.disable()
        //   return
        // }
        if ((outlineHits.length || pointInBounds(e.lngLat.lng, e.lngLat.lat, bounds)) && on.includes("drag")) {
          e.preventDefault()
          e.originalEvent.stopPropagation()

          dragStateRef.current = {
            type: "move",
            layerId,
            startLngLat: e.lngLat,
            startBounds: cloneBounds(bounds),
          }

          map.dragPan.disable()
          return
        }
      }
    }

    const onMouseMove = (e: maplibregl.MapMouseEvent) => {
      const drag = dragStateRef.current
      if (!drag) return

      const dLng = e.lngLat.lng - drag.startLngLat.lng
      const dLat = e.lngLat.lat - drag.startLngLat.lat

      setMaskBoundsByLayer((prev) => {
        const next = { ...prev }

        if (drag.type === "move") {
          next[boundsKey(drag.layerId)] = translateBounds(drag.startBounds, dLng, dLat)
        } else {
          next[boundsKey(drag.layerId)] = resizeBounds(
            drag.startBounds,
            drag.handle,
            e.lngLat.lng,
            e.lngLat.lat
          )
        }

        return next
      })
    }

    const onMouseUp = () => {
      if (dragStateRef.current) {
        dragStateRef.current = null
        map.dragPan.enable()
      }
    }

    map.on("mousedown", onMouseDown)
    map.on("mousemove", onMouseMove)
    map.on("mouseup", onMouseUp)

    return () => {
      map.off("mousedown", onMouseDown)
      map.off("mousemove", onMouseMove)
      map.off("mouseup", onMouseUp)
    }
  }, [layers])
  
  const plan = useMemo(() => {
    const sourceIds = new Set<string>()
    const layerIds = new Set<string>()
    const ops: MapOp[] = []

    for (const l of layers ?? []) {
      if (!l?.layerId || !l?.geojson) continue

      const built = renderers.maplibre.buildPlan(l, {
        maskBoundsByLayer,
      })

      for (const op of built) {
        // if (op.kind === "source") {
        //   sourceIds.add(op.id)
        // } else if (op.kind === "layer") {
        //   layerIds.add(op.id)
        // } else if (op.kind === "custom-mask") {
        //   sourceIds.add(maskFillSourceId(op.atmosLayerId))
        //   sourceIds.add(maskOutlineSourceId(op.atmosLayerId))
        //   layerIds.add(maskFillLayerId(op.atmosLayerId))
        //   layerIds.add(maskOutlineLayerId(op.atmosLayerId))
        //   layerIds.add(maskHandlesLayerId(op.atmosLayerId))
        // }
        if (op.kind === "source") {
          sourceIds.add(op.id)
        } else if (op.kind === "layer") {
          layerIds.add(op.id)
        } else if (op.kind === "custom-mask") {
          sourceIds.add(maskFillSourceId(op.atmosLayerId))
          sourceIds.add(maskOutlineSourceId(op.atmosLayerId))
          layerIds.add(maskHandlesLayerId(op.atmosLayerId))
        } else if (op.kind === "masked-layer-group") {
          sourceIds.add(op.sourceId)
          sourceIds.add(maskFillSourceId(op.atmosLayerId))
          sourceIds.add(maskOutlineSourceId(op.atmosLayerId))
          layerIds.add(maskHandlesLayerId(op.atmosLayerId))
          for (const l of op.layers) layerIds.add(l.id)
        }

        ops.push(op)
      }
    }

    // for (let i = 0; i < ops.length; i++) {
    //   const op = ops[i]
    //   if (op.kind !== "custom-mask") continue

    //   let beforeId: string | undefined = undefined

    //   for (let j = i + 1; j < ops.length; j++) {
    //     const next = ops[j]
    //     if (next.kind === "layer") {
    //       beforeId = next.id
    //       break
    //     }
    //   }

    //   op.beforeId = beforeId
    // }

    for (let i = 0; i < ops.length; i++) {
      const op = ops[i]
      if (op.kind !== "custom-mask" && op.kind !== "masked-layer-group") continue

      let beforeId: string | undefined = undefined

      for (let j = i + 1; j < ops.length; j++) {
        const next = ops[j]
        if (next.kind === "layer") {
          beforeId = next.id
          break
        }
        if (next.kind === "masked-layer-group" && next.layers.length) {
          beforeId = next.layers[0].id
          break
        }
      }

      op.beforeId = beforeId
    }

    return { sourceIds, layerIds, ops }
  }, [layers, maskBoundsByLayer])

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [-78.9, 38.43],
      zoom: 6,
      attributionControl: false,
      logoPosition: undefined,
    })

    if (initialViewState) {
      map.jumpTo({
        center: initialViewState.center,
        zoom: initialViewState.zoom,
        bearing: initialViewState.bearing,
        pitch: initialViewState.pitch,
      })
      didAutoFitRef.current = true
    } else {
      didAutoFitRef.current = false
    }

    // map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
    mapRef.current = map

    const emit = () => {
      const c = map.getCenter()
      onViewStateChange?.({
        center: [c.lng, c.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      })
    }

    map.on("moveend", emit)

    return () => {
      map.off("moveend", emit)
      map.remove()
      mapRef.current = null
    }
  }, [mapStyle, initialViewState, onViewStateChange])

  useEffect(() => {
    const onResize = () => mapRef.current?.resize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    let cancelled = false
    let token = 0
    let scheduled = false

    const run = () => {
      scheduled = false
      if (cancelled) return
      const myToken = ++token

      const doApply = () => {
        if (cancelled) return
        if (myToken !== token) return

        if (!map.isStyleLoaded()) {
          map.once("load", doApply)
          return
        }

        try {
          for (const bucket of [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]) {
            ensureBarbIcon(map, bucket)
          }
          ensureArrowIcon(map)
          reconcileAtmosObjects(map, plan.layerIds, plan.sourceIds)

          for (const op of plan.ops) {
            if (op.kind === "source") {
              upsertGeoJSONSource(map, op.id, op.data)
            }
          }

          for (const op of plan.ops) {
            if (op.kind === "layer") {
              upsertLayer(map, op.def, op.beforeId)
            } else if (op.kind === "masked-layer-group") {
              upsertGeoJSONSource(map, op.sourceId, op.data)
              upsertBBoxMaskLayers(map, op.atmosLayerId, op.bounds, op.beforeId)

              for (const l of op.layers) {
                upsertLayer(map, l.def, op.beforeId)
              }
            } else if (op.kind === "custom-mask") {
              // upsertMaskedIsobandLayer(map, {
              //   id: op.id,
              //   layerId: op.atmosLayerId,
              //   geojson: layers.find((l) => l.layerId === op.atmosLayerId)?.geojson,
              //   bounds: op.bounds,
              //   render: layers.find((l) => l.layerId === op.atmosLayerId)?.render,
              // })
              upsertBBoxMaskLayers(map, op.atmosLayerId, op.bounds, op.beforeId)

              const targetLayer = layers.find((l) => l.layerId === op.atmosLayerId)

              upsertMaskedIsobandLayer(map, {
                id: op.id,
                layerId: op.atmosLayerId,
                geojson: targetLayer?.geojson,
                bounds: op.bounds,
                render: targetLayer?.render,
                beforeId: op.beforeId,
              })
            }
          }

          if (autoFitBounds && !didAutoFitRef.current) {
            const bb = firstNonEmptyBBox(layers ?? [])
            if (bb) {
              didAutoFitRef.current = true
              map.fitBounds(
                [
                  [bb[0], bb[1]],
                  [bb[2], bb[3]],
                ],
                { padding: 30, duration: 400 }
              )
            }
          }
        } catch {
          if (!scheduled) {
            scheduled = true
            requestAnimationFrame(doApply)
          }
        }
      }

      doApply()
    }

    run()
    return () => {
      cancelled = true
    }
  }, [plan, autoFitBounds, layers])

  useEffect(() => {
  const map = mapRef.current
  if (!map || !onFeatureClick) return

  const clickableLayerIds = plan.ops
    .filter((op): op is { kind: "layer"; id: string; def: any; beforeId?: string; atmosLayerId: string } => op.kind === "layer")
    .map((op) => op.id)

  if (!clickableLayerIds.length) return

  const handleClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
    const features = map.queryRenderedFeatures(e.point, { layers: clickableLayerIds })
    if (!features.length) return

    const f = features[0]
    const clickedLayerId = f.layer.id

    const op = plan.ops.find(
      (x): x is { kind: "layer"; id: string; def: any; beforeId?: string; atmosLayerId: string } =>
        x.kind === "layer" && x.id === clickedLayerId
    )
    if (!op) return

    onFeatureClick({
      layerId: op.atmosLayerId,
      feature: f as unknown as GeoJSON.Feature,
      properties: (f.properties ?? {}) as Record<string, any>,
    })
  }

  map.on("click", handleClick)

  return () => {
    map.off("click", handleClick)
  }
}, [plan, onFeatureClick])

  useEffect(() => {
    setMaskBoundsByLayer((prev) => {
      const next = { ...prev }

      for (const layer of layers ?? []) {
        // if (
        //   layer.geometryType === "isoband" &&
        //   layer.mask?.type === "bbox" &&
        //   layer.mask?.bounds
        // ) {
        //   const key = boundsKey(layer.layerId)
        //   if (!next[key]) {
        //     next[key] = cloneBounds(layer.mask.bounds)
        //   }
        // }
        if (isBBoxMask(layer.mask)) {
          const key = boundsKey(layer.layerId)
          if (!next[key]) {
            next[key] = cloneBounds(layer.mask.bounds)
          }
        }
      }

      return next
    })
  }, [layers])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}