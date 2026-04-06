import { useEffect, useMemo, useRef, useState } from "react"
import { runSpec } from "../api/api"

import { interpretManifestToMapLayers } from "../interpreters/manifestInterpreter"
import type { MapLayerRuntime } from "../interpreters/manifestInterpreter"

import Editor from "../components/editor/Editor"
import AtmosMap from "../components/atmosMap/AtmosMap"
import { interpretManifestToCharts } from "../interpreters/chartInterpreter"
import type { ChartRuntime } from "../interpreters/chartInterpreter"
import AtmosChart from "../components/chart/AtmosChart"
import FloatingPanel from "../components/floatingPanel/FloatingPanel"
import { getGradientFromPaintSpec } from "../helpers/colors"

type Manifest = {
  kind: string
  schemaVersion: string
  composition?: {
    layout?: Record<string, any>
    context?: {
      title?: {
        text?: string
        template?: string
        subtitle?: string
        subtitleTemplate?: string
      }
      legends?: Array<{
        title?: string
        type?: string
        source?: Array<{
          view: string
          layers?: string[]
          channel?: string
        }>
        resolvedSource?: Array<{
          view: string
          layers?: string[]
          channel?: string
        }>
      }>
    }
  }
  views?: Array<{
    id: string
    baseViewId?: string
    repeat?: {
      type?: string
      dim?: string
      index?: number
      value?: number
      baseViewId?: string
    }
    context?: {
      title?: {
        text?: string
        template?: string
        subtitle?: string
        subtitleTemplate?: string
      }
    }
    layers?: string[]
  }>
  artifacts: Array<{
    id: string
    format: string
    path: string
    producerStep: string
    metadata?: Record<string, any>
  }>
  uiState?: {
    timeMax?: number
  }
}

// const firstExamplePath = "/examples/atmos/ex1-0-mesh-t2mF.json"
// const firstExamplePath = "/examples/atmos/ex1-0-mesh-t2mF-slider.json"
// const firstExamplePath = "/examples/atmos/ex1-0-isoband-rain.json"
// const firstExamplePath = "/examples/atmos/ex1-0-mesh-t2m-range.json"
// const firstExamplePath = "/examples/atmos/ex2-0-isoline-slp.json"
// const firstExamplePath = "/examples/atmos/ex2-0-wind-arrows.json"
// const firstExamplePath = "/examples/atmos/ex2-0-wind-barbs.json"
// const firstExamplePath = "/examples/atmos/ex3-0-stations.json"
// const firstExamplePath = "/examples/atmos/ex1-0-isoband-rain-slider.json"
// const firstExamplePath = "/examples/atmos/ex4-1-ens.json"
// const firstExamplePath = "/examples/atmos/ex4-3-ens-rain.json"
// const firstExamplePath = "/examples/atmos/ex4-4-ens-rain.json"
// const firstExamplePath = "/examples/atmos/ex4-5-ens-prob.json"
// const firstExamplePath = "/examples/atmos/ex4-6-ens-qtl.json"
// const firstExamplePath = "/examples/atmos/ex3-1-obs-frcst.json"
// const firstExamplePath = "/examples/atmos/ex4-0-isoband-rain-mask.json"

// const firstExamplePath = "/examples/atmos/paper-sc1-ex1.json"
// const firstExamplePath = "/examples/atmos/paper-sc1-ex2.json"
// const firstExamplePath = "/examples/atmos/paper-sc2-ex1.json"
// const firstExamplePath = "/examples/atmos/paper-sc2-ex2.json"
// const firstExamplePath = "/examples/atmos/paper-sc2-ex3.json"
// const firstExamplePath = "/examples/atmos/paper-sc2-ex4.json"
// const firstExamplePath = "/examples/atmos/paper-sc3-ex1.json"
// const firstExamplePath = "/examples/atmos/paper-sc3-ex1-1.json"

// const firstExamplePath = "/examples/atmos/paper-sc4-ex1.json"
// const firstExamplePath = "/examples/atmos/paper-sc4-ex1-test.json"
// const firstExamplePath = "/examples/atmos/paper-sc4-ex1-test-2.json"
// const firstExamplePath = "/examples/atmos/paper-sc4-ex2.json"

