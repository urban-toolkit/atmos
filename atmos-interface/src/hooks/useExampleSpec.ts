import { useEffect, useState } from "react"

export function useExampleSpec(path: string) {
  const [initialSpec, setInitialSpec] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(path)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setInitialSpec(data)
        setLoaded(true)
      })
      .catch((e) => console.error("Failed to load example spec:", e))
    return () => { cancelled = true }
  }, [path])

  return { initialSpec, loaded }
}