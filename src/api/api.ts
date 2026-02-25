// src/api.ts
export async function runSpec(spec: unknown, version: string) {
  const res = await fetch(`/api/run?version=${encodeURIComponent(version)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spec }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Server error ${res.status}`)
  }

  // Expected response shape:
  // { manifest: {...}, baseUrl: "/artifacts/<runId>/" }
  return res.json()
}