// const firstExamplePath = "/examples/atmos-lite/sc1-ex1.json"
// const firstExamplePath = "/examples/atmos-lite/sc1-ex2.json"
// const firstExamplePath = "/examples/atmos-lite/sc2-ex1.json"
// const firstExamplePath = "/examples/atmos-lite/sc2-ex2.json"
const firstExamplePath = "/examples/atmos-lite/sc4-ex1.json"

// const firstExamplePath = "/examples/atmos/spec.json"

type FirstSnapshot = {
  spec: any
  manifest: Manifest
  mapLayers: MapLayerRuntime[]
  geoByLayerKey: Record<string, any>
  baseUrl: string
}

// function getCompositionLegend(manifest: Manifest | null) {
//   return manifest?.composition?.context?.legends?.[0] ?? null
// }

function findArtifactForLegendSource(
  manifest: Manifest | null,
  source: { view: string; layers?: string[]; channel?: string } | null | undefined
) {
  if (!manifest || !source) return null

  const wantedView = source.view
  const wantedLayer = source.layers?.[0]

  return (
    manifest.artifacts.find((a) => {
      const md = a.metadata ?? {}

      const matchesLayer = md.layerId === wantedLayer

      const matchesView =
        md.viewId === wantedView ||
        md.baseViewId === wantedView

      return matchesLayer && matchesView
    }) ?? null
  )
}

// function getLegendPaintSpec(manifest: Manifest | null) {
//   const legend = getCompositionLegend(manifest)
//   const src = legend?.resolvedSource?.[0]
//   const artifact = findArtifactForLegendSource(manifest, src)
//   const md = artifact?.metadata ?? {}
//   const render = md.render ?? {}
//   const paint = render.paint ?? {}

//   if (src?.channel === "fill") {
//     return paint["fill-color"] ?? null
//   }
//   if (src?.channel === "stroke") {
//     return paint["line-color"] ?? null
//   }
//   if (src?.channel === "opacity") {
//     return paint["fill-opacity"] ?? paint["line-opacity"] ?? null
//   }

//   return null
// }

function getCompositionLegends(manifest: Manifest | null) {
  return manifest?.composition?.context?.legends ?? []
}

function getLegendPaintSpec(
  manifest: Manifest | null,
  legend: {
    title?: string
    type?: string
    source?: Array<{ view: string; layers?: string[]; channel?: string }>
    resolvedSource?: Array<{ view: string; layers?: string[]; channel?: string }>
  } | null
) {
  const src = legend?.resolvedSource?.[0] ?? legend?.source?.[0]
  const artifact = findArtifactForLegendSource(manifest, src)
  const md = artifact?.metadata ?? {}
  const render = md.render ?? {}
  const paint = render.paint ?? {}

  if (src?.channel === "fill") {
    return paint["fill-color"] ?? null
  }
  if (src?.channel === "stroke") {
    return paint["line-color"] ?? paint["fill-outline-color"] ?? null
  }
  if (src?.channel === "opacity") {
    return paint["fill-opacity"] ?? paint["line-opacity"] ?? null
  }

  return null
}



function getViewManifestEntry(manifest: Manifest | null, viewId: string) {
  return manifest?.views?.find((v) => v.id === viewId) ?? null
}

function getViewTitle(manifest: Manifest | null, viewId: string) {
  const v = getViewManifestEntry(manifest, viewId)
  return v?.context?.title?.text ?? viewId
}

function getViewSubtitle(manifest: Manifest | null, viewId: string) {
  const v = getViewManifestEntry(manifest, viewId)
  return v?.context?.title?.subtitle ?? null
}

function isViewFloating(specObj: any, viewId: string): boolean {
  const views = specObj?.composition?.views
  if (!Array.isArray(views)) return false

  const view = views.find((v: any) => v?.id === viewId)
  return view?.floating === true
}

function hasTimeInteraction(specObj: any): boolean {
  const interactions = specObj?.composition?.interactions
  console.log(!Array.isArray(interactions), "expect true")
  if (!Array.isArray(interactions)) return false

  for (const intr of interactions) {
    console.log(intr?.action?.select?.dim === "time", "expect true")
    if (intr?.action?.select?.dim === "time") return true
  }
  console.log("after loop:", false)
  return false
}

