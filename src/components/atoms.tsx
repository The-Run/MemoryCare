import type { ReactNode } from 'react'
import type { AlertSeverity, Stage } from '../types'

export function StageBadge({ stage, size = 'md' }: { stage: Stage; size?: 'sm' | 'md' }) {
  const map: Record<Stage, { label: string; bg: string; fg: string }> = {
    early: { label: 'EARLY · STIMULATE', bg: 'var(--color-stage-early-bg)', fg: 'var(--color-stage-early)' },
    moderate: { label: 'MODERATE · SUPPORT', bg: 'var(--color-stage-moderate-bg)', fg: 'var(--color-stage-moderate)' },
    advanced: { label: 'ADVANCED · COMFORT', bg: 'var(--color-stage-advanced-bg)', fg: 'var(--color-stage-advanced)' },
  }
  const s = map[stage]
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const map: Record<AlertSeverity, { label: string; bg: string; fg: string }> = {
    green: { label: 'Normal', bg: 'var(--color-alert-green-bg)', fg: 'var(--color-alert-green)' },
    yellow: { label: 'Attention', bg: 'var(--color-alert-yellow-bg)', fg: 'var(--color-alert-yellow)' },
    red: { label: 'Concern', bg: 'var(--color-alert-red-bg)', fg: 'var(--color-alert-red)' },
  }
  const s = map[severity]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: s.bg, color: s.fg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg }} />
      {s.label}
    </span>
  )
}

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'positive' | 'warning' | 'critical' }) {
  const toneClasses: Record<string, string> = {
    neutral: 'bg-navy-50 text-navy-600',
    positive: 'bg-[var(--color-alert-green-bg)] text-[var(--color-alert-green)]',
    warning: 'bg-[var(--color-alert-yellow-bg)] text-[var(--color-alert-yellow)]',
    critical: 'bg-[var(--color-alert-red-bg)] text-[var(--color-alert-red)]',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>{label}</span>
}

export function ConsentBadge({ granted, label }: { granted: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        granted ? 'bg-[var(--color-alert-green-bg)] text-[var(--color-alert-green)]' : 'bg-navy-50 text-navy-400'
      }`}
    >
      {granted ? '✓' : '—'} {label}
    </span>
  )
}

export function EmptyState({ icon = '📭', title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-100 bg-white/60 px-6 py-12 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="mt-3 text-base font-semibold text-navy-700">{title}</div>
      {description && <div className="mt-1 max-w-sm text-sm text-navy-400">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-navy-50/60 px-4 py-3 text-sm text-navy-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-300 border-t-transparent" />
      {label}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 card-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-800">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-navy-400 hover:bg-navy-50" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-5 card-shadow ${className}`}>{children}</div>
}

export function PrimaryButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
