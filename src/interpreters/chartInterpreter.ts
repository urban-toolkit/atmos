export type ChartRuntime = {
  viewId: string
  url: string
}

export function interpretManifestToCharts(manifest: any, baseUrl: string): ChartRuntime[] {
  const charts: ChartRuntime[] = []

  for (const art of manifest?.artifacts ?? []) {
    if (art.format !== "vega-lite") continue

    charts.push({
      viewId: art.metadata?.viewId ?? art.id,
      url: baseUrl + art.path,
    })
  }

  return charts
}