function getTimeBinding(
  specObj: any
): { scope: "view" | "composition"; viewIndex?: number; value: number } | null {
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

function setTimeBinding(specObj: any, nextValue: number): any {
  const next = structuredClone(specObj)
  const binding = getTimeBinding(next)

  if (!binding) return next

  if (binding.scope === "view") {
    const i = binding.viewIndex ?? 0
    next.composition.views[i].time.value = nextValue
  } else {
    next.composition.time.value = nextValue
  }

  return next
}

export default function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [mapLayers, setMapLayers] = useState<MapLayerRuntime[]>([])
  const [geoByLayerKey, setGeoByLayerKey] = useState<Record<string, any>>({})

  const [showAlert, setShowAlert] = useState(false)
  const [spec, setSpec] = useState<any>(null)
  const [appliedSpec, setAppliedSpec] = useState<any>(null)
  const [baseUrl, setBaseUrl] = useState<string>("/artifacts/")
  const [timeValue, setTimeValue] = useState<number>(0)
  const [charts, setCharts] = useState<ChartRuntime[]>([])
  const [showLegend, setShowLegend] = useState(false)
  const [floatingPositions, setFloatingPositions] = useState<
    Record<string, { x: number; y: number }>
  >({})

  const [closedFloatingViews, setClosedFloatingViews] = useState<Record<string, boolean>>({})
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  const debounceRef = useRef<number | null>(null)
  const loadedRef = useRef(false)
  const firstExampleRef = useRef<any>(null)
  const firstSnapshotRef = useRef<FirstSnapshot | null>(null)

  const timeMax = (manifest as any)?.uiState?.timeMax ?? 0
  const hasTimeSlider =
    (hasTimeInteraction(appliedSpec) || !!getTimeBinding(appliedSpec)) &&
    timeMax > 0

  const columns = appliedSpec?.composition?.layout?.columns ?? 1

  const compositionTitle = manifest?.composition?.context?.title?.text ?? "Atmos Interface"

  function handleMapFeatureClick(viewId: string, info: {
    layerId: string
    properties: Record<string, any>
  }) {
    if (viewId !== "view1") return
    if (info.layerId !== "stations") return

    const clickedId = info.properties?.id
    if (clickedId == null) return

    setSelectedStationId(String(clickedId))

    setClosedFloatingViews((prev) => ({
      ...prev,
      view2: false,
    }))

    const runtimeState = {
      selections: {
        view2: {
          id: clickedId,
        },
      },
      timeIndex: timeValue,
    }

    handleApply(appliedSpec ?? spec, runtimeState)
  }
  
  // function SharedLegend({ manifest }: { manifest: Manifest | null }) {
  //   const legend = getCompositionLegend(manifest)
  //   const paintSpec = getLegendPaintSpec(manifest)

  //   if (!legend) return null

  //   const title = legend.title ?? "Legend"

  //   const hasGradientPreview =
  //     paintSpec &&
  //     typeof paintSpec === "object" &&
  //     (
  //       (paintSpec.kind === "color-scheme" && Array.isArray(paintSpec.domain)) ||
  //       (paintSpec.kind === "color-stops" && Array.isArray(paintSpec.stops) && paintSpec.stops.length > 0)
  //     )

  //   return (
  //     <div
  //       style={{
  //         position: "absolute",
  //         top: 60,
  //         right: 12,
  //         zIndex: 20,
  //         // background: getGradientFromScheme(paintSpec.scheme),//"rgba(255,255,255,0.95)",
  //         background: "rgba(255,255,255,0.95)",
  //         border: "1px solid #ddd",
  //         borderRadius: 8,
  //         padding: 10,
  //         minWidth: 180,
  //         boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  //       }}
  //     >
  //       <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{title}</div>

  //       {hasGradientPreview ? (
  //         <>
  //           <div
  //             style={{
  //               height: 12,
  //               borderRadius: 6,
  //               // background: getGradientFromScheme(paintSpec.scheme),
  //               background: getGradientFromPaintSpec(paintSpec, {
  //                 steps: 7,
  //                 direction: "to right",
  //               }),
  //               marginBottom: 6,
  //             }}
  //           />
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "space-between",
  //               fontSize: 11,
  //               color: "#555",
  //             }}
  //           >
  //             <span>
  //               {paintSpec.kind === "color-scheme" && Array.isArray(paintSpec.domain)
  //                 ? paintSpec.domain[0]
  //                 : paintSpec.kind === "color-stops" && paintSpec.stops?.[0]
  //                   ? paintSpec.stops[0].value
  //                   : ""}
  //             </span>
  //             <span>
  //               {paintSpec.kind === "color-scheme" && Array.isArray(paintSpec.domain)
  //                 ? paintSpec.domain[1]
  //                 : paintSpec.kind === "color-stops" && paintSpec.stops?.length
  //                   ? paintSpec.stops[paintSpec.stops.length - 1].value
  //                   : ""}
  //             </span>
  //           </div>
  //         </>
  //       ) : (
  //         <div style={{ fontSize: 11, color: "#666" }}>Legend preview not available yet.</div>
  //       )}
  //     </div>
  //   )
  // }

  function SharedLegend({ manifest }: { manifest: Manifest | null }) {
    const legends = getCompositionLegends(manifest)

    if (!legends.length) return null

    return (
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 12,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {legends.map((legend, i) => {
          const paintSpec = getLegendPaintSpec(manifest, legend)

          const hasGradientPreview =
            paintSpec &&
            typeof paintSpec === "object" &&
            (
              (paintSpec.kind === "color-scheme" && Array.isArray(paintSpec.domain)) ||
              (paintSpec.kind === "color-stops" &&
                Array.isArray(paintSpec.stops) &&
                paintSpec.stops.length > 0)
            )

          return (
            <div
              key={`${legend.title ?? "legend"}-${i}`}
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                minWidth: 180,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                {legend.title ?? "Legend"}
              </div>

              {hasGradientPreview ? (
                <>
                  <div
                    style={{
                      height: 12,
                      borderRadius: 6,
                      background: getGradientFromPaintSpec(paintSpec, {
                        steps: 7,
                        direction: "to right",
                      }),
                      marginBottom: 6,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: "#555",
                    }}
                  >
                    <span>
                      {paintSpec.kind === "color-scheme" && Array.isArray(paintSpec.domain)
                        ? paintSpec.domain[0]
                        : paintSpec.kind === "color-stops" && paintSpec.stops?.[0]
                          ? paintSpec.stops[0].value
                          : ""}
                    </span>
                    <span>
                      {paintSpec.kind === "color-scheme" && Array.isArray(paintSpec.domain)
                        ? paintSpec.domain[1]
                        : paintSpec.kind === "color-stops" && paintSpec.stops?.length
                          ? paintSpec.stops[paintSpec.stops.length - 1].value
                          : ""}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 11, color: "#666" }}>
                  Legend preview not available yet.
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  async function handleApply(nextSpec: any,  runtimeState?: {
    timeIndex?: number
    selections?: Record<string, Record<string, any>>
  }) {
    try {
      const result = await runSpec(nextSpec, "v0.1", runtimeState)
      const nextBaseUrl = result.baseUrl ?? baseUrl

      setBaseUrl(nextBaseUrl)
      setManifest(result.manifest)

      const layers = interpretManifestToMapLayers(result.manifest, nextBaseUrl)
      setMapLayers(layers)
      setGeoByLayerKey({})

      const chartViews = interpretManifestToCharts(result.manifest, nextBaseUrl)
      setCharts(chartViews)

      setAppliedSpec(nextSpec)
      setShowAlert(false)
    } catch (e) {
      console.error(e)
      setShowAlert(true)
    }
  }

  function handleResetLocal() {
    const snap = firstSnapshotRef.current
    if (!snap) return

    setShowAlert(false)
    setAppliedSpec(snap.spec)
    setManifest(snap.manifest)
    setMapLayers(snap.mapLayers)
    setGeoByLayerKey(snap.geoByLayerKey)
    setBaseUrl(snap.baseUrl)

    const binding = getTimeBinding(snap.spec)
    if (binding) setTimeValue(binding.value)
  }

  function onTimeSliderChange(v: number) {
    setTimeValue(v)

    if (!appliedSpec) return

    const nextSpec = setTimeBinding(appliedSpec, v)

    if (getTimeBinding(appliedSpec)) {
      setAppliedSpec(nextSpec)
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      handleApply(nextSpec, { timeIndex: v })
    }, 150)
  }

  const maps = useMemo(() => {
    const byView: Record<string, MapLayerRuntime[]> = {}

    for (const layer of mapLayers) {
      ;(byView[layer.viewId] ??= []).push(layer)
    }

    const entries = Object.entries(byView)
    entries.sort((a, b) => {
      const ai = a[1][0]?.repeat?.index
      const bi = b[1][0]?.repeat?.index

      if (typeof ai === "number" && typeof bi === "number") return ai - bi
      return a[0].localeCompare(b[0])
    })

    return entries.map(([viewId, layers]) => ({ viewId, layers }))
  }, [mapLayers])

  const tiles = useMemo(() => {
    const out: Array<
      | { type: "map"; viewId: string; layers: MapLayerRuntime[] }
      | { type: "chart"; viewId: string; url: string }
    > = []

    for (const m of maps) {
      out.push({ type: "map", viewId: m.viewId, layers: m.layers })
    }

    for (const c of charts) {
      out.push({ type: "chart", viewId: c.viewId, url: c.url })
    }

    return out
  }, [maps, charts])

  const gridTiles = useMemo(() => {
    return tiles.filter((t) => !isViewFloating(appliedSpec, t.viewId))
  }, [tiles, appliedSpec])

  const floatingTiles = useMemo(() => {
    return tiles.filter((t) => isViewFloating(appliedSpec, t.viewId))
  }, [tiles, appliedSpec])

  const visibleFloatingTiles = useMemo(() => {
    return floatingTiles.filter((t) => !closedFloatingViews[t.viewId])
  }, [floatingTiles, closedFloatingViews])

  useEffect(() => {
    if (!appliedSpec) return
    const binding = getTimeBinding(appliedSpec)
    if (!binding) return
    setTimeValue(binding.value)
  }, [appliedSpec])

  useEffect(() => {
    if (!mapLayers.length) {
      setGeoByLayerKey({})
      return
    }

    let cancelled = false

    Promise.all(
      mapLayers.map(async (layer) => {
        const geo = await fetch(layer.url).then((r) => r.json())
        return [layer.key, geo] as const
      })
    )
      .then((pairs) => {
        if (cancelled) return

        const next: Record<string, any> = {}
        for (const [key, geo] of pairs) next[key] = geo
        setGeoByLayerKey(next)
      })
      .catch((e) => {
        console.error("Failed to fetch map layers:", e)
      })

    return () => {
      cancelled = true
    }
  }, [mapLayers])

  useEffect(() => {
  const views = appliedSpec?.composition?.views
  if (!Array.isArray(views)) return

  const initialClosed: Record<string, boolean> = {}

  for (const v of views) {
    if (v?.floating === true && typeof v.id === "string") {
      initialClosed[v.id] = true
    }
  }

  setClosedFloatingViews((prev) => {
    // preserve any view that the user already reopened/closed later
    if (Object.keys(prev).length > 0) return prev
    return initialClosed
  })
}, [appliedSpec])

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    fetch(firstExamplePath)
      .then((r) => r.json())
      .then((data) => {
        firstExampleRef.current = data
        setSpec(data)
        setAppliedSpec(data)

        // const binding = getTimeBinding(data)
        // if (binding) setTimeValue(binding.value)

        // handleApply(data)
        const binding = getTimeBinding(data)
        if (binding) setTimeValue(binding.value)

        handleApply(
          data,
          binding ? { timeIndex: binding.value } : undefined
        )
      })
      .catch((e) => {
        console.error("Failed to load example spec:", e)
      })
  }, [])

  useEffect(() => {
    if (firstSnapshotRef.current) return
    if (!firstExampleRef.current) return
    if (!manifest) return
    if (!mapLayers.length) return

    const allLoaded =
      Object.keys(geoByLayerKey).length === mapLayers.length &&
      mapLayers.every((l) => geoByLayerKey[l.key])

    if (!allLoaded) return

    firstSnapshotRef.current = {
      spec: firstExampleRef.current,
      manifest,
      mapLayers,
      geoByLayerKey,
      baseUrl,
    }
  }, [manifest, mapLayers, geoByLayerKey, baseUrl])

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [])

  const headerH = 48
  const gap = 8
  const pad = 10

  // const n = maps.length
  // const n = tiles.length
  const n = gridTiles.length
  const cols = Math.max(1, columns)
  const rows = Math.max(1, Math.ceil(n / cols))

  const gridH = `calc(100vh - ${headerH}px)`
  const tileH = `calc((100vh - ${headerH}px - ${pad * 2}px - ${(rows - 1) * gap}px) / ${rows})`
  console.log("hasTimeSlider", hasTimeSlider, timeMax)
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {showLegend && <SharedLegend manifest={manifest} />}
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "grid",
          gridTemplateRows: "48px 1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            borderBottom: "1px solid #eee",
            position: "relative",
            minHeight: 48,
          }}
        >
          {/* Centered title */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 700,
              pointerEvents: "none",
            }}
          >
            {compositionTitle}
          </div>

          {/* Right side controls */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 30,
            }}
          >
            {/* Slider FIRST (so it stays left of button) */}
            {hasTimeSlider && (
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ fontSize: 12, color: "#555" }}>t</div>
                <input
                  type="range"
                  min={0}
                  max={timeMax}
                  step={1}
                  value={timeValue}
                  onChange={(e) => onTimeSliderChange(Number(e.target.value))}
                  style={{ width: 100 }}
                />
                <div style={{ fontSize: 12, color: "#555", width: 30, textAlign: "right" }}>
                  {timeValue}
                </div>
              </div>
            )}

            {/* Button LAST → far right */}
            <button
              onClick={() => setShowLegend((prev) => !prev)}
              style={{
                padding: "4px 10px",
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {showLegend ? "Hide Legend" : "Show Legend"}
            </button>
          </div>
        </div>

        <div
          style={{
            height: gridH,
            width: "100vw",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap,
            padding: pad,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {gridTiles.map((t) => {
            // const rep = t.type === "map" ? t.layers[0]?.repeat : null

            return (
              <div
                key={t.viewId}
                style={{
                  minHeight: tileH,
                  border: "1px solid #eee",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateRows: "28px 1fr",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderBottom: "1px solid #eee",
                    fontSize: 12,
                    color: "#555",
                  }}
                >
                    <div
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid #eee",
                        fontSize: 12,
                        color: "#555",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontWeight: 600, color: "#222" }}>
                        {getViewTitle(manifest, t.viewId)}
                      </div>

                      {getViewSubtitle(manifest, t.viewId) && (
                        <div style={{ fontSize: 11, color: "#666" }}>
                          {getViewSubtitle(manifest, t.viewId)}
                        </div>
                      )}
                    </div>
                </div>

                {t.type === "map" ? (
                  <AtmosMap
                    layers={t.layers
                      .filter((l) => geoByLayerKey[l.key])
                      .map((l) => ({
                        ...l,
                        geojson: geoByLayerKey[l.key],
                      }))}
                    selectedStationId={selectedStationId}
                    onFeatureClick={(info) => handleMapFeatureClick(t.viewId, info)}
                  />
                ) : (
                  <AtmosChart url={t.url} />
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      {visibleFloatingTiles.map((t, i) => {

        const title = getViewTitle(manifest, t.viewId)

        const pos = floatingPositions[t.viewId] ?? {
          x: window.innerWidth - 460,
          y: 64 + i * 320,
        }

        return (
          <FloatingPanel
            key={`floating-${t.viewId}`}
            viewId={t.viewId}
            title={title}
            initialX={pos.x}
            initialY={pos.y}
            onMove={(viewId, nextPos) => {
              setFloatingPositions((prev) => ({
                ...prev,
                [viewId]: nextPos,
              }))
            }}
            onClose={(viewId) => {
              setClosedFloatingViews((prev) => ({
                ...prev,
                [viewId]: true,
              }))
            }}
          >
            {t.type === "map" ? (
              <AtmosMap
                layers={t.layers
                  .filter((l) => geoByLayerKey[l.key])
                  .map((l) => ({
                    ...l,
                    geojson: geoByLayerKey[l.key],
                  }))}
                onFeatureClick={(info) => handleMapFeatureClick(t.viewId, info)}
              />
            ) : (
              <AtmosChart url={t.url} />
            )}
          </FloatingPanel>
        )
      })}

      <Editor
        initialData={spec}
        appliedData={appliedSpec}
        resetData={firstExampleRef.current}
        onResetLocal={handleResetLocal}
        onApply={handleApply}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
    </div>
  )
}