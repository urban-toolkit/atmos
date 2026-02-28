import { useCallback, useState } from "react"
import { runSpec } from "../api/api"
import { interpretManifestToMapLayers } from "../interpreters/manifestInterpreter"
import type { MapLayerRuntime } from "../interpreters/manifestInterpreter"
import type { Manifest, RunSpecResult } from "../types/atmos"

export function useRunAtmosSpec(initialBaseUrl = "/artifacts/") {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [mapLayers, setMapLayers] = useState<MapLayerRuntime[]>([])
  const [baseUrl, setBaseUrl] = useState(initialBaseUrl)
  const [showAlert, setShowAlert] = useState(false)

  const applySpec = useCallback(async (nextSpec: any) => {
    try {
      const result = (await runSpec(nextSpec, "v0.1")) as RunSpecResult
      const nextBaseUrl = result.baseUrl ?? baseUrl

      setBaseUrl(nextBaseUrl)
      setManifest(result.manifest)

      const layers = interpretManifestToMapLayers(result.manifest, nextBaseUrl)
      setMapLayers(layers)

      setShowAlert(false)
      return { ok: true as const, result }
    } catch (e) {
      console.error(e)
      setShowAlert(true)
      return { ok: false as const, error: e }
    }
  }, [baseUrl])

  return { manifest, mapLayers, baseUrl, showAlert, setShowAlert, applySpec, setBaseUrl }
}