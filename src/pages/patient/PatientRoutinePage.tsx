import { useData, usePatientData } from '../../store/DataContext'
import { RoutineTimeline } from '../../components/RoutineTimeline'

export function PatientRoutinePage() {
  const { activePatientId } = useData()
  const { patient, routines } = usePatientData(activePatientId)
  if (!patient) return null

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-bold text-navy-800">Today</h1>
      <RoutineTimeline routines={routines} patientMode />
    </div>
  )
}
