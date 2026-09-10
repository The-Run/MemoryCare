import type { Routine } from '../types'
import { StatusBadge } from './atoms'

const ICONS: Record<Routine['type'], string> = {
  medication: '💊',
  meal: '🍽️',
  sleep: '🌙',
  exercise: '🚶',
  appointment: '🗓️',
  activity: '🎨',
}

export function RoutineTimeline({
  routines,
  patientMode = false,
  onToggle,
}: {
  routines: Routine[]
  patientMode?: boolean
  onToggle?: (routine: Routine) => void
}) {
  const statusTone: Record<Routine['status'], 'neutral' | 'positive' | 'warning'> = {
    upcoming: 'neutral',
    completed: 'positive',
    missed: 'warning',
  }

  const sorted = [...routines].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-3">
      {sorted.map((r) => (
        <div
          key={r.id}
          className={`flex items-center gap-4 rounded-2xl border p-4 ${
            r.status === 'missed' ? 'border-[var(--color-alert-red)]/30 bg-[var(--color-alert-red-bg)]/40' : 'border-navy-100 bg-white'
          } ${patientMode ? 'patient-target text-lg' : ''}`}
        >
          <div className={patientMode ? 'text-4xl' : 'text-2xl'}>{ICONS[r.type]}</div>
          <div className="flex-1">
            <div className={`font-semibold text-navy-800 ${patientMode ? 'text-xl' : ''}`}>{r.title}</div>
            <div className="text-sm text-navy-400">{r.time}</div>
            {!patientMode && r.showDosageToPatient === false && r.dosage && (
              <div className="mt-0.5 text-xs text-navy-400">{r.dosage}</div>
            )}
          </div>
          {patientMode ? (
            <span className={`text-2xl ${r.status === 'completed' ? '' : 'opacity-30'}`}>✅</span>
          ) : (
            <StatusBadge label={r.status} tone={statusTone[r.status]} />
          )}
          {onToggle && !patientMode && r.status !== 'completed' && (
            <button
              onClick={() => onToggle(r)}
              className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-50"
            >
              Mark done
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
