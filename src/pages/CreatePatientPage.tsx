import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useToast } from '../components/Toast'
import { StepWizard } from '../components/StepWizard'
import { Card, PrimaryButton, SecondaryButton } from '../components/atoms'
import type { NerState, Patient, Stage } from '../types'
import { newId, nowIso } from '../services/id'
import { VoiceService } from '../services/voiceService'
import { ProfileExtractionService } from '../services/profileExtractionService'
import type { ExtractedProfileField } from '../types'

const STEPS = ['Basic Information', 'Life Story', 'Preferences', 'Routine & Care', 'Confirm']
const STATES: NerState[] = ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim']

interface FormState {
  name: string
  preferredName: string
  age: string
  gender: Patient['gender']
  stage: Stage
  language: string
  state: NerState
  hometown: string
  familyAvailable: boolean
  occupation: string
  importantPeople: string
  importantPlaces: string
  hobbies: string
  music: string
  food: string
  activities: string
  topics: string
  wakeTime: string
  sleepTime: string
  medication: string
  appointments: string
  assistance: string
}

const initialForm: FormState = {
  name: '',
  preferredName: '',
  age: '70',
  gender: 'female',
  stage: 'moderate',
  language: '',
  state: 'Assam',
  hometown: '',
  familyAvailable: true,
  occupation: '',
  importantPeople: '',
  importantPlaces: '',
  hobbies: '',
  music: '',
  food: '',
  activities: '',
  topics: '',
  wakeTime: '6:30 AM',
  sleepTime: '9:00 PM',
  medication: '',
  appointments: '',
  assistance: '',
}

