import { Link } from 'react-router-dom'
import type { Patient } from '../types'
import { PatientAvatar } from './PatientAvatar'
import { StageBadge, SeverityBadge } from './atoms'

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Link
      to={`/patients/${patient.id}`}
      className="flex items-center gap-4 rounded-2xl bg-white p-4 card-shadow transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <PatientAvatar patient={patient} size={56} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold text-navy-800">{patient.name}</h3>
          <SeverityBadge severity={patient.attentionStatus} />
        </div>
        <div className="mt-1 text-sm text-navy-400">
          {patient.age} yrs · {patient.language} · {patient.state}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <StageBadge stage={patient.stage} size="sm" />
          {patient.careHome && <span className="text-xs text-navy-400">🏠 Care Home</span>}
          {!patient.familyAvailable && <span className="text-xs text-navy-400">No family contact</span>}
        </div>
      </div>
      <div className="hidden text-right text-xs text-navy-400 sm:block">
        Last session
        <br />
        {patient.lastSessionAt ? new Date(patient.lastSessionAt).toLocaleDateString() : '—'}
      </div>
    </Link>
  )
}
