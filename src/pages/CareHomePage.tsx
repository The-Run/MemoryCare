import { useState } from 'react'
import { useData, usePatientData } from '../store/DataContext'
import { getCaregiver } from '../data/caregivers'
import { PatientAvatar } from '../components/PatientAvatar'
import { StageBadge, SeverityBadge, Card, Modal, SecondaryButton, EmptyState } from '../components/atoms'
import type { Patient } from '../types'

export function CareHomePage() {
  const { data } = useData()
  const [handoverPatient, setHandoverPatient] = useState<Patient | null>(null)
  const patients = data.patients.filter((p) => p.careHome)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Care Home Mode</h1>
        <p className="max-w-xl text-sm text-navy-400">
          Supporting patients without family — a change in caregiver should not mean a reset in personalized care.
        </p>
      </div>

      {patients.length === 0 ? (
        <EmptyState icon="🏥" title="No care-home residents yet" description="Patients marked as care-home residents will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {patients.map((p) => {
            const caregiver = getCaregiver(p.assignedCaregiverId)
            const alerts = data.alerts.filter((a) => a.patientId === p.id && a.status !== 'resolved')
            return (
              <Card key={p.id}>
                <div className="flex items-center gap-3">
                  <PatientAvatar patient={p} size={52} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy-800">{p.name}</span>
                      <SeverityBadge severity={p.attentionStatus} />
                    </div>
                    <div className="text-xs text-navy-400">
                      Staff: {caregiver?.name} · <StageBadge stage={p.stage} size="sm" />
                    </div>
                  </div>
                </div>
                {alerts.length > 0 && <p className="mt-3 text-xs text-[var(--color-alert-yellow)]">{alerts.length} open alert(s)</p>}
                <SecondaryButton className="mt-3 w-full" onClick={() => setHandoverPatient(p)}>
                  View Care Continuity Card
                </SecondaryButton>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={!!handoverPatient} onClose={() => setHandoverPatient(null)} title="Care Continuity Card">
        {handoverPatient && <HandoverCard patient={handoverPatient} />}
      </Modal>
    </div>
  )
}

function HandoverCard({ patient }: { patient: Patient }) {
  const { preferences, routines } = usePatientData(patient.id)
  const positives = preferences.filter((p) => p.response === 'positive')
  const negatives = preferences.filter((p) => p.response === 'negative')

  return (
    <div className="space-y-3 text-sm">
      <Row label="Preferred name" value={patient.preferredName} />
      <Row label="Language" value={patient.language} />
      <Row label="Communication style" value={patient.communicationMode} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">Comfort activities</div>
        <p className="text-navy-600">{positives.map((p) => p.stimulus).join(', ') || 'None recorded'}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">Triggers / avoidances</div>
        <p className="text-navy-600">{negatives.map((p) => p.stimulus).join(', ') || 'None recorded'}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">Routines</div>
        <p className="text-navy-600">{routines.map((r) => `${r.title} (${r.time})`).join(', ')}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">Current care recommendation</div>
        <p className="text-navy-600">
          Use {positives[0]?.stimulus.toLowerCase() ?? 'familiar comfort activities'} to open the session; avoid{' '}
          {negatives[0]?.stimulus.toLowerCase() ?? 'high-complexity tasks'}.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-navy-50 pb-2">
      <span className="text-navy-400">{label}</span>
      <span className="font-medium text-navy-700">{value}</span>
    </div>
  )
}
