import { useState } from 'react'
import { useData, usePatientData } from '../store/DataContext'
import { useToast } from '../components/Toast'
import { Card, EmptyState, PrimaryButton, StatusBadge } from '../components/atoms'
import { SourceTag } from '../components/MemoryPassportCard'
import type { MemoryCategory } from '../types'

const CATEGORIES: { value: MemoryCategory; label: string; icon: string }[] = [
  { value: 'person', label: 'A person', icon: '👤' },
  { value: 'place', label: 'A place', icon: '📍' },
  { value: 'music', label: 'Music', icon: '🎶' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'event', label: 'A moment', icon: '🎉' },
  { value: 'hobby', label: 'A hobby', icon: '⭐' },
]

// Family contribution view. Family is OPTIONAL — the product works fully
// without it — but when family exists they can enrich the passport and see
// a plain-language care summary (never clinical analytics).
export function FamilyPortalPage() {
  const { data, addMemory, logAudit } = useData()
  const { showToast } = useToast()
  const familyPatients = data.patients.filter((p) => p.familyAvailable)
  const [patientId, setPatientId] = useState(familyPatients[0]?.id)
  const [category, setCategory] = useState<MemoryCategory>('person')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { patient, memories: contributed, preferences, sessions } = usePatientData(patientId)
  const topPreference = [...preferences].sort((a, b) => b.engagementScore - a.engagementScore)[0]

  if (familyPatients.length === 0) {
    return <EmptyState icon="👪" title="No patients with family contact" description="MemoryCare NER works fully without family involvement." />
  }

  const submit = () => {
    if (!patientId || !title.trim()) return
    addMemory({
      patientId,
      category,
      title: title.trim(),
      description: description.trim() || `Shared by family.`,
      source: 'family',
      confidence: 0.9,
      icon: CATEGORIES.find((c) => c.value === category)?.icon ?? '⭐',
    })
    logAudit('Family contributed a memory', `${patient?.name} — ${title.trim()}`)
    showToast('Thank you — added to the Care & Memory Passport.', 'success')
    setTitle('')
    setDescription('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Family Contributions</h1>
          <p className="text-sm text-navy-400">Share memories that help caregivers personalize care.</p>
        </div>
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input max-w-[220px]">
          {familyPatients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Share a memory</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)} className={`chip ${category === c.value ? 'chip-active' : ''}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title — e.g. Our house in Jorhat" className="input" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A short description a caregiver could read aloud"
            className="input"
          />
          <PrimaryButton onClick={submit} disabled={!title.trim()}>
            Add to Passport
          </PrimaryButton>
        </div>
        <p className="mt-3 text-xs text-navy-400">
          Every contribution is stored with its source and stays editable — the system never invents memories.
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Care summary</h2>
        {patient ? (
          <div className="space-y-2 text-sm text-navy-600">
            <p>
              {patient.preferredName} has had <strong>{sessions.length}</strong> recorded care sessions.
            </p>
            {topPreference && (
              <p>
                {patient.preferredName} appears most engaged with <strong>{topPreference.stimulus.toLowerCase()}</strong>.
              </p>
            )}
            <p className="text-xs text-navy-400">
              Detailed clinical analytics stay with the care team. This summary is observational only.
            </p>
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Memories in the passport</h2>
        <div className="space-y-2">
          {contributed.map((m) => (
            <div key={m.id} className="flex items-start gap-3 rounded-xl bg-navy-50/60 p-3">
              <span className="text-lg">{m.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-navy-700">{m.title}</span>
                  {m.source === 'family' && <StatusBadge label="From family" tone="positive" />}
                </div>
                <div className="text-xs text-navy-400">{m.description}</div>
                <div className="mt-1">
                  <SourceTag source={m.source} />
                </div>
              </div>
            </div>
          ))}
          {contributed.length === 0 && <p className="text-sm text-navy-400">No memories recorded yet.</p>}
        </div>
      </Card>
    </div>
  )
}
