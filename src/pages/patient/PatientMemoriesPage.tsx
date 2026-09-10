import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData, usePatientData } from '../../store/DataContext'
import { VoiceService } from '../../services/voiceService'
import type { Memory } from '../../types'

const CATEGORY_LABEL: Record<Memory['category'], string> = {
  person: 'People', place: 'Places', music: 'Music', food: 'Food', occupation: 'Work', event: 'Moments', routine: 'Routine', hobby: 'Hobbies',
}

export function PatientMemoriesPage() {
  const { activePatientId } = useData()
  const navigate = useNavigate()
  const { patient, memories } = usePatientData(activePatientId)
  const [open, setOpen] = useState<Memory | null>(null)
  if (!patient) return null

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-2xl text-navy-500">←</button>
        <h1 className="text-2xl font-bold text-navy-800">My Memories</h1>
        <span className="w-6" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {memories.map((m) => (
          <button key={m.id} onClick={() => setOpen(m)} className="patient-target flex flex-col items-center gap-2 rounded-3xl bg-white p-5 card-shadow">
            <span className="text-5xl">{m.icon}</span>
            <span className="text-center text-base font-semibold text-navy-700">{m.title}</span>
            <span className="text-xs text-navy-400">{CATEGORY_LABEL[m.category]}</span>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl">{open.icon}</div>
            <h2 className="mt-3 text-xl font-bold text-navy-800">{open.title}</h2>
            <p className="mt-2 text-navy-500">{open.description}</p>
            <button
              onClick={() => VoiceService.speak(`${open.title}. ${open.description}`, patient.language)}
              className="patient-target mt-4 w-full rounded-full bg-navy-600 text-lg font-semibold text-white"
            >
              🔊 Listen to story
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
