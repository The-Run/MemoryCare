import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData, usePatientData, useActivitiesForStage } from '../store/DataContext'
import { useToast } from '../components/Toast'
import { ActivityGenerationService, type ActivityRecommendation } from '../services/activityGenerationService'
import type { Activity, AssistanceLevel, EngagementLevel } from '../types'
import { ActivityCard } from '../components/ActivityCard'
import { ActivityPlayer } from '../components/ActivityPlayer'
import { ResponseControls } from '../components/ResponseControls'
import { StageBadge, Card, PrimaryButton, SecondaryButton, EmptyState, LoadingState } from '../components/atoms'
import { OfflineSyncIndicator } from '../components/OfflineSyncIndicator'

const MAX_ACTIVITIES = 4

export function CareSessionPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { addSession, addObservation, addAlert, logAudit } = useData()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { patient, preferences } = usePatientData(patientId)
  const stageActivities = useActivitiesForStage(patient?.stage)

  const [sessionId] = useState(() => `pending-${Date.now()}`)
  const initialPlan = useMemo<Activity[]>(() => stageActivities.slice(0, 3), [stageActivities])
  const [current, setCurrent] = useState<Activity | null>(null)

  // Open with the first activity of the generated plan once it's available.
  useEffect(() => {
    setCurrent((c) => c ?? initialPlan[0] ?? null)
  }, [initialPlan])
  const [history, setHistory] = useState<{ activity: Activity; engagement: EngagementLevel; assistance: AssistanceLevel }[]>([])
  const [aiNote, setAiNote] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)
  const [adapting, setAdapting] = useState(false)
  const [ended, setEnded] = useState(false)
  const [sessionStart] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [activityStart, setActivityStart] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStart) / 1000)), 1000)
    return () => clearInterval(t)
  }, [sessionStart])

  useEffect(() => {
    setActivityStart(Date.now())
  }, [current?.id])

  useEffect(() => {
    if (patient) logAudit('Started care session', patient.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id])

  if (!patient) return <EmptyState icon="🧑" title="Patient not found" />

  // In caregiver mode the caregiver always records the response explicitly,
  // so both "patient answered" and "I've shown this" just reveal the controls.
  const handleOutcome = () => {
    setShowControls(true)
  }

  // Raise a real, explained change alert when this session itself deviates
  // from the patient's usual pattern. Observational signal only — never a
  // diagnosis, and always with a recommended caregiver action.
  const raiseChangeAlertIfNeeded = (sessionHistory: { activity: Activity; engagement: EngagementLevel; assistance: AssistanceLevel }[]) => {
    if (!patient) return
    const assistedCount = sessionHistory.filter((h) => h.assistance === 'assisted' || h.assistance === 'no_response').length
    const negativeCount = sessionHistory.filter((h) => h.engagement === 'negative').length
    if (assistedCount < 2 && negativeCount < 2) return

    const concern = assistedCount >= 3 || negativeCount >= 3
    addAlert({
      patientId: patient.id,
      severity: concern ? 'red' : 'yellow',
      title: assistedCount >= negativeCount ? 'Increased assistance needed this session' : 'Lower engagement observed this session',
      whatChanged:
        assistedCount >= negativeCount
          ? `${patient.preferredName} needed assistance on ${assistedCount} of ${sessionHistory.length} activities in today's session.`
          : `${patient.preferredName} showed low engagement on ${negativeCount} of ${sessionHistory.length} activities in today's session.`,
      whyItMatters: 'This differs from the recent session pattern and is worth reviewing before the next session.',
      recommendedAction: 'Reduce activity complexity, open the next session with a familiar comfort activity, and review any recent routine changes.',
      status: 'new',
    })
    showToast('Change alert raised for caregiver review.', 'warning')
  }

  const handleResponse = ({ engagement, assistance, note }: { engagement: EngagementLevel; assistance: AssistanceLevel; note?: string }) => {
    if (!current) return
    const responseTime = Math.max(2, Math.round((Date.now() - activityStart) / 1000))

    addObservation({
      sessionId,
      patientId: patient.id,
      activityId: current.id,
      response: engagement,
      responseTime,
      assistanceRequired: assistance,
      engagement,
      caregiverNote: note,
    })

    const nextHistory = [...history, { activity: current, engagement, assistance }]
    setHistory(nextHistory)
    setShowControls(false)

    if (nextHistory.length >= MAX_ACTIVITIES) {
      const overall = summarize(nextHistory)
      addSession({ patientId: patient.id, date: new Date().toISOString(), duration: Math.round(elapsed / 60) || 1, stage: patient.stage, activityIds: nextHistory.map((h) => h.activity.id), overallEngagement: overall })
      raiseChangeAlertIfNeeded(nextHistory)
      setEnded(true)
      showToast('Session complete — summary recorded.', 'success')
      return
    }

    // Simulated AI processing so the adaptation is visible during the demo
    setAdapting(true)
    setCurrent(null)
    setTimeout(() => {
      const recommendation: ActivityRecommendation = ActivityGenerationService.generateNextActivity({
        patient,
        previousActivity: current,
        previousEngagement: engagement,
        assistanceRequired: assistance,
        recentActivityIds: nextHistory.map((h) => h.activity.id),
        preferences,
      })
      setAiNote(recommendation.reason)
      setCurrent(recommendation.activity)
      setAdapting(false)
    }, 1100)
  }

  if (ended) {
    const overall = summarize(history)
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold text-navy-900">Session Complete</h1>
        <p className="text-sm text-navy-400">
          {patient.preferredName} completed {history.length} activities in {Math.max(1, Math.round(elapsed / 60))} minutes. Overall engagement: <strong className="capitalize">{overall}</strong>.
        </p>
        <Card className="text-left">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy-400">What happened</h3>
          <ul className="space-y-1 text-sm text-navy-600">
            {history.map((h, i) => (
              <li key={i}>
                {h.activity.icon} {h.activity.title} — <span className="capitalize">{h.engagement}</span>, {formatAssistance(h.assistance)}
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex flex-wrap justify-center gap-2">
          <SecondaryButton onClick={() => navigate(`/patients/${patient.id}/insights`)}>View Insights</SecondaryButton>
          <SecondaryButton onClick={() => navigate('/copilot')}>Ask Copilot</SecondaryButton>
          <PrimaryButton onClick={() => navigate(`/patients/${patient.id}`)}>Back to Passport</PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-navy-900">{patient.name}</h1>
            <StageBadge stage={patient.stage} size="sm" />
          </div>
          <div className="text-xs text-navy-400">{patient.language} · Session time {formatTime(elapsed)}</div>
        </div>
        <OfflineSyncIndicator compact />
      </Card>

      <Card>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">AI-generated session plan</h3>
        <div className="space-y-2">
          {initialPlan.map((a, i) => (
            <ActivityCard key={a.id} activity={a} index={i} active={current?.id === a.id} />
          ))}
        </div>
      </Card>

      {adapting && (
        <div className="space-y-2">
          <LoadingState label="Analyzing recent responses…" />
          <LoadingState label="Generating next activity…" />
        </div>
      )}

      {aiNote && !adapting && (
        <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-4 text-sm text-navy-700">
          <span className="font-semibold text-navy-800">AI Recommendation: </span>
          {aiNote}
        </div>
      )}

      {current && (
        <>
          <ActivityPlayer
            key={current.id}
            activity={current}
            patient={patient}
            onOutcome={handleOutcome}
            onAdvance={handleOutcome}
          />
          {showControls && (
            <Card>
              <ResponseControls onSubmit={handleResponse} />
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function summarize(history: { engagement: EngagementLevel }[]): EngagementLevel {
  const counts = { positive: 0, neutral: 0, negative: 0 }
  history.forEach((h) => counts[h.engagement]++)
  if (counts.positive >= counts.neutral && counts.positive >= counts.negative) return 'positive'
  if (counts.negative > counts.neutral) return 'negative'
  return 'neutral'
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatAssistance(a: AssistanceLevel) {
  const map: Record<AssistanceLevel, string> = {
    independent: 'remembered independently',
    hint: 'needed a hint',
    assisted: 'needed assistance',
    no_response: 'no response',
  }
  return map[a]
}
