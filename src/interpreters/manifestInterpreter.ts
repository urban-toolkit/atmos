export type Manifest = {
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

export type MapLayerRuntime = {
  layerId: string
  artifactId: string
  url: string
  format: "geojson"
  role: "field" | "boundary" | "unknown"
  render?: {
    renderer: "maplibre"
    layerType: "fill" | "line" | "circle"
    paint?: Record<string, any>
    layout?: Record<string, any>
  }
}

// export type MapLayerRuntime = {
//   layerId: string
//   artifactId: string
//   url: string
//   format: "geojson"
//   role: "field" | "boundary" | "unknown"
// }

function joinUrl(baseUrl: string, path: string) {
  const b = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
  const p = path.startsWith("/") ? path.slice(1) : path
  return `${b}${p}`
}

export function interpretManifestToMapLayers(manifest: Manifest, baseUrl: string): MapLayerRuntime[] {
  return manifest.artifacts
    .filter((a) => a.format === "geojson")
    .map((a) => {
      const layerId = a.metadata?.layerId ?? a.id

      const role =
        a.metadata?.role === "boundary" ? "boundary" :
        a.metadata?.role === "field" ? "field" :
        (layerId.toLowerCase().includes("bound") ? "boundary" : "unknown")

      return {
        layerId,
        artifactId: a.id,
        url: joinUrl(baseUrl, a.path),
        format: "geojson",
        role,
        render: a.metadata?.render
      }
    })
}