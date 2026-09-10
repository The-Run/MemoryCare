import { useNavigate, useParams } from 'react-router-dom'
import { useData, usePatientData } from '../store/DataContext'
import { PatientAvatar } from '../components/PatientAvatar'
import { StageBadge, SeverityBadge, PrimaryButton, SecondaryButton } from '../components/atoms'
import { PassportSection, SourceTag, FieldRow } from '../components/MemoryPassportCard'
import { MemoryGraph } from '../components/MemoryGraph'
import { PreferenceCard } from '../components/PreferenceCard'
import { RoutineTimeline } from '../components/RoutineTimeline'
import { EmptyState } from '../components/atoms'
import { useEffect } from 'react'

export function PatientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { enterPatientMode, logAudit } = useData()
  const navigate = useNavigate()
  const { patient, memories, preferences, routines } = usePatientData(id)

  useEffect(() => {
    if (patient) logAudit('Viewed Care & Memory Passport', patient.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id])

  if (!patient) return <EmptyState icon="🧑" title="Patient not found" />

  const positivePrefs = preferences.filter((p) => p.response === 'positive')
  const negativePrefs = preferences.filter((p) => p.response === 'negative')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 card-shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <PatientAvatar patient={patient} size={64} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-navy-900">{patient.name}</h1>
              <SeverityBadge severity={patient.attentionStatus} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-navy-400">
              <span>{patient.age} yrs</span>·<span>{patient.language}</span>·<span>{patient.state}</span>
              <StageBadge stage={patient.stage} size="sm" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={() => navigate(`/patients/${patient.id}/profile-builder`)}>🎙️ Build from conversation</SecondaryButton>
          <SecondaryButton onClick={() => navigate(`/adaptive-care/${patient.id}`)}>Adaptive Stage</SecondaryButton>
          <SecondaryButton onClick={() => navigate(`/patients/${patient.id}/insights`)}>Insights</SecondaryButton>
          <SecondaryButton onClick={() => { enterPatientMode(patient.id); navigate('/patient/home') }}>Enter Patient Mode</SecondaryButton>
          <PrimaryButton onClick={() => navigate(`/session/${patient.id}`)}>Start Session</PrimaryButton>
        </div>
      </div>

      {!patient.familyAvailable && (
        <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-4 text-sm text-navy-600">
          <span className="font-semibold">No family contact available.</span> Personalization is built entirely through
          caregiver observations and patient interactions — no memories have been fabricated.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PassportSection icon="🪪" title="Identity">
            <FieldRow label="Preferred name" value={patient.preferredName} />
            <FieldRow label="Age" value={patient.age} />
            <FieldRow label="Hometown" value={patient.hometown} />
            <FieldRow label="Language" value={patient.language} />
            <FieldRow label="Cultural background" value={patient.state} />
          </PassportSection>

          <PassportSection icon="📖" title="Life Story">
            <FieldRow label="Occupation" value={patient.occupation} />
            <div className="py-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Important people</div>
              <div className="flex flex-wrap gap-2">
                {patient.importantPeople.map((person) => (
                  <span key={person.name} className="rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-600">
                    {person.name} · {person.relation}
                  </span>
                ))}
              </div>
            </div>
            <div className="py-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Important places</div>
              <div className="flex flex-wrap gap-2">
                {patient.importantPlaces.map((place) => (
                  <span key={place} className="rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-600">
                    {place}
                  </span>
                ))}
              </div>
            </div>
            <div className="py-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Major life events</div>
              <ul className="list-inside list-disc text-sm text-navy-600">
                {patient.majorLifeEvents.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </PassportSection>

          <PassportSection icon="⭐" title="Preferences">
            {preferences.length === 0 ? (
              <p className="text-sm text-navy-400">No preferences observed yet.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {preferences.map((p) => (
                  <PreferenceCard key={p.id} preference={p} />
                ))}
              </div>
            )}
          </PassportSection>

          <PassportSection icon="🗓️" title="Routines">
            <FieldRow label="Wake time" value={patient.wakeTime} />
            <FieldRow label="Sleep time" value={patient.sleepTime} />
            <div className="py-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Meals</div>
              <p className="text-sm text-navy-600">{patient.meals.join(' · ')}</p>
            </div>
            <div className="py-2">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Today's schedule</div>
              <RoutineTimeline routines={routines} />
            </div>
          </PassportSection>

          <PassportSection icon="💬" title="Communication">
            <FieldRow label="Preferred language" value={patient.language} />
            <FieldRow label="Mode" value={patient.communicationMode} />
            <FieldRow label="Yes/No preference" value={patient.yesNoPreference ? 'Prefers yes/no questions' : 'Open questions okay'} />
            <div className="py-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Known communication difficulties</div>
              {patient.knownCommunicationDifficulties.length === 0 ? (
                <p className="text-sm text-navy-400">None recorded.</p>
              ) : (
                <ul className="list-inside list-disc text-sm text-navy-600">
                  {patient.knownCommunicationDifficulties.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </PassportSection>

          <PassportSection icon="🌤️" title="Comfort Profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-alert-green)]">Positive engagement</div>
                <ul className="space-y-1 text-sm text-navy-600">
                  {positivePrefs.length ? positivePrefs.map((p) => <li key={p.id}>✓ {p.stimulus}</li>) : <li className="text-navy-400">None observed yet</li>}
                </ul>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-alert-red)]">Low engagement</div>
                <ul className="space-y-1 text-sm text-navy-600">
                  {negativePrefs.length ? negativePrefs.map((p) => <li key={p.id}>✕ {p.stimulus}</li>) : <li className="text-navy-400">None observed yet</li>}
                </ul>
              </div>
            </div>
          </PassportSection>
        </div>

        <div className="space-y-6">
          <PassportSection icon="🕸️" title="Memory Graph">
            <MemoryGraph patient={patient} />
          </PassportSection>

          <PassportSection icon="🧾" title="Memories">
            <div className="space-y-2">
              {memories.map((m) => (
                <div key={m.id} className="flex items-start gap-2 rounded-xl bg-navy-50/60 p-2.5">
                  <span className="text-lg">{m.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-navy-700">{m.title}</div>
                    <div className="text-xs text-navy-400">{m.description}</div>
                    <div className="mt-1">
                      <SourceTag source={m.source} />
                    </div>
                  </div>
                </div>
              ))}
              {memories.length === 0 && <p className="text-sm text-navy-400">No memories recorded yet.</p>}
            </div>
          </PassportSection>
        </div>
      </div>
    </div>
  )
}
