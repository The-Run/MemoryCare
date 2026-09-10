import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useToast } from '../components/Toast'
import { VoiceService } from '../services/voiceService'
import { ProfileExtractionService } from '../services/profileExtractionService'
import type { ExtractedProfileField, MemoryCategory } from '../types'
import { Card, EmptyState, LoadingState, PrimaryButton, SecondaryButton } from '../components/atoms'

export function VoiceProfileBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const { data, addMemory, logAudit } = useData()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const patient = data.patients.find((p) => p.id === id)

  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [fields, setFields] = useState<ExtractedProfileField[]>([])
  const [updating, setUpdating] = useState(false)

  if (!patient) return <EmptyState icon="🧑" title="Patient not found" />

  const startRecording = async () => {
    setRecording(true)
    setTranscript('')
    setFields([])
    const text = await VoiceService.transcribe()
    setTranscript(text)
    const extracted = await ProfileExtractionService.extract(text)
    setFields(extracted)
    setRecording(false)
  }

  const categoryIcon: Record<MemoryCategory | 'routine', string> = {
    person: '👤', place: '📍', music: '🎶', food: '🍽️', occupation: '💼', event: '🎉', routine: '🗓️', hobby: '⭐',
  }

  const accept = (f: ExtractedProfileField) => {
    setUpdating(true)
    setTimeout(() => setUpdating(false), 900)
    addMemory({
      patientId: patient.id,
      category: f.category === 'routine' ? 'routine' : f.category,
      title: f.value,
      description: `${f.field}: ${f.value} (from caregiver conversation)`,
      source: 'caregiver',
      confidence: 0.75,
      icon: categoryIcon[f.category],
    })
    setFields((prev) => prev.map((x) => (x.id === f.id ? { ...x, status: 'accepted' } : x)))
    showToast('Added to Care & Memory Passport', 'success')
  }

  const reject = (f: ExtractedProfileField) => setFields((prev) => prev.map((x) => (x.id === f.id ? { ...x, status: 'rejected' } : x)))

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Talk once → Build the profile</h1>
        <p className="text-sm text-navy-400">Building the passport for {patient.name}</p>
      </div>

      <Card className="flex flex-col items-center py-10 text-center">
        <button
          onClick={startRecording}
          disabled={recording}
          className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white transition ${
            recording ? 'animate-pulse bg-[var(--color-alert-red)]' : 'bg-navy-600 hover:bg-navy-700'
          }`}
        >
          🎙️
        </button>
        <p className="mt-4 text-sm text-navy-400">{recording ? 'Listening…' : 'Tap to start recording caregiver notes'}</p>
      </Card>

      {transcript && (
        <Card>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy-400">Transcript</h3>
          <p className="rounded-xl bg-navy-50/60 p-3 text-sm text-navy-700">{transcript}</p>
        </Card>
      )}

      {updating && <LoadingState label="Updating Care & Memory Passport…" />}

      {fields.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy-400">AI-extracted profile fields</h3>
          <div className="space-y-2">
            {fields.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-navy-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcon[f.category]}</span>
                  <div>
                    <div className="text-sm font-medium text-navy-700">
                      {f.field}: {f.value}
                    </div>
                    <div className="text-[11px] uppercase text-navy-400">{f.category}</div>
                  </div>
                </div>
                {f.status === 'pending' ? (
                  <div className="flex gap-2">
                    <SecondaryButton onClick={() => accept(f)} className="px-3 py-1.5 text-xs">
                      Accept
                    </SecondaryButton>
                    <SecondaryButton onClick={() => reject(f)} className="px-3 py-1.5 text-xs text-[var(--color-alert-red)]">
                      Reject
                    </SecondaryButton>
                  </div>
                ) : (
                  <span className={`text-xs font-semibold ${f.status === 'accepted' ? 'text-[var(--color-alert-green)]' : 'text-navy-300'}`}>
                    {f.status === 'accepted' ? '✓ Added' : 'Rejected'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <PrimaryButton onClick={() => { logAudit('Used voice profile builder', patient.name); navigate(`/patients/${patient.id}`) }}>
          Done — View Passport
        </PrimaryButton>
      </div>
    </div>
  )
}
