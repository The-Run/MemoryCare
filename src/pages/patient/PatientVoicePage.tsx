import { useState } from 'react'
import { useData, usePatientData } from '../../store/DataContext'
import { VoiceService } from '../../services/voiceService'

const PROMPTS = ["What's next today?", 'Tell me a story', 'Play some music', 'How are you today?']

export function PatientVoicePage() {
  const { activePatientId } = useData()
  const { patient, routines, memories, music } = usePatientData(activePatientId)
  const [listening, setListening] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  if (!patient) return null

  const respond = (prompt: string) => {
    let text = "I'm here with you."
    if (prompt.includes('next')) {
      const next = routines.find((r) => r.status === 'upcoming')
      text = next ? `Next up: ${next.title} at ${next.time}.` : "You're all caught up for today."
    } else if (prompt.includes('story')) {
      const mem = memories[0]
      text = mem ? `Let me tell you about ${mem.title}. ${mem.description}` : 'I would love to hear one of your stories.'
    } else if (prompt.includes('music')) {
      const track = music[0]
      text = track ? `Playing ${track.title} for you now.` : 'Let\'s find some music you like.'
    } else if (prompt.includes('how are')) {
      text = `I'm glad you're here, ${patient.preferredName}. How are you feeling today?`
    }
    setReply(text)
    VoiceService.speak(text, patient.language)
  }

  const handleTap = () => {
    setListening(true)
    setTimeout(() => {
      setListening(false)
      respond(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
    }, 1400)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 pt-6 text-center">
      <h1 className="text-2xl font-bold text-navy-800">Talk to me</h1>
      <button
        onClick={handleTap}
        className={`flex h-32 w-32 items-center justify-center rounded-full text-5xl text-white transition ${
          listening ? 'animate-pulse bg-[var(--color-alert-yellow)]' : 'bg-navy-600'
        }`}
      >
        🎙️
      </button>
      <p className="text-lg text-navy-400">{listening ? 'Listening…' : 'Tap the microphone and speak'}</p>

      {reply && <div className="w-full rounded-3xl bg-white p-5 text-lg text-navy-700 card-shadow">{reply}</div>}

      <div className="flex flex-wrap justify-center gap-2">
        {PROMPTS.map((p) => (
          <button key={p} onClick={() => respond(p)} className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-600">
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
