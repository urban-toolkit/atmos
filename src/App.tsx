import { useEffect, useState, useRef } from "react"
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

// const firstExamplePath = "/examples/ex1-0-1.json"
const firstExamplePath = "/examples/ex1-0-mesh.json"

export default function App() {

  const [manifest, setManifest] = useState<Manifest | null>(null)
  

  const [mapLayers, setMapLayers] = useState<MapLayerRuntime[]>([])
  const [geoByLayerId, setGeoByLayerId] = useState<Record<string, any>>({})

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
    geoByLayerId: Record<string, any>
    baseUrl: string
  }>(null)

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

  function handleResetLocal() {
    const snap = firstSnapshotRef.current
    if (!snap) return

    setShowAlert(false)
    setAppliedSpec(snap.spec)

    setBaseUrl(snap.baseUrl)
    setManifest(snap.manifest)
    setMapLayers(snap.mapLayers)
    setGeoByLayerId(snap.geoByLayerId)
  }

  useEffect(() => {
    if (!mapLayers.length) return

    let cancelled = false

    Promise.all(
      mapLayers.map(async (l) => {
        console.log(l)
        const geo = await fetch(l.url).then((r) => r.json())
        return [l.layerId, geo] as const
      })
    ).then((pairs) => {
      if (cancelled) return
      const next: Record<string, any> = {}
      for (const [layerId, geo] of pairs) next[layerId] = geo
      setGeoByLayerId(next)
    }).catch((e) => console.error("Failed to fetch map layers:", e))

    return () => { cancelled = true }
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

    // wait until geojsons are all fetched
    const allLoaded =
      Object.keys(geoByLayerId).length === mapLayers.length &&
      mapLayers.every((l) => geoByLayerId[l.layerId])

    if (!allLoaded) return

    firstSnapshotRef.current = {
      spec: firstExampleRef.current,
      manifest,
      mapLayers,
      geoByLayerId,
      baseUrl,
    }
  }, [manifest, mapLayers, geoByLayerId, baseUrl])

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ height: "100%", width: "100%", display: "grid", gridTemplateRows: "48px 1fr" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 12px", borderBottom: "1px solid #eee" }}>
          <div style={{ fontWeight: 700}}>Atmos Interface</div>
          <div style={{ color: "#666" }}>
            {manifest ? `${manifest.kind} • ${manifest.schemaVersion}` : "No run yet"}
          </div>
        </div>
        <AtmosMap
          layers={mapLayers.map((l) => ({ ...l, geojson: geoByLayerId[l.layerId] }))}
        />
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