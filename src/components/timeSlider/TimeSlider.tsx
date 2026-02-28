import { useEffect, useMemo, useRef, useState } from "react"

export type TimeStep = {
  /** stable id (use viewId) */
  id: string
  /** 0..N-1 order index */
  index: number
  /** label shown to the user (e.g., "t = 3" or timestamp) */
  label: string
}

type Props = {
  steps: TimeStep[]
  valueId: string | null
  onChangeId: (id: string) => void

  /** optional UX */
  disabled?: boolean
  title?: string
  showTicks?: boolean
  compact?: boolean
}

/**
 * Controlled slider bound to (viewId) via `valueId`.
 * It only talks in terms of step ids; App decides what "selecting a step" means.
 */
export default function TimeSlider({
  steps,
  valueId,
  onChangeId,
  disabled,
  title = "Time",
  showTicks = false,
  compact = false,
}: Props) {
  const byId = useMemo(() => new Map(steps.map((s) => [s.id, s])), [steps])
  const min = 0
  const max = Math.max(0, steps.length - 1)

  const valueIndex = useMemo(() => {
    if (!steps.length) return 0
    if (valueId && byId.has(valueId)) return byId.get(valueId)!.index
    return 0
  }, [steps.length, valueId, byId])

  // local UI value so dragging feels smooth, even if App changes are heavy
  const [uiIndex, setUiIndex] = useState(valueIndex)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!draggingRef.current) setUiIndex(valueIndex)
  }, [valueIndex])

  const current = steps[uiIndex]

  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12,
        pointerEvents: "none", // allow maps to receive interactions except the slider itself
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          margin: "0 auto",
          maxWidth: 680,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: compact ? "8px 10px" : "10px 12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12 }}>{title}</div>
          <div style={{ fontSize: 12, color: "#555" }}>
            {steps.length ? current?.label : "—"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginTop: 8 }}>
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={uiIndex}
            disabled={disabled || steps.length <= 1}
            onMouseDown={() => (draggingRef.current = true)}
            onMouseUp={() => (draggingRef.current = false)}
            onTouchStart={() => (draggingRef.current = true)}
            onTouchEnd={() => (draggingRef.current = false)}
            onChange={(e) => {
              const next = Number(e.target.value)
              setUiIndex(next)
              const nextId = steps[next]?.id
              if (nextId) onChangeId(nextId)
            }}
            style={{ width: "100%" }}
          />

          <div style={{ fontSize: 12, color: "#666", minWidth: 52, textAlign: "right" }}>
            {steps.length ? `${uiIndex + 1}/${steps.length}` : "0/0"}
          </div>
        </div>

        {showTicks && steps.length > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#888" }}>
            <span>{steps[0].label}</span>
            <span>{steps[steps.length - 1].label}</span>
          </div>
        )}
      </div>
    </div>
  )
}