export function CreatePatientPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [recording, setRecording] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedProfileField[]>([])
  const { addPatient, addMemory, addRoutine, logAudit } = useData()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  const handleBuildFromConversation = async () => {
    setRecording(true)
    const transcript = await VoiceService.transcribe()
    const fields = await ProfileExtractionService.extract(transcript)
    setExtracted(fields)
    setRecording(false)
    showToast('Extracted fields from conversation — review and accept below.')
  }

  const acceptField = (field: ExtractedProfileField) => {
    if (field.category === 'place') set('hometown', field.value)
    if (field.category === 'occupation') set('occupation', field.value)
    if (field.category === 'music') set('music', form.music ? `${form.music}, ${field.value}` : field.value)
    if (field.category === 'hobby') set('hobbies', form.hobbies ? `${form.hobbies}, ${field.value}` : field.value)
    if (field.category === 'routine') set('assistance', form.assistance ? `${form.assistance}; ${field.value}` : field.value)
    setExtracted((prev) => prev.map((f) => (f.id === field.id ? { ...f, status: 'accepted' } : f)))
  }

  const rejectField = (field: ExtractedProfileField) => {
    setExtracted((prev) => prev.map((f) => (f.id === field.id ? { ...f, status: 'rejected' } : f)))
  }

  const list = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)

  const handleSubmit = () => {
    const id = newId('p')
    const initials = form.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const patient: Patient = {
      id,
      name: form.name || 'New Patient',
      preferredName: form.preferredName || form.name.split(' ')[0] || 'Patient',
      age: Number(form.age) || 70,
      gender: form.gender,
      stage: form.stage,
      language: form.language || 'English',
      state: form.state,
      hometown: form.hometown,
      avatarInitials: initials || 'NP',
      avatarColor: '#3B6EA8',
      occupation: form.occupation,
      familyAvailable: form.familyAvailable,
      communicationMode: 'mixed',
      careHome: false,
      assignedCaregiverId: 'c-priya',
      lastSessionAt: null,
      attentionStatus: 'green',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      importantPeople: list(form.importantPeople).map((name) => ({ name, relation: 'Family / friend' })),
      importantPlaces: list(form.importantPlaces),
      majorLifeEvents: [],
      yesNoPreference: false,
      knownCommunicationDifficulties: [],
      wakeTime: form.wakeTime,
      sleepTime: form.sleepTime,
      meals: ['Breakfast 7:30 AM', 'Lunch 1:00 PM', 'Dinner 7:30 PM'],
      medicationSchedule: list(form.medication).map((m) => ({ name: m, time: 'Morning' })),
    }

    addPatient(patient)
    for (const hobby of list(form.hobbies)) addMemory({ patientId: id, category: 'hobby', title: hobby, description: `${patient.preferredName} enjoys ${hobby}.`, source: form.familyAvailable ? 'family' : 'caregiver', confidence: 0.6, icon: '⭐' })
    for (const m of list(form.music)) addMemory({ patientId: id, category: 'music', title: m, description: `${patient.preferredName} responds to ${m}.`, source: 'caregiver', confidence: 0.6, icon: '🎶' })
    if (form.wakeTime) addRoutine({ patientId: id, type: 'meal', title: 'Breakfast', time: '7:30 AM', status: 'upcoming', showDosageToPatient: true })
    for (const appt of list(form.appointments)) addRoutine({ patientId: id, type: 'appointment', title: appt, time: 'TBD', status: 'upcoming', showDosageToPatient: true })

    logAudit('Created patient profile', patient.name)
    showToast('Care & Memory Passport created!', 'success')
    navigate(`/patients/${id}`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Create Care & Memory Passport</h1>
        <p className="text-sm text-navy-400">A short guided setup — not a medical form.</p>
      </div>

      <StepWizard steps={STEPS} currentStep={step} />

      <Card>
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input" />
            </Field>
            <Field label="Preferred name">
              <input value={form.preferredName} onChange={(e) => set('preferredName', e.target.value)} className="input" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age">
                <input type="number" value={form.age} onChange={(e) => set('age', e.target.value)} className="input" />
              </Field>
              <Field label="Gender">
                <select value={form.gender} onChange={(e) => set('gender', e.target.value as Patient['gender'])} className="input">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Language">
                <input value={form.language} onChange={(e) => set('language', e.target.value)} placeholder="e.g. Assamese" className="input" />
              </Field>
              <Field label="Hometown / NER state">
                <select value={form.state} onChange={(e) => set('state', e.target.value as NerState)} className="input">
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Hometown / village / town">
              <input value={form.hometown} onChange={(e) => set('hometown', e.target.value)} className="input" />
            </Field>
            <Field label="Current dementia stage">
              <select value={form.stage} onChange={(e) => set('stage', e.target.value as Stage)} className="input">
                <option value="early">Early</option>
                <option value="moderate">Moderate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Family available?">
              <div className="flex gap-2">
                <button type="button" onClick={() => set('familyAvailable', true)} className={`chip ${form.familyAvailable ? 'chip-active' : ''}`}>
                  Yes
                </button>
                <button type="button" onClick={() => set('familyAvailable', false)} className={`chip ${!form.familyAvailable ? 'chip-active' : ''}`}>
                  No
                </button>
              </div>
              {!form.familyAvailable && (
                <p className="mt-2 rounded-lg bg-navy-50 p-2 text-xs text-navy-600">
                  Personalization can be built through caregiver observations and patient interactions.
                </p>
              )}
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-navy-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-navy-700">🎙️ Talk once → Build the profile</div>
                  <div className="text-xs text-navy-400">Describe the patient naturally; we'll extract structured fields.</div>
                </div>
                <SecondaryButton onClick={handleBuildFromConversation} disabled={recording}>
                  {recording ? 'Listening…' : 'Start Recording'}
                </SecondaryButton>
              </div>
              {extracted.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {extracted.map((f) => (
                    <span
                      key={f.id}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        f.status === 'accepted' ? 'bg-[var(--color-alert-green-bg)] text-[var(--color-alert-green)]' : f.status === 'rejected' ? 'bg-navy-50 text-navy-300 line-through' : 'bg-navy-50 text-navy-600'
                      }`}
                    >
                      {f.field}: {f.value}
                      {f.status === 'pending' && (
                        <>
                          <button onClick={() => acceptField(f)} className="ml-1 text-[var(--color-alert-green)]">✓</button>
                          <button onClick={() => rejectField(f)} className="text-[var(--color-alert-red)]">✕</button>
                        </>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Field label="Occupation">
              <input value={form.occupation} onChange={(e) => set('occupation', e.target.value)} className="input" />
            </Field>
            <Field label="Important people (comma separated)">
              <input value={form.importantPeople} onChange={(e) => set('importantPeople', e.target.value)} placeholder="e.g. Rohan (son), Mrs. Bora (friend)" className="input" />
            </Field>
            <Field label="Important places (comma separated)">
              <input value={form.importantPlaces} onChange={(e) => set('importantPlaces', e.target.value)} className="input" />
            </Field>
            <Field label="Hobbies (comma separated)">
              <input value={form.hobbies} onChange={(e) => set('hobbies', e.target.value)} className="input" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Music (comma separated)">
              <input value={form.music} onChange={(e) => set('music', e.target.value)} className="input" />
            </Field>
            <Field label="Food">
              <input value={form.food} onChange={(e) => set('food', e.target.value)} className="input" />
            </Field>
            <Field label="Preferred activities">
              <input value={form.activities} onChange={(e) => set('activities', e.target.value)} className="input" />
            </Field>
            <Field label="Comfortable topics">
              <input value={form.topics} onChange={(e) => set('topics', e.target.value)} className="input" />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Wake time">
                <input value={form.wakeTime} onChange={(e) => set('wakeTime', e.target.value)} className="input" />
              </Field>
              <Field label="Sleep time">
                <input value={form.sleepTime} onChange={(e) => set('sleepTime', e.target.value)} className="input" />
              </Field>
            </div>
            <Field label="Medication schedule (comma separated)">
              <input value={form.medication} onChange={(e) => set('medication', e.target.value)} className="input" />
            </Field>
            <Field label="Appointments (comma separated)">
              <input value={form.appointments} onChange={(e) => set('appointments', e.target.value)} className="input" />
            </Field>
            <Field label="Assistance requirements">
              <textarea value={form.assistance} onChange={(e) => set('assistance', e.target.value)} rows={3} className="input" />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-navy-800">Care & Memory Passport preview</h3>
            <div className="rounded-xl bg-navy-50/60 p-4 text-sm text-navy-600">
              <p><strong>{form.preferredName || form.name}</strong> · {form.age} yrs · {form.language || '—'} · {form.state}</p>
              <p className="mt-1">Occupation: {form.occupation || '—'}</p>
              <p className="mt-1">Hobbies: {form.hobbies || '—'}</p>
              <p className="mt-1">Music: {form.music || '—'}</p>
              <p className="mt-1">Family available: {form.familyAvailable ? 'Yes' : 'No'}</p>
              <p className="mt-1">Stage: {form.stage}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <SecondaryButton disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </SecondaryButton>
          {step < STEPS.length - 1 ? (
            <PrimaryButton onClick={() => setStep((s) => s + 1)}>Next</PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSubmit}>Create Passport</PrimaryButton>
          )}
        </div>
      </Card>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-navy-500">{label}</span>
      {children}
    </label>
  )
}
