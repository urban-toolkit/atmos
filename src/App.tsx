import { useEffect, useMemo, useState, useRef } from "react"
import { runSpec } from "./api/api"

import { interpretManifestToMapLayers } from "./interpreters/manifestInterpreter"
import type { MapLayerRuntime } from "./interpreters/manifestInterpreter"

import Editor from "./components/editor/Editor"
import AtmosMap from "./components/atmosMap/AtmosMap"

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

// const firstExamplePath = "/examples/ex1-0-wind.json"
// const firstExamplePath = "/examples/ex1-0-stations.json"
// const firstExamplePath = "/examples/ex1-0-isoband.json"
// const firstExamplePath = "/examples/ex1-1-mesh-rain.json"
const firstExamplePath = "/examples/ex1-0-mesh.json"
// const firstExamplePath = "/examples/ex1-1-isoband-rain.json"
// const firstExamplePath = "/examples/ex1-1-isoband-rain-stations.json"

export default function App() {

  const [manifest, setManifest] = useState<Manifest | null>(null)
  

  const [mapLayers, setMapLayers] = useState<MapLayerRuntime[]>([])
  const [geoByLayerKey, setGeoByLayerKey] = useState<Record<string, any>>({})

  const [showAlert, setShowAlert] = useState(false)
  const [spec, setSpec] = useState<any>(null)
  const [appliedSpec, setAppliedSpec] = useState<any>(null)
  const [baseUrl, setBaseUrl] = useState<string>("/artifacts/") // default for now

  const loadedRef = useRef(false)
  const firstExampleRef = useRef<any>(null)

  const firstSnapshotRef = useRef<null | {
    spec: any
    manifest: Manifest
    mapLayers: MapLayerRuntime[]
    geoByLayerKey: Record<string, any>
    baseUrl: string
  }>(null)

  function handleResetLocal() {
    const snap = firstSnapshotRef.current
    if (!snap) return

    setShowAlert(false)
    setAppliedSpec(snap.spec)

    setBaseUrl(snap.baseUrl)
    setManifest(snap.manifest)
    setMapLayers(snap.mapLayers)
    setGeoByLayerKey(snap.geoByLayerKey)
  }

  async function handleApply(nextSpec: any) {
    try {
      const result = await runSpec(nextSpec, "v0.1")

      // const effectiveBaseUrl = result.baseUrl ?? baseUrl
      
      const nextBaseUrl = result.baseUrl ?? baseUrl
      setBaseUrl(nextBaseUrl)

      setManifest(result.manifest)
      // if (result.baseUrl) setBaseUrl(result.baseUrl)
      

      const layers = interpretManifestToMapLayers(result.manifest, nextBaseUrl)
      setMapLayers(layers)

      setAppliedSpec(nextSpec)

    } catch (e) {
      console.error(e)
      setShowAlert(true)
    }
  }

  const maps = useMemo(() => {
    const byView: Record<string, MapLayerRuntime[]> = {}
    for (const l of mapLayers) {
      (byView[l.viewId] ??= []).push(l)
    }

    // stable ordering: by timestep if repeat.index exists, else by viewId
    const entries = Object.entries(byView)
    entries.sort((a, b) => {
      const ai = a[1][0]?.repeat?.index
      const bi = b[1][0]?.repeat?.index
      if (typeof ai === "number" && typeof bi === "number") return ai - bi
      return a[0].localeCompare(b[0])
    })

    return entries.map(([viewId, layers]) => ({ viewId, layers }))
  }, [mapLayers])

  const columns = appliedSpec?.composition?.layout?.columns ?? 1

  useEffect(() => {
    if (!mapLayers.length) return

    let cancelled = false

    Promise.all(
      mapLayers.map(async (l) => {
        const geo = await fetch(l.url).then((r) => r.json())
        return [l.key, geo] as const
      })
    )
      .then((pairs) => {
        if (cancelled) return
        const next: Record<string, any> = {}
        for (const [k, geo] of pairs) next[k] = geo
        setGeoByLayerKey(next)
      })
      .catch((e) => console.error("Failed to fetch map layers:", e))

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
        handleApply(data)
      })
      .catch((e) => console.error("Failed to load example spec:", e))
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

  const headerH = 48
  const gap = 8
  const pad = 10

  const n = maps.length
  const cols = Math.max(1, columns)
  const rows = Math.max(1, Math.ceil(n / cols))

  // height available for the grid area (below the header)
  const gridH = `calc(100vh - ${headerH}px)`

  // tile height: distribute available height across rows (minus gaps/padding)
  const tileH = `calc((100vh - ${headerH}px - ${pad * 2}px - ${(rows - 1) * gap}px) / ${rows})`

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ height: "100%", width: "100%", display: "grid", gridTemplateRows: "48px 1fr" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 12px", borderBottom: "1px solid #eee" }}>
          <div style={{ fontWeight: 700}}>Atmos Interface</div>
          <div style={{ color: "#666" }}>
            {manifest ? `${manifest.kind} • ${manifest.schemaVersion}` : "No run yet"}
          </div>
        </div>
        {/* <AtmosMap
          layers={mapLayers.map((l) => ({ ...l, geojson: geoByLayerKey[l.layerId] }))}
        /> */}

        <div
          style={{
            height: gridH,
            width: "100vw",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap,
            padding: pad,
            boxSizing: "border-box",
            overflow: "auto", // no scrollbars
          }}
        >
          {maps.map((m) => (
            <div
              key={m.viewId}
              style={{
                minHeight: tileH,
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
                display: "grid",
                gridTemplateRows: "28px 1fr",
              }}
            >
              <div style={{ padding: "6px 10px", borderBottom: "1px solid #eee", fontSize: 12, color: "#555" }}>
                {m.layers[0]?.repeat?.index != null ? `t = ${m.layers[0].repeat.index}` : m.viewId}
              </div>

              <AtmosMap
                layers={m.layers.map((l) => ({ ...l, geojson: geoByLayerKey[l.key] }))}
              />
            </div>
          ))}
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