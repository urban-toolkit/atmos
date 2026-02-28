import { useEffect, useMemo, useRef } from "react"
import maplibregl, { Map } from "maplibre-gl"
import { convertPaint } from "../../helpers/colors"

/**
 * -------------------------------------------
 * Types (grow these as Atmos grows)
 * -------------------------------------------
 */

type GeoJSONFeatureCollection = GeoJSON.FeatureCollection

type MapLayerRole = "field" | "boundary" | "unknown"

// MapLibre layer types we’ll use (expand later as needed)
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
      // OLD (legacy)
      layerType: "fill" | "line" | "circle"
      paint?: Record<string, any>
      layout?: Record<string, any>
    }

type RenderSpec = MapLibreRenderSpec | undefined

export type AtmosMapLayer = {
  layerId: string
  role: MapLayerRole
  geojson: GeoJSONFeatureCollection
  render?: RenderSpec
  geometryType?: string
}

export type AtmosMapProps = {
  layers: AtmosMapLayer[]
  autoFitBounds?: boolean
  mapStyle?: string | any
  initialViewState?: ViewState
  onViewStateChange?: (vs: ViewState) => void

}

export type ViewState = { center: [number, number]; zoom: number; bearing: number; pitch: number }

/**
 * -------------------------------------------
 * Wind helpers
 * -------------------------------------------
 */

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

  // Draw arrow pointing UP (north). Keep it solid black.
  ctx.fillStyle = "#000"
  ctx.translate(size / 2, size / 2)

  // stem
  ctx.beginPath()
  ctx.rect(-3, -18, 6, 26)
  ctx.fill()

  // head
  ctx.beginPath()
  ctx.moveTo(0, -30)
  ctx.lineTo(14, -10)
  ctx.lineTo(-14, -10)
  ctx.closePath()
  ctx.fill()

  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const imageData = ctx.getImageData(0, 0, size, size)

  // IMPORTANT: sdf:true enables icon-color / halo, etc.
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
    const props = f?.properties
    const n = getPropNumber(props, field)
    if (n == null) continue
    if (n < min) min = n
    if (n > max) max = n
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) return null
  if (min === max) return [min, max] // still valid; caller can handle
  return [min, max]
}

function resolveNumberScaleToExpression(scaleObj: any, fc: any) {
  // Expected:
  // { kind:"number-scale", field:"wind10.speed", scale:{type,domain:{type:"extent"}, range:{values:[a,b]}} }

  const field = scaleObj?.field
  const scale = scaleObj?.scale
  const range = scale?.range?.values

  if (typeof field !== "string") return null
  if (!Array.isArray(range) || range.length !== 2) return null
  const r0 = Number(range[0])
  const r1 = Number(range[1])
  if (!Number.isFinite(r0) || !Number.isFinite(r1)) return null

  // domain extent => compute from data
  const domainType = scale?.domain?.type
  if (domainType !== "extent") return null

  const ext = extentForField(fc, field)
  if (!ext) return null

  const [d0, d1] = ext
  if (d0 === d1) {
    // constant radius if all speeds equal
    return r0
  }

  // MapLibre expression
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
    if (v && typeof v === "object" && v.kind === "number-scale") {
      const expr = resolveNumberScaleToExpression(v, fc)
      if (expr != null) out[k] = expr
    }
  }

  return out
}

/**
 * -------------------------------------------
 * ID helpers (namespacing prevents collisions)
 * -------------------------------------------
 */
function srcId(layerId: string) {
  return `src:${layerId}`
}

function lyrId(layerId: string, local?: string) {
  // local lets one Atmos layer produce many MapLibre layers
  return local ? `lyr:${layerId}:${local}` : `lyr:${layerId}`
}

function isAtmosSource(id: string) {
  return id.startsWith("src:")
}

function isAtmosLayer(id: string) {
  return id.startsWith("lyr:")
}

/**
 * -------------------------------------------
 * Geo helpers
 * -------------------------------------------
 */
type BBox = [number, number, number, number]

function bboxFromFeatureCollection(fc: any): BBox | null {
  if (!fc || fc.type !== "FeatureCollection" || !Array.isArray(fc.features)) return null

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity

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

  if (!isFinite(minX)) return null
  return [minX, minY, maxX, maxY]
}

function firstNonEmptyBBox(layers: AtmosMapLayer[]): BBox | null {
  for (const l of layers) {
    const bb = bboxFromFeatureCollection(l.geojson)
    if (bb) return bb
  }
  return null
}

/**
 * -------------------------------------------
 * MapLibre upsert utilities
 * -------------------------------------------
 */

function upsertGeoJSONSource(map: Map, id: string, data: GeoJSONFeatureCollection) {
  const existing = map.getSource(id) as any
  if (!existing) {
    map.addSource(id, { type: "geojson", data })
    return
  }
  // GeoJSONSource has setData
  if (typeof existing.setData === "function") existing.setData(data)
}

