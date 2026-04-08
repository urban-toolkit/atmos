import { useRef } from "react"

type Props = {
  viewId: string
  title: string
  initialX: number
  initialY: number
  onMove: (viewId: string, pos: { x: number; y: number }) => void
  onClose: (viewId: string) => void
  children: React.ReactNode
}

export default function FloatingPanel({
  viewId,
  title,
  initialX,
  initialY,
  onMove,
  onClose,
  children,
}: Props) {
  const draggingRef = useRef(false)
  const offsetRef = useRef({ dx: 0, dy: 0 })

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    draggingRef.current = true
    offsetRef.current = {
      dx: e.clientX - initialX,
      dy: e.clientY - initialY,
    }

    const onMouseMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return
      onMove(viewId, {
        x: ev.clientX - offsetRef.current.dx,
        y: ev.clientY - offsetRef.current.dy,
      })
    }

    const onMouseUp = () => {
      draggingRef.current = false
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      style={{
        position: "absolute",
        left: initialX,
        top: initialY,
        width: 450,
        height: 400,
        border: "1px solid #ddd",
        borderRadius: 10,
        background: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        overflow: "hidden",
        zIndex: 20,
        display: "grid",
        gridTemplateRows: "32px 1fr",
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          padding: "6px 10px",
          borderBottom: "1px solid #eee",
          fontSize: 12,
          color: "#555",
          background: "#fafafa",
          cursor: "move",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span>{title}</span>
        <button
          onClick={() => onClose(viewId)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            color: "#666",
          }}
          title="Close"
        >
          ×
        </button>
      </div>

      <div style={{ minHeight: 0 }}>{children}</div>
    </div>
  )
}