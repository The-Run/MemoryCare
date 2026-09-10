import { useParams } from 'react-router-dom'
import { usePatientData } from '../store/DataContext'
import { BehavioralAnalysisService } from '../services/behavioralAnalysisService'
import { BaselineService } from '../services/baselineService'
import { EngagementMeter } from '../components/EngagementMeter'
import { ChangeIndicator } from '../components/ChangeIndicator'
import { BaselineChart } from '../components/BaselineChart'
import { Card, EmptyState } from '../components/atoms'

export function PatientInsightsPage() {
  const { id } = useParams<{ id: string }>()
  const { patient, preferences, baselines, observations } = usePatientData(id)
  if (!patient) return <EmptyState icon="🧑" title="Patient not found" />

  const engagementSummary = BehavioralAnalysisService.summarizeEngagementByStimulus(preferences)
  const trend = BehavioralAnalysisService.responseTimeTrend(observations)
  const deviatedBaselines = baselines.filter((b) => BaselineService.evaluate(b).deviated)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Behavior & Personal Baseline — {patient.name}</h1>
        <p className="max-w-2xl text-sm text-navy-400">
          Observed engagement, not emotion detection. Every trend below is compared against {patient.preferredName}'s
          own personal history — never a general population score.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Observed Engagement by Stimulus</h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          {engagementSummary.map((e) => (
            <div key={e.stimulus}>
              <EngagementMeter score={e.score} label={`${e.stimulus} (${e.category})`} />
            </div>
          ))}
          {engagementSummary.length === 0 && <p className="text-sm text-navy-400">No engagement data yet.</p>}
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Response Time — Recent Sessions</h2>
        <Card>
          {trend.length > 0 ? (
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {trend.map((t) => (
                <div key={t.index} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t bg-navy-500"
                    style={{ height: `${Math.max(6, Math.min(100, (t.responseTime / 20) * 100))}%` }}
                    title={`${t.responseTime}s`}
                  />
                  <span className="text-[10px] text-navy-400">{t.responseTime}s</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-navy-400">No session history yet.</p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Personal Baseline</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {baselines.map((b) => (
            <Card key={b.metric}>
              <ChangeIndicator baseline={b} />
              <div className="mt-3">
                <BaselineChart baseline={b} />
              </div>
            </Card>
          ))}
          {baselines.length === 0 && <p className="text-sm text-navy-400">Not enough sessions yet to establish a baseline.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Change Summary</h2>
        {deviatedBaselines.length === 0 ? (
          <Card className="text-sm text-navy-500">No meaningful deviation detected from personal baseline.</Card>
        ) : (
          <div className="space-y-3">
            {deviatedBaselines.map((b) => {
              const evalResult = BaselineService.evaluate(b)
              return (
                <Card key={b.metric} className="text-sm">
                  <p className="font-semibold text-navy-800">Meaningful deviation detected: {b.label}</p>
                  <p className="mt-1 text-navy-500">
                    Changed {Math.abs(b.changePercent)}% since baseline (confidence {Math.round(b.confidence * 100)}%).
                  </p>
                  <p className="mt-2 rounded-lg bg-navy-50/70 p-2 text-navy-600">{evalResult.message}</p>
                </Card>
              )
            })}
          </div>
        )}
        <p className="mt-3 text-xs italic text-navy-300">
          This is an observational change signal, not a diagnosis, and should be reviewed by a caregiver/clinician.
        </p>
      </section>
    </div>
  )
}
