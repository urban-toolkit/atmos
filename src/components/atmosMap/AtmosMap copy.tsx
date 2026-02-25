import { useEffect, useRef } from "react"
import maplibregl, { Map } from "maplibre-gl"
import { schemeToColors, schemeToInterpolator } from "../../helpers/colors"

type AtmosMapProps = {
  tempGeo: any
  boundGeo: any
  tempFill: FillChannel
  tempOpacity?: number
}

type FillScale =
  | { type: "sequential"; scheme?: string; domain?: [number, number]; steps?: number }
  | { type: "sequential"; stops: Array<[number, string]> }

type FillChannel = {
  field: string
  scale: FillScale
}

export default function AtmosMap({tempGeo, boundGeo, tempFill, tempOpacity}: AtmosMapProps) {

  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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

  function buildFillColorExpr(fill: FillChannel) {
    const field = fill.field;

    // handle nodata safely
    const valueExpr: any[] = ["coalesce", ["get", field], 0];

    // Case 1: explicit stops (best)
    if ("stops" in fill.scale) {
      const stops = fill.scale.stops;
      return [
        "interpolate",
        ["linear"],
        valueExpr,
        ...stops.flatMap(([v, c]) => [v, c]),
      ];
    }

    // Case 2: domain + steps (needs a scheme->colors function)
    const domain = fill.scale.domain;
    const steps = fill.scale.steps ?? 7;
    if (!domain) {
      throw new Error(`fill.scale.domain is required when scale.stops is not provided`);
    }

    const [d0, d1] = domain;
    const vals = Array.from({ length: steps }, (_, i) => d0 + (i * (d1 - d0)) / (steps - 1));

    const colors = schemeToColors(fill.scale.scheme ?? "RdYlBu", steps); // you implement
    return [
      "interpolate",
      ["linear"],
      valueExpr,
      ...vals.flatMap((v, i) => [v, colors[i]]),
    ];
  }

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

      if (!map.getLayer(TEMP_FILL)) {
        const fillColorExpr = buildFillColorExpr(tempFill);

        map.addLayer({
          id: TEMP_FILL,
          type: "fill",
          source: TEMP_SRC,
          paint: {
            "fill-opacity": tempOpacity ?? 0.65,
            "fill-color": fillColorExpr,
          },
        })
        // map.addLayer({
        //   id: TEMP_FILL,
        //   type: "fill",
        //   source: TEMP_SRC,
        //   paint: {
        //     "fill-opacity": 0.65,
        //     "fill-color": [
        //       "interpolate",
        //       ["linear"],
        //       ["coalesce", ["get", numericKey], 0],
        //       290, "#2c7bb6",
        //       291, "#abd9e9",
        //       292, "#ffffbf",
        //       293, "#fdae61",
        //       294, "#d7191c",
        //     ],
        //   },
        // });
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
      map.once("load", apply)
      return;
    }

    apply()

  }, [tempGeo, boundGeo, tempFill, tempOpacity])

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <div ref={containerRef} />
}