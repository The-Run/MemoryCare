import { useMemo, useState } from 'react'
import { useData } from '../store/DataContext'
import { RoutineTimeline } from '../components/RoutineTimeline'
import { Card, Modal, PrimaryButton, SecondaryButton } from '../components/atoms'
import { VoiceService } from '../services/voiceService'
import type { RoutineType } from '../types'

export function RoutinePage() {
  const { data, updateRoutineStatus, addRoutine, logAudit } = useData()
  const [patientId, setPatientId] = useState(data.patients[0]?.id)
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('9:00 AM')
  const [type, setType] = useState<RoutineType>('activity')

  const patient = data.patients.find((p) => p.id === patientId)
  const routines = useMemo(() => data.routines.filter((r) => r.patientId === patientId), [data.routines, patientId])
  const missedCount = routines.filter((r) => r.status === 'missed').length

  const handleAdd = () => {
    if (!patientId || !title) return
    addRoutine({ patientId, type, title, time, status: 'upcoming', showDosageToPatient: type !== 'medication' })
    setModalOpen(false)
    setTitle('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Medication & Routine</h1>
          <p className="text-sm text-navy-400">Care-support reminders — not medical prescribing.</p>
        </div>
        <div className="flex gap-2">
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input max-w-[200px]">
            {data.patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <PrimaryButton onClick={() => setModalOpen(true)}>+ Add Reminder</PrimaryButton>
        </div>
      </div>

      {missedCount > 0 && (
        <Card className="border border-[var(--color-alert-red)]/30 bg-[var(--color-alert-red-bg)]/40 text-sm text-[var(--color-alert-red)]">
          ⚠ {missedCount} reminder(s) missed for {patient?.preferredName}. Consider escalating to the assigned caregiver.
        </Card>
      )}

      {patient && (
        <Card className="text-sm text-navy-600">
          <span className="font-semibold text-navy-800">Voice reminder example: </span>
          "{patient.preferredName}, it is time for your morning medicine."
          <SecondaryButton className="ml-3 px-3 py-1 text-xs" onClick={() => VoiceService.speak(`${patient.preferredName}, it is time for your morning medicine.`, patient.language)}>
            🔊 Play
          </SecondaryButton>
        </Card>
      )}

      <RoutineTimeline
        routines={routines}
        onToggle={(r) => {
          updateRoutineStatus(r.id, 'completed')
          if (patient) logAudit('Marked routine complete', `${patient.name} — ${r.title}`)
        }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Routine / Medication Reminder" footer={<PrimaryButton onClick={handleAdd}>Add</PrimaryButton>}>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input" />
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" className="input" />
          <select value={type} onChange={(e) => setType(e.target.value as RoutineType)} className="input">
            <option value="medication">Medication</option>
            <option value="meal">Meal</option>
            <option value="sleep">Sleep</option>
            <option value="exercise">Exercise</option>
            <option value="appointment">Appointment</option>
            <option value="activity">Activity</option>
          </select>
        </div>
      </Modal>
    </div>
  )
}
