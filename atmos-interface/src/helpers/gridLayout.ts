export function computeGridLayout(n: number, columns: number) {
  const headerH = 48
  const gap = 8
  const pad = 10
  const cols = Math.max(1, columns)
  const rows = Math.max(1, Math.ceil(n / cols))

  const gridH = `calc(100vh - ${headerH}px)`
  const tileH = `calc((100vh - ${headerH}px - ${pad * 2}px - ${(rows - 1) * gap}px) / ${rows})`

  return { headerH, gap, pad, cols, rows, gridH, tileH }
}