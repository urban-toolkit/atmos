import { useEffect, useRef } from "react"
import maplibregl, { Map } from "maplibre-gl"
import { convertPaint, schemeToColors } from "../../helpers/colors"

type RenderSpec =
  | {
      renderer: "maplibre"
      layerType: "fill" | "line" | "circle"
      paint?: Record<string, any>
      layout?: Record<string, any>
    }
  | undefined

type AtmosMapProps = {
  layers: Array<{
    layerId: string
    role: "field" | "boundary" | "unknown"
    geojson: any
    render?: RenderSpec
  }>
}

// type AtmosMapProps = {
//   layers: Array<{
//     layerId: string
//     role: "field" | "boundary" | "unknown"
//     geojson: any
//     fill?: FillChannel
//     opacity?: number
//   }>
// }

type FillScale =
  | { type: "sequential"; scheme?: string; domain?: [number, number]; steps?: number }
  | { type: "sequential"; stops: Array<[number, string]> }

type FillChannel = {
  field: string
  scale: FillScale
}

export default function AtmosMap({ layers }: AtmosMapProps) {

  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  function bboxFromFeatureCollection(fc: any): [number, number, number, number] | null {
    if (!fc || fc.type !== "FeatureCollection" || !Array.isArray(fc.features)) return null

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    const pushCoord = (x: number, y: number) => {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }

    const walk = (coords: any) => {
      if (!coords) return
      if (typeof coords[0] === "number" && typeof coords[1] === "number") {
        pushCoord(coords[0], coords[1])
        return
      }
      for (const c of coords) walk(c)
    }

    for (const f of fc.features) {
      if (f?.geometry?.coordinates) walk(f.geometry.coordinates)
    }

    if (!isFinite(minX)) return null
    return [minX, minY, maxX, maxY]
  }

  function buildFillColorExpr(fill: FillChannel) {
    const field = fill.field;

    // handle nodata safely
    const valueExpr: any[] = ["coalesce", ["get", field], 0];

    // Case 1: explicit stops (best)
    if ("stops" in fill.scale) {
      const stops = fill.scale.stops;
      return [
        "interpolate",
        ["linear"],
        valueExpr,
        ...stops.flatMap(([v, c]) => [v, c]),
      ];
    }

    // Case 2: domain + steps (needs a scheme->colors function)
    const domain = fill.scale.domain;
    const steps = fill.scale.steps ?? 7;
    if (!domain) {
      throw new Error(`fill.scale.domain is required when scale.stops is not provided`);
    }

    const [d0, d1] = domain;
    const vals = Array.from({ length: steps }, (_, i) => d0 + (i * (d1 - d0)) / (steps - 1));

    const colors = schemeToColors(fill.scale.scheme ?? "RdYlBu", steps); // you implement
    return [
      "interpolate",
      ["linear"],
      valueExpr,
      ...vals.flatMap((v, i) => [v, colors[i]]),
    ];
  }

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-78.9, 38.43],
      zoom: 6,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])  

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!layers?.length) return
    if (layers.some((l) => !l.geojson)) return

    const apply = () => {
      const keepLayerIds = new Set(layers.map(l => `lyr-${l.layerId}`))
      const keepSourceIds = new Set(layers.map(l => `src-${l.layerId}`))

      for (const id of map.getStyle().layers?.map(x => x.id) ?? []) {
        if (id.startsWith("lyr-") && !keepLayerIds.has(id)) map.removeLayer(id)
      }
      for (const id of Object.keys(map.getStyle().sources ?? {})) {
        if (id.startsWith("src-") && !keepSourceIds.has(id)) map.removeSource(id)
      }

      for (const l of layers) {
        const SRC = `src-${l.layerId}`
        const LYR = `lyr-${l.layerId}`

        if (!map.getSource(SRC)) map.addSource(SRC, { type: "geojson", data: l.geojson })
        else (map.getSource(SRC) as any).setData(l.geojson)

        if (map.getLayer(LYR)) map.removeLayer(LYR)

        const render = (l as any).render
        if (render?.renderer === "maplibre") {
          const SRC = `src-${l.layerId}`
          const LYR = `lyr-${l.layerId}`

          if (!map.getSource(SRC)) map.addSource(SRC, { type: "geojson", data: l.geojson })
          else (map.getSource(SRC) as any).setData(l.geojson)

          // ensure updates apply if paint changes
          if (map.getLayer(LYR)) map.removeLayer(LYR)

          const layerDef: any = {
            id: LYR,
            type: render.layerType,
            source: SRC,
            paint: convertPaint(render.paint ?? {}),
          }

          if (render.layout && typeof render.layout === "object") {
            layerDef.layout = render.layout
          }

          map.addLayer(layerDef)
          continue
        }
      }

      // fit bounds (use first layer that exists)
      const anyGeo = layers[0]?.geojson
      const bb = bboxFromFeatureCollection(anyGeo)
      if (bb) map.fitBounds([[bb[0], bb[1]], [bb[2], bb[3]]], { padding: 30, duration: 400 })
    }

    if (!map.isStyleLoaded()) {
      map.once("load", apply)
      return
    }
    apply()
  }, [layers])
  

  return <div ref={containerRef} />
}