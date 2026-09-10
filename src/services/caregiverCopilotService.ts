import type { Alert, BaselineMetric, CopilotRecommendationCard, Patient, Preference, Routine } from '../types'
import { newId } from './id'
import { BaselineService } from './baselineService'

// CaregiverCopilotService — structured, action-oriented recommendations.
// Deliberately NOT a general chat UI: every output is a card with an
// observation + a concrete recommended action, or a canned structured
// answer to one of the suggested questions.
export const CaregiverCopilotService = {
  generateRecommendations(
    patient: Patient,
    alerts: Alert[],
    baselines: BaselineMetric[],
    preferences: Preference[],
    routines: Routine[],
  ): CopilotRecommendationCard[] {
    const cards: CopilotRecommendationCard[] = []

    const topPreference = [...preferences].sort((a, b) => b.engagementScore - a.engagementScore)[0]
    if (topPreference && topPreference.response === 'positive') {
      cards.push({
        id: newId('rec'),
        patientId: patient.id,
        headline: `${patient.preferredName} responds well to ${topPreference.stimulus.toLowerCase()}`,
        observation: `${patient.preferredName} appears more engaged with ${topPreference.stimulus.toLowerCase()}.`,
        recommendation: `Use ${topPreference.stimulus.toLowerCase()} before the next recognition or recall activity.`,
        priority: 'medium',
      })
    }

    for (const baseline of baselines) {
      const evalResult = BaselineService.evaluate(baseline)
      if (evalResult.deviated) {
        cards.push({
          id: newId('rec'),
          patientId: patient.id,
          headline: `${baseline.label} has changed`,
          observation: `${patient.preferredName}'s ${baseline.label.toLowerCase()} has changed ${Math.abs(baseline.changePercent)}% from baseline.`,
          recommendation:
            baseline.metric === 'responseTime' || baseline.metric === 'assistanceRate'
              ? 'Reduce activity complexity and use simple two-choice recognition tasks.'
              : 'Continue current activities and monitor over the next few sessions.',
          priority: evalResult.severity === 'red' ? 'high' : 'medium',
        })
      }
    }

    const missedRoutine = routines.find((r) => r.status === 'missed')
    if (missedRoutine) {
      cards.push({
        id: newId('rec'),
        patientId: patient.id,
        headline: `${missedRoutine.title} was missed`,
        observation: `${missedRoutine.title} scheduled at ${missedRoutine.time} was not marked complete.`,
        recommendation: 'Contact the assigned caregiver and confirm status before the next scheduled dose.',
        priority: 'high',
      })
    }

    const openAlert = alerts.find((a) => a.status === 'new')
    if (openAlert) {
      cards.push({
        id: newId('rec'),
        patientId: patient.id,
        headline: openAlert.title,
        observation: openAlert.whatChanged,
        recommendation: openAlert.recommendedAction,
        priority: openAlert.severity === 'red' ? 'high' : 'medium',
      })
    }

    if (cards.length === 0) {
      cards.push({
        id: newId('rec'),
        patientId: patient.id,
        headline: 'Engagement is stable',
        observation: `No meaningful change detected for ${patient.preferredName} this week.`,
        recommendation: 'Continue the current activity plan.',
        priority: 'low',
      })
    }

    // Dedupe near-identical cards (e.g. a baseline deviation that's also a raised alert)
    const seen = new Set<string>()
    return cards.filter((c) => {
      const key = c.recommendation.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  },

  /** Structured answers to the suggested Copilot questions (rule-based, not a generic chatbot). */
  answerQuestion(
    question: string,
    ctx: { patient: Patient; alerts: Alert[]; baselines: BaselineMetric[]; preferences: Preference[] },
  ): string {
    const q = question.toLowerCase()
    const { patient, alerts, baselines, preferences } = ctx
    const topPreference = [...preferences].sort((a, b) => b.engagementScore - a.engagementScore)[0]
    const worstBaseline = [...baselines].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0]

    if (q.includes('today')) {
      return `Today, try ${topPreference ? topPreference.stimulus.toLowerCase() : 'a familiar comfort activity'} first, then a simple recognition activity. Avoid high-complexity recall tasks for now.`
    }
    if (q.includes('changed') || q.includes('this week')) {
      return worstBaseline
        ? `${worstBaseline.label} changed ${Math.abs(worstBaseline.changePercent)}% from ${patient.preferredName}'s personal baseline this week (trend: ${worstBaseline.trend}).`
        : `No significant change was observed for ${patient.preferredName} this week.`
    }
    if (q.includes('work best') || q.includes('activities')) {
      return topPreference
        ? `${topPreference.stimulus} shows the strongest observed engagement (${topPreference.engagementScore}/100).`
        : `Not enough observations yet to recommend a top activity.`
    }
    if (q.includes('why') && q.includes('activity')) {
      return `The system prioritizes activities that matched recent positive engagement and reduces complexity after sessions where ${patient.preferredName} needed assistance.`
    }
    if (q.includes('concern')) {
      const openAlerts = alerts.filter((a) => a.status !== 'resolved')
      return openAlerts.length
        ? openAlerts.map((a) => `• ${a.title}`).join('\n')
        : `No open concerns for ${patient.preferredName} right now.`
    }
    return `Here's what I have for ${patient.preferredName}: ${topPreference ? `strongest response to ${topPreference.stimulus.toLowerCase()}` : 'no strong preference yet'}, and ${worstBaseline ? `${worstBaseline.label.toLowerCase()} trending ${worstBaseline.trend}` : 'stable recent sessions'}.`
  },
}
