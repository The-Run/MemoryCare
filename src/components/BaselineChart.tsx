import type { BaselineMetric } from '../types'

// Minimal dependency-free line chart (inline SVG) for the personal
// baseline history. Keeps the prototype free of chart-library weight.
export function BaselineChart({ baseline, height = 120 }: { baseline: BaselineMetric; height?: number }) {
  const points = baseline.history
  const width = 320
  const padding = 12
  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1 || 1)) * (width - padding * 2)
    const y = height - padding - ((p.value - min) / range) * (height - padding * 2)
    return { x, y, value: p.value }
  })

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const badColor = baseline.trend === 'declining' ? 'var(--color-alert-red)' : baseline.trend === 'improving' ? 'var(--color-alert-green)' : 'var(--color-navy-400)'

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`${baseline.label} trend chart`}>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--color-navy-100)" strokeWidth={1} />
        <path d={path} fill="none" stroke={badColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 4 : 2.5} fill={badColor} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-navy-400">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  )
}
