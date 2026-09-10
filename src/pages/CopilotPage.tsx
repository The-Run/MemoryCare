import { useMemo, useState } from 'react'
import { useData, usePatientData } from '../store/DataContext'
import { CaregiverCopilotService } from '../services/caregiverCopilotService'
import { CopilotRecommendation } from '../components/CopilotRecommendation'
import { Card, LoadingState } from '../components/atoms'

const QUESTIONS = [
  'What should I do with her today?',
  'What changed this week?',
  'Which activities work best for her?',
  'Why did the system choose this activity?',
  'Show me her recent concerns.',
]

export function CopilotPage() {
  const { data } = useData()
  const [patientId, setPatientId] = useState(data.patients[0]?.id)
  const [answer, setAnswer] = useState<string | null>(null)
  const [thinking, setThinking] = useState(false)

  const { patient, preferences, baselines, alerts, routines } = usePatientData(patientId)

  const recommendations = useMemo(
    () => (patient ? CaregiverCopilotService.generateRecommendations(patient, alerts, baselines, preferences, routines) : []),
    [patient, alerts, baselines, preferences, routines],
  )

  const ask = (q: string) => {
    if (!patient) return
    setThinking(true)
    setAnswer(null)
    // Simulated AI processing keeps the demo legible
    setTimeout(() => {
      setAnswer(CaregiverCopilotService.answerQuestion(q, { patient, alerts, baselines, preferences }))
      setThinking(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Caregiver AI Copilot</h1>
          <p className="text-sm text-navy-400">Structured, action-oriented recommendations.</p>
        </div>
        <select
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value)
            setAnswer(null)
          }}
          className="input max-w-[220px]"
        >
          {data.patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Suggested Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((card) => (
            <CopilotRecommendation key={card.id} card={card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Ask the Copilot</h2>
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q) => (
            <button key={q} onClick={() => ask(q)} className="chip hover:bg-navy-50">
              {q}
            </button>
          ))}
        </div>
        {thinking && (
          <div className="mt-4">
            <LoadingState label="Analyzing recent responses…" />
          </div>
        )}
        {answer && (
          <Card className="mt-4 whitespace-pre-line text-sm text-navy-700">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-400">Answer</span>
            {answer}
          </Card>
        )}
      </section>
    </div>
  )
}
