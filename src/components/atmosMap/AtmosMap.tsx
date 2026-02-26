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
}

export type AtmosMapProps = {
  layers: AtmosMapLayer[]
  /**
   * If true, will fit bounds whenever layers change (using first non-empty bbox).
   * If you later add Atmos "view" camera, you can disable this by default.
   */
  autoFitBounds?: boolean
  /**
   * MapLibre style URL or JSON (optional)
   */
  mapStyle?: string | any
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
  map.addLayer(layerDef, beforeId)
}

/**
 * -------------------------------------------
 * Renderer adapters (future: deck.gl, etc.)
 * -------------------------------------------
 */
const renderers = {
  maplibre: {
    buildLayers(atmosLayer: AtmosMapLayer): Array<{ id: string; def: any; beforeId?: string }> {
      const render = atmosLayer.render
      if (!render || render.renderer !== "maplibre") return []

      const source = srcId(atmosLayer.layerId)

      // Normalize to the NEW array form
      const layers =
        "layers" in render
          ? render.layers
          : [
              {
                id: "main",
                type: render.layerType,
                paint: render.paint,
                layout: render.layout,
              },
            ]

      return layers.map((l, i) => {
        const id = lyrId(atmosLayer.layerId, l.id ?? String(i))

        const def: any = {
          id,
          type: l.type,
          source,
        }

        if (l.paint) def.paint = convertPaint(l.paint)
        if (l.layout) def.layout = l.layout
        if (l.filter) def.filter = l.filter
        if (typeof l.minzoom === "number") def.minzoom = l.minzoom
        if (typeof l.maxzoom === "number") def.maxzoom = l.maxzoom
        if (l["source-layer"]) def["source-layer"] = l["source-layer"]

        return { id, def, beforeId: (l as any).beforeId }
      })
    },
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
}: AtmosMapProps) {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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

  // Create map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [-78.9, 38.43],
      zoom: 6,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [mapStyle])

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

    const apply = () => {
      // Remove stale Atmos objects
      reconcileAtmosObjects(map, plan.layerIds, plan.sourceIds)

      // Upsert sources first
      for (const op of plan.ops) {
        if (op.kind === "source") upsertGeoJSONSource(map, op.id, op.data)
      }

      // Then replace layers (paint/layout changes)
      for (const op of plan.ops) {
        if (op.kind === "layer") replaceLayer(map, op.def, op.beforeId)
      }

      // Optional fit bounds
      if (autoFitBounds) {
        const bb = firstNonEmptyBBox(layers ?? [])
        if (bb) {
          map.fitBounds(
            [
              [bb[0], bb[1]],
              [bb[2], bb[3]],
            ],
            { padding: 30, duration: 400 }
          )
        }
      }
    }

    if (!map.isStyleLoaded()) {
      map.once("load", apply)
      return
    }
    apply()
  }, [plan, layers, autoFitBounds])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}