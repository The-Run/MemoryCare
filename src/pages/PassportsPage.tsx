import { useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { PatientAvatar } from '../components/PatientAvatar'
import { StageBadge, Card, PrimaryButton, SecondaryButton } from '../components/atoms'

/**
 * Care & Memory Passport index — a gallery of the passports themselves,
 * not a management list. Each card previews who the person is, then opens
 * the full passport. (The /patients route is the admin-style list with
 * search + filters; this is the "who is this person" view.)
 */
export function PassportsPage() {
  const { data, enterPatientMode } = useData()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Care & Memory Passports</h1>
        <p className="max-w-2xl text-sm text-navy-400">
          Every passport describes the person, not the diagnosis — their language, life story, comfort profile and
          routines, each traceable to a source.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.patients.map((p) => {
          const memories = data.memories.filter((m) => m.patientId === p.id)
          const prefs = data.preferences.filter((x) => x.patientId === p.id)
          const likes = prefs.filter((x) => x.response === 'positive').slice(0, 2)
          const avoid = prefs.filter((x) => x.response === 'negative').slice(0, 1)

          return (
            <Card key={p.id} className="flex flex-col">
              <div className="flex items-center gap-3">
                <PatientAvatar patient={p} size={52} />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-navy-800">{p.preferredName}</div>
                  <div className="truncate text-xs text-navy-400">
                    {p.age} yrs · {p.language} · {p.hometown}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <StageBadge stage={p.stage} size="sm" />
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Life story</dt>
                  <dd className="text-navy-600">{p.occupation}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Responds well to</dt>
                  <dd className="text-navy-600">
                    {likes.length ? likes.map((l) => l.stimulus).join(', ') : 'Still learning — no preferences observed yet'}
                  </dd>
                </div>
                {avoid.length > 0 && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Avoid</dt>
                    <dd className="text-navy-600">{avoid.map((l) => l.stimulus).join(', ')}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-navy-400">
                <span className="rounded-full bg-navy-50 px-2 py-0.5">{memories.length} memories</span>
                <span className="rounded-full bg-navy-50 px-2 py-0.5">
                  {p.familyAvailable ? 'Family involved' : 'No family — caregiver-built'}
                </span>
                {p.careHome && <span className="rounded-full bg-navy-50 px-2 py-0.5">Care home</span>}
              </div>

              <div className="mt-4 flex gap-2 pt-1">
                <PrimaryButton className="flex-1" onClick={() => navigate(`/patients/${p.id}`)}>
                  Open Passport
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    enterPatientMode(p.id)
                    navigate('/patient/home')
                  }}
                >
                  Patient Mode
                </SecondaryButton>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
