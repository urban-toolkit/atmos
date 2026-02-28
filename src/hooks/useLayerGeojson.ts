import { useEffect, useState } from "react"
import type { MapLayerRuntime } from "../interpreters/manifestInterpreter"

export function useLayerGeojson(mapLayers: MapLayerRuntime[]) {
  const [geoByLayerKey, setGeoByLayerKey] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!mapLayers.length) return

    const controller = new AbortController()
    const { signal } = controller

    Promise.all(
      mapLayers.map(async (l) => {
        const geo = await fetch(l.url, { signal }).then((r) => r.json())
        return [l.key, geo] as const
      })
    )
      .then((pairs) => {
        const next: Record<string, any> = {}
        for (const [k, geo] of pairs) next[k] = geo
        setGeoByLayerKey(next)
      })
      .catch((e) => {
        if (e?.name === "AbortError") return
        console.error("Failed to fetch map layers:", e)
      })

    return () => controller.abort()
  }, [mapLayers])

  return { geoByLayerKey, setGeoByLayerKey }
}