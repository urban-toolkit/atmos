import { useEffect, useRef } from "react"
import embed from "vega-embed"

type Props = {
  url: string
}

export default function AtmosChart({ url }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    let cancelled = false

    embed(ref.current, url, { actions: false })
      .catch((e) => {
        if (!cancelled) console.error("Failed to render chart:", e)
      })

    return () => {
      cancelled = true
      if (ref.current) ref.current.innerHTML = ""
    }
  }, [url])

  return <div style={{ width: "100%", height: "100%", overflow: "auto" }} ref={ref} />
}