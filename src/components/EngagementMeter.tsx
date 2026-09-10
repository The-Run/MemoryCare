export function EngagementMeter({ score, label }: { score: number; label?: string }) {
  const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'
  const color = score >= 70 ? 'var(--color-alert-green)' : score >= 40 ? 'var(--color-alert-yellow)' : 'var(--color-alert-red)'
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-navy-500">
          <span>{label}</span>
          <span className="font-semibold" style={{ color }}>
            {level}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-navy-50">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}
