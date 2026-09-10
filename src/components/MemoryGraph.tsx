import type { Patient } from '../types'

// A simplified, non-technical relationship visualization for the Care &
// Memory Passport: Patient at the center, connected to key life anchors.
export function MemoryGraph({ patient }: { patient: Patient }) {
  const nodes = [
    { label: patient.hometown, icon: '🏘️', angle: -90 },
    { label: patient.occupation, icon: '💼', angle: -30 },
    { label: patient.importantPeople[0]?.name ?? 'Family', icon: '👪', angle: 30 },
    { label: patient.language, icon: '🗣️', angle: 90 },
    { label: patient.importantPlaces[0] ?? 'Places', icon: '📍', angle: 150 },
    { label: 'Activities', icon: '🎨', angle: -150 },
  ]
  const cx = 160
  const cy = 140
  const r = 105

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 320 280" className="mx-auto block w-full max-w-md" role="img" aria-label="Memory relationship graph">
        {nodes.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180
          const x = cx + r * Math.cos(rad)
          const y = cy + r * Math.sin(rad)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-navy-100)" strokeWidth={2} />
        })}
        <circle cx={cx} cy={cy} r={34} fill="var(--color-navy-600)" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="600">
          {patient.preferredName}
        </text>
        {nodes.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180
          const x = cx + r * Math.cos(rad)
          const y = cy + r * Math.sin(rad)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={26} fill="white" stroke="var(--color-navy-200)" strokeWidth={1.5} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="16">
                {n.icon}
              </text>
              <text x={x} y={y + 40} textAnchor="middle" fontSize="9.5" fill="var(--color-navy-500)" fontWeight="500">
                {truncate(n.label, 16)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}
