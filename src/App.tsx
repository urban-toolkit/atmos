import { useEffect, useMemo, useRef, useState } from "react"
import maplibregl, { Map } from "maplibre-gl"
import Editor from "./components/editor/Editor"
import { runSpec } from "./api/api"


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

function bboxFromFeatureCollection(fc: any): [number, number, number, number] | null {
  if (!fc || fc.type !== "FeatureCollection" || !Array.isArray(fc.features)) return null

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const pushCoord = (x: number, y: number) => {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  const walk = (coords: any) => {
    if (!coords) return
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      pushCoord(coords[0], coords[1])
      return
    }
    for (const c of coords) walk(c)
  }

  for (const f of fc.features) {
    if (f?.geometry?.coordinates) walk(f.geometry.coordinates)
  }

  if (!isFinite(minX)) return null
  return [minX, minY, maxX, maxY]
}

export default function App() {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [tempGeo, setTempGeo] = useState<any>(null)
  const [boundGeo, setBoundGeo] = useState<any>(null)

    const [showAlert, setShowAlert] = useState(false)
    const [spec, setSpec] = useState<any>(null)
    const [baseUrl, setBaseUrl] = useState<string>("/artifacts/") // default for now

    async function handleApply(nextSpec: any) {
      try {
        // setSpec(nextSpec)
        const result = await runSpec(nextSpec, "v0.1")

        // Expecting server to return { manifest, baseUrl }
        setManifest(result.manifest)
        if (result.baseUrl) setBaseUrl(result.baseUrl)

      } catch (e) {
        console.error(e)
        setShowAlert(true)
      }
    }

  const tempUrl = useMemo(() => {
    if (!manifest) return null
    const a = manifest.artifacts.find((x) => x.metadata?.layerId === "temp")
    return a ? `${baseUrl}${a.path}` : null
  }, [manifest, baseUrl])

  const boundUrl = useMemo(() => {
    if (!manifest) return null
    const a = manifest.artifacts.find((x) => x.metadata?.layerId === "bound")
    return a ? `${baseUrl}${a.path}` : null
  }, [manifest, baseUrl])

  useEffect(() => {
    if (!tempUrl) return
    fetch(tempUrl).then((r) => r.json()).then(setTempGeo)
  }, [tempUrl])

  useEffect(() => {
    if (!boundUrl) return
    fetch(boundUrl).then((r) => r.json()).then(setBoundGeo)
  }, [boundUrl])

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-78.9, 38.43],
      zoom: 6,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    fetch("/examples/ex1-1.json")
      .then((r) => r.json())
      .then((data) => {
        setSpec(data)
        handleApply(data)
      })
      .catch((e) => console.error("Failed to load example spec:", e))
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!tempGeo || !boundGeo) return

    const apply = () => {
      // ---- temp mesh (fill) ----
      const TEMP_SRC = "temp-src";
      const TEMP_FILL = "temp-fill";

      if (!map.getSource(TEMP_SRC)) {
        map.addSource(TEMP_SRC, { type: "geojson", data: tempGeo });
      } else {
        (map.getSource(TEMP_SRC) as any).setData(tempGeo);
      }

      const first = tempGeo?.features?.[0]?.properties ?? {};
      const numericKey =
        Object.keys(first).find((k) => typeof first[k] === "number") ?? "value";

      if (!map.getLayer(TEMP_FILL)) {
        map.addLayer({
          id: TEMP_FILL,
          type: "fill",
          source: TEMP_SRC,
          paint: {
            "fill-opacity": 0.65,
            "fill-color": [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", numericKey], 0],
              290, "#2c7bb6",
              291, "#abd9e9",
              292, "#ffffbf",
              293, "#fdae61",
              294, "#d7191c",
            ],
          },
        });
      }

      // ---- boundaries (line) ----
      const BND_SRC = "bnd-src";
      const BND_LINE = "bnd-line";

      if (!map.getSource(BND_SRC)) {
        map.addSource(BND_SRC, { type: "geojson", data: boundGeo });
      } else {
        (map.getSource(BND_SRC) as any).setData(boundGeo);
      }

      if (!map.getLayer(BND_LINE)) {
        map.addLayer({
          id: BND_LINE,
          type: "line",
          source: BND_SRC,
          paint: { "line-width": 1.5, "line-color": "#111" },
        });
      }

      // fit bounds once
      const bb = bboxFromFeatureCollection(boundGeo) || bboxFromFeatureCollection(tempGeo);
      if (bb) {
        map.fitBounds(
          [
            [bb[0], bb[1]],
            [bb[2], bb[3]],
          ],
          { padding: 30, duration: 400 }
        );
      }
    };

    if (!map.isStyleLoaded()) {
      map.once("load", apply);
      return;
    }

    apply();

  }, [tempGeo, boundGeo])

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div style={{ height: "100%", width: "100%", display: "grid", gridTemplateRows: "48px 1fr" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 12px", borderBottom: "1px solid #eee" }}>
          <div style={{ fontWeight: 700 }}>Atmos Interface</div>
          <div style={{ color: "#666" }}>
            {manifest ? `${manifest.kind} • ${manifest.schemaVersion}` : "No run yet"}
          </div>
        </div>
        <div ref={containerRef} />
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