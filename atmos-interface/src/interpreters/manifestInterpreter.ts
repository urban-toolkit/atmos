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
  key: string
  viewId: string
  layerId: string
  artifactId: string
  url: string
  format: "geojson"
  role: "field" | "boundary" | "unknown"
  render?: any
  geometryType?: string
  repeat?: any
  glyph?: any
  mask?: any
}

function joinUrl(baseUrl: string, path: string) {
  const b = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
  const p = path.startsWith("/") ? path.slice(1) : path
  return `${b}${p}`
}

export function interpretManifestToMapLayers(manifest: Manifest, baseUrl: string): MapLayerRuntime[] {
  return manifest.artifacts
    .filter((a) => a.format === "geojson")
    .map((a) => {
      const viewId = (a.metadata?.viewId as string | undefined) ?? "view"
      const layerId = (a.metadata?.layerId as string | undefined) ?? a.id
      const key = `${viewId}:${layerId}`

      const role =
        a.metadata?.role === "boundary"
          ? "boundary"
          : a.metadata?.role === "field"
          ? "field"
          : layerId.toLowerCase().includes("bound")
          ? "boundary"
          : "unknown"

      return {
        key,
        viewId,
        layerId,
        artifactId: a.id,
        url: joinUrl(baseUrl, a.path),
        format: "geojson",
        role,
        render: a.metadata?.render,
        geometryType: a.metadata?.geometryType,
        repeat: a.metadata?.repeat,
        glyph: a.metadata?.glyph,
        mask: a.metadata?.mask
      }
    })
}