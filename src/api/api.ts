// src/api.ts
export async function runSpec(
  spec: unknown,
  version: string,
  runtimeState?: { timeIndex?: number }
) {
  const res = await fetch(`/api/run?version=${encodeURIComponent(version)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spec,
      runtimeState,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Server error ${res.status}`)
  }

  return res.json()
}