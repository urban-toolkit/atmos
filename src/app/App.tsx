import { useEffect, useMemo, useRef, useState } from "react"
import { runSpec } from "../api/api"

import { interpretManifestToMapLayers } from "../interpreters/manifestInterpreter"
import type { MapLayerRuntime } from "../interpreters/manifestInterpreter"

import Editor from "../components/editor/Editor"
import AtmosMap from "../components/atmosMap/AtmosMap"
import { interpretManifestToCharts } from "../interpreters/chartInterpreter"
import type { ChartRuntime } from "../interpreters/chartInterpreter"
import AtmosChart from "../components/chart/AtmosChart"

type Manifest = {
  kind: string
  schemaVersion: string
  artifacts: Array<{
    id: string
    format: string
    path: string
    producerStep: string
    metadata?: Record<string, any>
  }>
}

// const firstExamplePath = "/examples/ex1-0-mesh-t2mF.json"
// const firstExamplePath = "/examples/ex1-0-isoband-rain.json"
// const firstExamplePath = "/examples/ex1-0-mesh-t2m-range.json"
// const firstExamplePath = "/examples/ex2-0-isoline-slp.json"
// const firstExamplePath = "/examples/ex2-0-wind-arrows.json"
// const firstExamplePath = "/examples/ex2-0-wind-barbs.json"
// const firstExamplePath = "/examples/ex3-0-stations.json"
// const firstExamplePath = "/examples/ex1-0-isoband-rain-slider.json"
// const firstExamplePath = "/examples/ex4-1-ens.json"
// const firstExamplePath = "/examples/ex4-3-ens-rain.json"
// const firstExamplePath = "/examples/ex4-4-ens-rain.json"
// const firstExamplePath = "/examples/ex4-5-ens-prob.json"
// const firstExamplePath = "/examples/ex4-6-ens-qtl.json"

const firstExamplePath = "/examples/ex3-1-obs-frcst.json"
type FirstSnapshot = {
  spec: any
  manifest: Manifest
  mapLayers: MapLayerRuntime[]
  geoByLayerKey: Record<string, any>
  baseUrl: string
}

function hasTimeInteraction(specObj: any): boolean {
  const interactions = specObj?.composition?.interactions
  if (!Array.isArray(interactions)) return false

  for (const intr of interactions) {
    if (intr?.action?.select?.dim === "time") return true
  }
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

  const debounceRef = useRef<number | null>(null)
  const loadedRef = useRef(false)
  const firstExampleRef = useRef<any>(null)
  const firstSnapshotRef = useRef<FirstSnapshot | null>(null)

  const timeMax = (manifest as any)?.uiState?.timeMax ?? 0
  const hasTimeSlider =
    (hasTimeInteraction(appliedSpec) || !!getTimeBinding(appliedSpec)) &&
    timeMax > 0

  const columns = appliedSpec?.composition?.layout?.columns ?? 1

  function handleMapFeatureClick(viewId: string, info: {
    layerId: string
    properties: Record<string, any>
  }) {
    if (viewId !== "view1") return
    if (info.layerId !== "stations") return

    const clickedId = info.properties?.id
    if (clickedId == null) return

    const runtimeState: {
      timeIndex?: number
      selections: Record<string, Record<string, any>>
    } = {
      selections: {
        view2: {
          id: clickedId,
        },
      },
    }

    if (typeof timeValue === "number") {
      runtimeState.timeIndex = timeValue
    }

    handleApply(appliedSpec ?? spec, runtimeState)
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
    if (loadedRef.current) return
    loadedRef.current = true

    fetch(firstExamplePath)
      .then((r) => r.json())
      .then((data) => {
        firstExampleRef.current = data
        setSpec(data)
        setAppliedSpec(data)

        const binding = getTimeBinding(data)
        if (binding) setTimeValue(binding.value)

        handleApply(data)
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
  const n = tiles.length
  const cols = Math.max(1, columns)
  const rows = Math.max(1, Math.ceil(n / cols))

  const gridH = `calc(100vh - ${headerH}px)`
  const tileH = `calc((100vh - ${headerH}px - ${pad * 2}px - ${(rows - 1) * gap}px) / ${rows})`

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
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
            justifyContent: "center",
            gap: 12,
            padding: "0 12px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ fontWeight: 700 }}>Atmos Interface</div>

          <div style={{ color: "#666" }}>
            {manifest ? `${manifest.kind} • ${manifest.schemaVersion}` : "No run yet"}
          </div>

          {hasTimeSlider && (
            <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12, color: "#555" }}>t</div>
              <input
                type="range"
                min={0}
                max={timeMax}
                step={1}
                value={timeValue}
                onChange={(e) => onTimeSliderChange(Number(e.target.value))}
                style={{ width: 220 }}
              />
              <div style={{ fontSize: 12, color: "#555", width: 60, textAlign: "right" }}>
                {timeValue} / {timeMax}
              </div>
            </div>
          )}
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
            overflow: "auto",
          }}
        >
          {tiles.map((t) => {
        const rep = t.type === "map" ? t.layers[0]?.repeat : null

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
                  {rep?.type === "timestep"
                    ? `t = ${rep.index}`
                    : rep?.type === "member"
                    ? `member = ${rep.index}`
                    : t.viewId}
                </div>

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
              </div>
            )
          })}
        </div>
      </div>

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