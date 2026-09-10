import type { Alert } from '../types'
import { SeverityBadge, StatusBadge, SecondaryButton, PrimaryButton } from './atoms'

export function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
  onEscalate,
}: {
  alert: Alert
  onAcknowledge?: () => void
  onResolve?: () => void
  onEscalate?: () => void
}) {
  const statusTone: Record<Alert['status'], 'neutral' | 'warning' | 'positive' | 'critical'> = {
    new: 'warning',
    reviewing: 'neutral',
    resolved: 'positive',
    escalated: 'critical',
  }
  return (
    <div className="rounded-2xl bg-white p-5 card-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <StatusBadge label={alert.status} tone={statusTone[alert.status]} />
        </div>
        <span className="text-xs text-navy-400">{new Date(alert.createdAt).toLocaleString()}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-navy-800">{alert.title}</h3>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">What changed?</div>
          <p className="text-navy-600">{alert.whatChanged}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">Why does it matter?</div>
          <p className="text-navy-600">{alert.whyItMatters}</p>
        </div>
        <div className="rounded-xl bg-navy-50/60 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-navy-500">Recommended action</div>
          <p className="text-navy-700">{alert.recommendedAction}</p>
        </div>
        {alert.caregiverNote && (
          <div className="text-xs text-navy-400">
            <span className="font-semibold">Caregiver note:</span> {alert.caregiverNote}
          </div>
        )}
      </div>

      {(onAcknowledge || onResolve || onEscalate) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onAcknowledge && alert.status === 'new' && (
            <SecondaryButton onClick={onAcknowledge}>Acknowledge</SecondaryButton>
          )}
          {onResolve && alert.status !== 'resolved' && <PrimaryButton onClick={onResolve}>Resolve</PrimaryButton>}
          {onEscalate && alert.status !== 'escalated' && (
            <SecondaryButton onClick={onEscalate} className="border-[var(--color-alert-red)] text-[var(--color-alert-red)]">
              Escalate
            </SecondaryButton>
          )}
        </div>
      )}
    </div>
  )
}