function removeLayerIfExists(map: Map, id: string) {
  if (map.getLayer(id)) map.removeLayer(id)
}

function removeSourceIfExists(map: Map, id: string) {
  if (map.getSource(id)) map.removeSource(id)
}


/**
 * When paint/layout changes, MapLibre doesn’t have a “replaceLayer” API,
 * so we remove + add. This is simple and reliable for now.
 */
function replaceLayer(map: Map, layerDef: any, beforeId?: string) {
  removeLayerIfExists(map, layerDef.id)

  const safeBeforeId =
    beforeId && map.getLayer(beforeId) ? beforeId : undefined

  const src = layerDef.source

  // If the source isn't ready yet, don't try to add the layer
  if (typeof src === "string" && !map.getSource(src)) {
    console.warn("Skipping addLayer because source missing (will retry later)", {
      layerId: layerDef.id,
      source: src,
    })
    return
  }

  try {
    map.addLayer(layerDef, safeBeforeId)
  } catch (e) {
    console.warn("addLayer failed; retrying without beforeId", {
      id: layerDef.id,
      beforeId,
      safeBeforeId,
      e,
    })

    try {
      map.addLayer(layerDef)
    } catch (e2) {
      console.warn("addLayer still failed", {
        id: layerDef.id,
        source: src,
        e2,
      })
    }
  }
}

/**
 * -------------------------------------------
 * Renderer adapters (future: deck.gl, etc.)
 * -------------------------------------------
 */
const renderers = {
  maplibre: {
    buildLayers(atmosLayer: AtmosMapLayer) {
      const render = atmosLayer.render
      if (!render || render.renderer !== "maplibre") return []

      const source = srcId(atmosLayer.layerId)

      // VECTOR OVERRIDE: draw arrows
      if (atmosLayer.geometryType === "vector") {
        const source = srcId(atmosLayer.layerId)

        // Your current manifest puts the number-scale under circle-radius
        const legacyPaint =
          "layers" in render ? render.layers?.[0]?.paint : render.paint

        const resolvedPaint = resolvePaintWithData(legacyPaint ?? {}, atmosLayer.geojson)
        const radiusExpr = resolvedPaint?.["circle-radius"] // number OR expression

        const iconColor =
          typeof resolvedPaint?.["circle-color"] === "string"
            ? resolvedPaint["circle-color"]
            : "#2c7bb6" // fallback

        const iconOpacity =
          typeof resolvedPaint?.["circle-opacity"] === "number"
            ? resolvedPaint["circle-opacity"]
            : 1.0

        // Convert radius (2..12) into a reasonable icon-size (~0.2..1.2)
        // MapLibre icon-size is a multiplier (1.0 = original icon).        
        const glyphScale =
          typeof (render as any)?.glyphScale === "number" && (render as any).glyphScale > 0
            ? (render as any).glyphScale
            : 1.0

        // radiusExpr is either a number or an expression
        const iconSize =
          Array.isArray(radiusExpr)
            ? ["*", radiusExpr, 0.1 * glyphScale] // 2..12 -> 0.2..1.2, then glyphScale
            : typeof radiusExpr === "number"
              ? Math.max(0.05, radiusExpr * 0.1 * glyphScale)
              : 0.6 * glyphScale

        const id = lyrId(atmosLayer.layerId, "arrow")

        const def: any = {
          id,
          type: "symbol",
          source,
          layout: {
            "icon-image": "atmos-arrow",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-anchor": "center",
            "icon-rotation-alignment": "map",

            // direction field (degrees clockwise from north) => perfect for icon-rotate
            // NOTE: your field key includes a dot, so keep it EXACTLY the same string.
            "icon-rotate": ["to-number", ["get", "wind10.direction"]],

            "icon-size": iconSize,
          },
          paint: {
            "icon-opacity": iconOpacity,
            // Works only if sdf:true in addImage
            "icon-color": iconColor,
          },
        }

        return [{ id, def }]
      }

      // ---- default path (your current code) ----
      const layers =
        "layers" in render
          ? render.layers
          : [{ id: "main", type: render.layerType, paint: render.paint, layout: render.layout }]

      return layers.map((l, i) => {
        const id = lyrId(atmosLayer.layerId, l.id ?? String(i))
        const def: any = { id, type: l.type, source }

        // IMPORTANT: resolve paint with data BEFORE convertPaint, so extent scales work.
        if (l.paint) def.paint = convertPaint(resolvePaintWithData(l.paint, atmosLayer.geojson))
        if (l.layout) def.layout = l.layout
        if (l.filter) def.filter = l.filter
        if (typeof l.minzoom === "number") def.minzoom = l.minzoom
        if (typeof l.maxzoom === "number") def.maxzoom = l.maxzoom
        if (l["source-layer"]) def["source-layer"] = l["source-layer"]

        return { id, def, beforeId: (l as any).beforeId }
      })
    }
  },
} as const

/**
 * -------------------------------------------
 * Cleanup logic
 * -------------------------------------------
 */
