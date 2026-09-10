import type { Patient } from '../types'

export function PatientAvatar({ patient, size = 48 }: { patient: Pick<Patient, 'avatarInitials' | 'avatarColor' | 'name'>; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: patient.avatarColor, fontSize: size * 0.36 }}
      aria-label={patient.name}
    >
      {patient.avatarInitials}
    </div>
  )
}
