import { useEffect, useMemo, useState } from "react"
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

export default function App() {

  const [manifest, setManifest] = useState<Manifest | null>(null)
  

  const [mapLayers, setMapLayers] = useState<MapLayerRuntime[]>([])
  const [geoByLayerId, setGeoByLayerId] = useState<Record<string, any>>({})

  const [showAlert, setShowAlert] = useState(false)
  const [spec, setSpec] = useState<any>(null)
  const [baseUrl, setBaseUrl] = useState<string>("/artifacts/") // default for now

  // async function handleApply(nextSpec: any) {
  //   try {
  //     // setSpec(nextSpec)
  //     const result = await runSpec(nextSpec, "v0.1")

  //     // Expecting server to return { manifest, baseUrl }
  //     setManifest(result.manifest)
  //     if (result.baseUrl) setBaseUrl(result.baseUrl)
      
  //       const layers = interpretManifestToMapLayers(result.manifest, result.baseUrl ?? baseUrl)
  //     setMapLayers(layers)

  //   } catch (e) {
  //     console.error(e)
  //     setShowAlert(true)
  //   }
  // }

  async function handleApply(nextSpec: any) {
    try {
      const result = await runSpec(nextSpec, "v0.1")

      const effectiveBaseUrl = result.baseUrl ?? baseUrl  // compute once

      setManifest(result.manifest)
      if (result.baseUrl) setBaseUrl(result.baseUrl)

      const layers = interpretManifestToMapLayers(result.manifest, effectiveBaseUrl)
      setMapLayers(layers)

    } catch (e) {
      console.error(e)
      setShowAlert(true)
    }
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
    fetch("/examples/ex1-0-0.json")
      .then((r) => r.json())
      .then((data) => {
        setSpec(data)
        handleApply(data)
      })
      .catch((e) => console.error("Failed to load example spec:", e))
  }, [])

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ height: "100%", width: "100%", display: "grid", gridTemplateRows: "48px 1fr" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 12px", borderBottom: "1px solid #eee" }}>
          <div style={{ fontWeight: 700}}>Atmos Interface</div>
          <div style={{ color: "#666" }}>
            {manifest ? `${manifest.kind} • ${manifest.schemaVersion}` : "No run yet"}
          </div>
        </div>
        {/* <AtmosMap tempGeo={tempGeo} boundGeo={boundGeo}/> */}
        <AtmosMap
          layers={mapLayers.map((l) => ({ ...l, geojson: geoByLayerId[l.layerId] }))}
        />
      </div>

      <Editor
        initialData={spec}
        onApply={handleApply}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
    </div>
  )
}