type AppHeaderProps = {
  title: string
  manifestLabel: string
  hasTimeSlider: boolean
  timeValue: number
  timeMax: number
  onTimeChange: (v: number) => void
}

export function AppHeader(props: AppHeaderProps) {
  const { title, manifestLabel, hasTimeSlider, timeValue, timeMax, onTimeChange } = props

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 12px", borderBottom: "1px solid #eee" }}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ color: "#666" }}>{manifestLabel}</div>

      {hasTimeSlider && (
        <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#555" }}>t</div>
          <input
            type="range"
            min={0}
            max={timeMax}
            step={1}
            value={timeValue}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            style={{ width: 220 }}
          />
          <div style={{ fontSize: 12, color: "#555", width: 60, textAlign: "right" }}>
            {timeValue} / {timeMax}
          </div>
        </div>
      )}
    </div>
  )
}