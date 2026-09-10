import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useToast } from '../components/Toast'
import type { Stage } from '../types'
import { EmptyState, SecondaryButton } from '../components/atoms'

const STAGES: { key: Stage; label: string; goal: string; activities: string[]; color: string; bg: string }[] = [
  {
    key: 'early',
    label: 'EARLY · STIMULATE',
    goal: 'Build confidence and maintain cognitive engagement.',
    activities: ['Memory activities', 'Voice conversations', 'Cultural games', 'Recall activities'],
    color: 'var(--color-stage-early)',
    bg: 'var(--color-stage-early-bg)',
  },
  {
    key: 'moderate',
    label: 'MODERATE · SUPPORT',
    goal: 'Maintain engagement and independence.',
    activities: ['Recognition activities', 'Simple choices', 'Routine assistance', 'Familiar images/music'],
    color: 'var(--color-stage-moderate)',
    bg: 'var(--color-stage-moderate-bg)',
  },
  {
    key: 'advanced',
    label: 'ADVANCED · COMFORT',
    goal: 'Comfort, communication, safety and emotional well-being.',
    activities: ['Familiar music', 'Calming regional content', 'Simple voice interaction', 'Non-verbal responses', 'Comfort routines'],
    color: 'var(--color-stage-advanced)',
    bg: 'var(--color-stage-advanced-bg)',
  },
]

export function AdaptiveCarePage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { data, updatePatient, enterPatientMode, logAudit } = useData()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const patient = data.patients.find((p) => p.id === patientId)
  if (!patient) return <EmptyState icon="🧑" title="Patient not found" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Three-Stage Adaptive Care</h1>
        <p className="text-sm text-navy-400">{patient.name}'s current stage and how care adapts as needs change.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STAGES.map((s) => {
          const isCurrent = s.key === patient.stage
          return (
            <div
              key={s.key}
              className={`rounded-2xl p-5 transition ${isCurrent ? 'scale-[1.02] shadow-lg' : 'card-shadow opacity-80'}`}
              style={{ background: s.bg, border: isCurrent ? `2px solid ${s.color}` : '2px solid transparent' }}
            >
              {isCurrent && (
                <span className="mb-2 inline-block rounded-full bg-white px-2 py-0.5 text-[10px] font-bold" style={{ color: s.color }}>
                  CURRENT STAGE
                </span>
              )}
              <h3 className="text-sm font-bold tracking-wide" style={{ color: s.color }}>
                {s.label}
              </h3>
              <p className="mt-2 text-sm text-navy-700">{s.goal}</p>
              <ul className="mt-3 space-y-1 text-sm text-navy-600">
                {s.activities.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl bg-navy-800 p-5 text-center text-sm text-white">
        The system adapts care as the patient's abilities change — activities, difficulty and pacing update
        automatically as {patient.preferredName} moves between stages.
      </div>

      <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-navy-800">Demo control — switch care scenario</h3>
            <p className="text-xs text-navy-400">
              Change the recorded stage to see the session plan, mind games and activity difficulty adapt.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  updatePatient(patient.id, { stage: s.key })
                  logAudit('Changed recorded care stage', `${patient.name} → ${s.key}`)
                  showToast(`${patient.preferredName} is now on the ${s.key}-stage care plan.`, 'info')
                }}
                className={`chip ${patient.stage === s.key ? 'chip-active' : ''}`}
              >
                {s.key === 'early' ? 'Early' : s.key === 'moderate' ? 'Moderate' : 'Advanced'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => navigate(`/session/${patient.id}`)}>Start a session at this stage</SecondaryButton>
          <SecondaryButton onClick={() => { enterPatientMode(patient.id); navigate('/patient/games') }}>
            See patient games at this stage
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}
