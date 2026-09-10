import type { BaselineMetric } from '../types'
import { BaselineService } from '../services/baselineService'

export function ChangeIndicator({ baseline }: { baseline: BaselineMetric }) {
  const evalResult = BaselineService.evaluate(baseline)
  const up = baseline.changePercent > 0
  const color =
    evalResult.severity === 'green' ? 'var(--color-alert-green)' : evalResult.severity === 'yellow' ? 'var(--color-alert-yellow)' : 'var(--color-alert-red)'

  return (
    <div className="rounded-xl border border-navy-100 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-navy-400">{baseline.label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-navy-800">
          {baseline.currentValue}
          {baseline.unit}
        </span>
        <span className="text-sm text-navy-400">was {baseline.baselineValue}{baseline.unit}</span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-sm font-semibold" style={{ color }}>
        <span>{up ? '▲' : baseline.changePercent < 0 ? '▼' : '—'}</span>
        <span>{Math.abs(baseline.changePercent)}% from baseline</span>
      </div>
      <p className="mt-2 text-xs text-navy-500">{evalResult.message}</p>
    </div>
  )
}
