import { useState } from 'react'
import { useData, usePatientData } from '../../store/DataContext'
import { VoiceService } from '../../services/voiceService'

export function PatientMusicPage() {
  const { activePatientId } = useData()
  const { patient, music: tracks } = usePatientData(activePatientId)
  const [playingId, setPlayingId] = useState<string | null>(null)
  if (!patient) return null

  const toggle = (id: string, title: string) => {
    if (playingId === id) {
      VoiceService.stopSpeaking()
      setPlayingId(null)
      return
    }
    VoiceService.speak(title, patient.language)
    setPlayingId(id)
    setTimeout(() => setPlayingId((p) => (p === id ? null : p)), 4000)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-bold text-navy-800">My Music</h1>
      <div className="space-y-4">
        {tracks.map((t) => (
          <div key={t.id} className="flex items-center gap-4 rounded-3xl bg-white p-5 card-shadow">
            <span className="text-4xl">{t.icon}</span>
            <div className="flex-1">
              <div className="text-lg font-semibold text-navy-700">{t.title}</div>
              <div className="text-sm text-navy-400">{t.region}</div>
            </div>
            <button
              onClick={() => toggle(t.id, t.title)}
              className="patient-target flex h-16 w-16 items-center justify-center rounded-full bg-navy-600 text-2xl text-white"
            >
              {playingId === t.id ? '❚❚' : '▶'}
            </button>
          </div>
        ))}
        {tracks.length === 0 && <p className="text-center text-navy-400">No music added yet.</p>}
      </div>
    </div>
  )
}
