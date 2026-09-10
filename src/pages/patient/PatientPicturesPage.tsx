import { useState } from 'react'
import { useData, usePatientData } from '../../store/DataContext'
import { VoiceService } from '../../services/voiceService'
import type { PatientPicture } from '../../types'

export function PatientPicturesPage() {
  const { activePatientId } = useData()
  const { patient, pictures } = usePatientData(activePatientId)
  const [selected, setSelected] = useState<PatientPicture | null>(null)
  if (!patient) return null

  if (selected) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div
          className="flex aspect-square w-full items-center justify-center rounded-3xl text-8xl card-shadow"
          style={{ background: selected.color }}
        >
          {selected.icon}
        </div>
        <h1 className="text-2xl font-bold text-navy-800">{selected.label}</h1>
        <p className="text-lg text-navy-500">{selected.description}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => VoiceService.speak(`${selected.label}. ${selected.description}`, patient.language)}
            className="patient-target rounded-full bg-navy-600 px-8 text-lg font-semibold text-white"
          >
            🔊 Listen
          </button>
          <button onClick={() => setSelected(null)} className="patient-target rounded-full border border-navy-200 px-8 text-lg font-semibold text-navy-600">
            Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-bold text-navy-800">My Pictures</h1>
      <div className="grid grid-cols-2 gap-4">
        {pictures.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="patient-target flex flex-col items-center gap-2 rounded-3xl p-5 card-shadow"
            style={{ background: p.color }}
          >
            <span className="text-5xl">{p.icon}</span>
            <span className="text-center text-base font-semibold text-navy-700">{p.label}</span>
          </button>
        ))}
      </div>
      {pictures.length === 0 && <p className="text-center text-navy-400">No pictures added yet.</p>}
    </div>
  )
}
