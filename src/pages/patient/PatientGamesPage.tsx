import { useEffect, useRef, useState } from 'react'
import { useData, usePatientData, useActivitiesForStage } from '../../store/DataContext'
import { ActivityGenerationService } from '../../services/activityGenerationService'
import { ActivityPlayer } from '../../components/ActivityPlayer'
import type { Activity, ActivityType } from '../../types'

const CATEGORIES: { type: ActivityType; label: string; icon: string }[] = [
  { type: 'recognition', label: 'Recognition', icon: '🙂' },
  { type: 'memory', label: 'Memory', icon: '🧠' },
  { type: 'attention', label: 'Attention', icon: '👀' },
  { type: 'language', label: 'Language', icon: '💬' },
  { type: 'sequencing', label: 'Sequencing', icon: '🔢' },
  { type: 'comfort', label: 'Calm & Music', icon: '🎼' },
]

/** How long the encouraging feedback stays on screen before moving on. */
const FEEDBACK_MS = 2600

export function PatientGamesPage() {
  const { activePatientId, addObservation } = useData()
  const { patient, preferences } = usePatientData(activePatientId)
  const pool = useActivitiesForStage(patient?.stage)
  const [current, setCurrent] = useState<Activity | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const advanceTimer = useRef<number | null>(null)

  // Never leave a pending auto-advance running after unmount / manual Next.
  const clearTimer = () => {
    if (advanceTimer.current !== null) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }
  useEffect(() => clearTimer, [])

  if (!patient) return null

  const availableCategories = CATEGORIES.filter((c) => pool.some((a) => a.type === c.type))

  const startCategory = (type: ActivityType) => {
    const first = pool.find((a) => a.type === type) ?? pool[0]
    if (!first) return
    setCurrent(first)
    setHistory([first.id])
  }

  const goToNextActivity = (opts?: { engagement?: 'positive' | 'neutral'; assistance?: 'independent' | 'hint' }) => {
    clearTimer()
    if (!current) return
    const { activity } = ActivityGenerationService.generateNextActivity({
      patient,
      previousActivity: current,
      previousEngagement: opts?.engagement,
      assistanceRequired: opts?.assistance,
      recentActivityIds: history,
      preferences,
    })
    setCurrent(activity)
    setHistory((h) => [...h, activity.id])
  }

  // A real response from the patient: record it, then adapt after the
  // encouraging feedback has had time to be read.
  const handleOutcome = (outcome: { correct?: boolean; label?: string }) => {
    if (!current) return
    const engagement = outcome.correct === false ? 'neutral' : 'positive'
    const assistance = outcome.correct === false ? 'hint' : 'independent'

    addObservation({
      sessionId: 'patient-mode-games',
      patientId: patient.id,
      activityId: current.id,
      response: engagement,
      responseTime: 5,
      assistanceRequired: assistance,
      engagement,
      caregiverNote: 'Recorded during Patient Mode mind game.',
    })

    clearTimer()
    advanceTimer.current = window.setTimeout(() => goToNextActivity({ engagement, assistance }), FEEDBACK_MS)
  }

  if (current) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <button onClick={() => { clearTimer(); setCurrent(null) }} className="text-lg text-navy-400">
          ← Back to games
        </button>
        <ActivityPlayer
          key={current.id}
          activity={current}
          patient={patient}
          patientMode
          onOutcome={handleOutcome}
          onAdvance={() => goToNextActivity()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-bold text-navy-800">Mind Games</h1>
      <div className="grid grid-cols-2 gap-4">
        {availableCategories.map((c) => (
          <button
            key={c.type}
            onClick={() => startCategory(c.type)}
            className="patient-target flex flex-col items-center gap-2 rounded-3xl bg-white p-6 card-shadow"
          >
            <span className="text-5xl">{c.icon}</span>
            <span className="text-lg font-semibold text-navy-700">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