function reconcileAtmosObjects(map: Map, keepLayerIds: Set<string>, keepSourceIds: Set<string>) {
  // Remove stale layers first (safe: layers reference sources)
  const style = map.getStyle()
  const existingLayers = style.layers ?? []
  for (const l of existingLayers) {
    if (isAtmosLayer(l.id) && !keepLayerIds.has(l.id)) {
      removeLayerIfExists(map, l.id)
    }
  }

  // Then remove stale sources
  const existingSources = style.sources ?? {}
  for (const id of Object.keys(existingSources)) {
    if (isAtmosSource(id) && !keepSourceIds.has(id)) {
      removeSourceIfExists(map, id)
    }
  }
}

/**
 * -------------------------------------------
 * Main component
 * -------------------------------------------
 */
export default function AtmosMap({
  layers,
  autoFitBounds = true,
  mapStyle = "https://demotiles.maplibre.org/style.json",
  initialViewState,
  onViewStateChange,
}: AtmosMapProps) {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const didAutoFitRef = useRef(false)

  // Precompute “what MapLibre layers should exist” (pure, testable)
  const plan = useMemo(() => {
    const sourceIds = new Set<string>()
    const layerIds = new Set<string>()
    const ops: Array<
      | { kind: "source"; id: string; data: GeoJSONFeatureCollection }
      | { kind: "layer"; id: string; def: any; beforeId?: string }
    > = []

    for (const l of layers ?? []) {
      if (!l?.layerId || !l?.geojson) continue

      const sid = srcId(l.layerId)
      sourceIds.add(sid)
      ops.push({ kind: "source", id: sid, data: l.geojson })

      // If no explicit render given yet, you can choose a default later based on role/type.
      // For now: render only if provided.
      const built = renderers.maplibre.buildLayers(l)
      for (const b of built) {
        layerIds.add(b.id)
        ops.push({ kind: "layer", id: b.id, def: b.def, beforeId: b.beforeId })
      }
    }

    return { sourceIds, layerIds, ops }
  }, [layers])

  // // Create map once
  // useEffect(() => {
  //   if (mapRef.current || !containerRef.current) return

  //   const map = new maplibregl.Map({
  //     container: containerRef.current,
  //     style: mapStyle,
  //     center: [-78.9, 38.43],
  //     zoom: 6,
  //     attributionControl: false,
  //     logoPosition: undefined,
  //   })

  //   if (initialViewState) {
  //     map.jumpTo({
  //       center: initialViewState.center,
  //       zoom: initialViewState.zoom,
  //       bearing: initialViewState.bearing,
  //       pitch: initialViewState.pitch,
  //     })
  //     didAutoFitRef.current = true
  //   } else {
  //     didAutoFitRef.current = false
  //   }

  //   map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
  //   mapRef.current = map

  //   const emit = () => {
  //     const c = map.getCenter()
  //     onViewStateChange?.({
  //       center: [c.lng, c.lat],
  //       zoom: map.getZoom(),
  //       bearing: map.getBearing(),
  //       pitch: map.getPitch(),
  //     })
  //   }

  //   map.on("moveend", emit)

  //   return () => {
  //     map.off("moveend", emit)
  //     map.remove()
  //     mapRef.current = null
  //   }
  // }, [mapStyle])

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

    // restore camera if provided; otherwise allow one auto-fit later
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

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
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
  }, [mapStyle]) // OK: map created once per style

  // Resize listener
  useEffect(() => {
    const onResize = () => mapRef.current?.resize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Apply plan whenever layers change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    let cancelled = false

    const apply = () => {
      if (cancelled) return
      if (!map.isStyleLoaded()) return // still not ready

      try {
        ensureArrowIcon(map)
        reconcileAtmosObjects(map, plan.layerIds, plan.sourceIds)

        // sources first
        for (const op of plan.ops) {
          if (op.kind === "source") upsertGeoJSONSource(map, op.id, op.data)
        }

        // then layers
        for (const op of plan.ops) {
          if (op.kind === "layer") replaceLayer(map, op.def, op.beforeId)
        }

        // Fit bounds
        if (autoFitBounds && !didAutoFitRef.current) {
          const bb = firstNonEmptyBBox(layers ?? [])
          if (bb) {
            didAutoFitRef.current = true
            map.fitBounds([[bb[0], bb[1]], [bb[2], bb[3]]], { padding: 30, duration: 400 })
          }
        }
      } catch (e) {
        // If style is in flux, sources/layers can throw. Retry on next styledata tick.
        console.warn("apply failed; will retry on styledata", e)
        map.once("styledata", apply)
      }
    }

    // Always: ensure we apply after style events too
    const onStyleData = () => apply()

    if (!map.isStyleLoaded()) {
      map.once("load", apply)
    } else {
      apply()
    }

    map.on("styledata", onStyleData)

    return () => {
      cancelled = true
      map.off("styledata", onStyleData)
    }
  }, [plan, layers, autoFitBounds])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}