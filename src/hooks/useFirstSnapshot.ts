import { useEffect, useRef } from "react"
import type { Manifest } from "../types/atmos"
import type { MapLayerRuntime } from "../interpreters/manifestInterpreter"

export function useFirstSnapshot(args: {
  initialSpec: any
  manifest: Manifest | null
  mapLayers: MapLayerRuntime[]
  geoByLayerKey: Record<string, any>
  baseUrl: string
}) {
  const ref = useRef<null | {
    spec: any
    manifest: Manifest
    mapLayers: MapLayerRuntime[]
    geoByLayerKey: Record<string, any>
    baseUrl: string
  }>(null)

  useEffect(() => {
    if (ref.current) return
    const { initialSpec, manifest, mapLayers, geoByLayerKey, baseUrl } = args
    if (!initialSpec || !manifest || !mapLayers.length) return

    const allLoaded =
      Object.keys(geoByLayerKey).length === mapLayers.length &&
      mapLayers.every((l) => geoByLayerKey[l.key])

    if (!allLoaded) return

    ref.current = { spec: initialSpec, manifest, mapLayers, geoByLayerKey, baseUrl }
  }, [args.initialSpec, args.manifest, args.mapLayers, args.geoByLayerKey, args.baseUrl])

  return ref
}