import { useState } from 'react'
import { useData } from '../store/DataContext'
import { useToast } from './Toast'
import { Modal, PrimaryButton } from './atoms'
import { ResponseControls } from './ResponseControls'
import { activities } from '../data/activities'

// Quick caregiver observation outside of a full guided session.
export function AddObservationModal({ open, onClose, patientId }: { open: boolean; onClose: () => void; patientId?: string }) {
  const { data, addObservation, logAudit, isOnline } = useData()
  const { showToast } = useToast()
  const [selectedPatient, setSelectedPatient] = useState(patientId ?? data.patients[0]?.id)
  const [activityId, setActivityId] = useState(activities[0]?.id)

  const patient = data.patients.find((p) => p.id === selectedPatient)
  const stageActivities = patient ? activities.filter((a) => a.stage === patient.stage) : activities

  return (
    <Modal open={open} onClose={onClose} title="Add Observation">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-navy-500">Patient</span>
          <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="input">
            {data.patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-navy-500">Activity observed</span>
          <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="input">
            {stageActivities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </label>

        <ResponseControls
          onSubmit={({ engagement, assistance, note }) => {
            if (!selectedPatient) return
            addObservation({
              sessionId: 'quick-observation',
              patientId: selectedPatient,
              activityId: activityId ?? activities[0].id,
              response: engagement,
              responseTime: 10,
              assistanceRequired: assistance,
              engagement,
              caregiverNote: note,
            })
            logAudit('Recorded observation', patient?.name ?? 'Patient')
            showToast(isOnline ? 'Observation recorded.' : 'Observation saved locally — will sync when online.', 'success')
            onClose()
          }}
        />
      </div>
    </Modal>
  )
}

export function AddObservationButton({ patientId, label = 'Add Observation' }: { patientId?: string; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>{label}</PrimaryButton>
      <AddObservationModal open={open} onClose={() => setOpen(false)} patientId={patientId} />
    </>
  )
}
