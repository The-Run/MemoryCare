import type { Activity, AssistanceLevel, EngagementLevel, Patient, Preference } from '../types'
import { activities } from '../data/activities'

export interface ActivityRecommendation {
  activity: Activity
  reason: string
}

interface GenerateParams {
  patient: Patient
  previousActivity?: Activity
  previousEngagement?: EngagementLevel
  assistanceRequired?: AssistanceLevel
  recentActivityIds?: string[]
  preferences?: Preference[]
}

// ActivityGenerationService — the deterministic rule/policy engine described
// in BUILD SPEC §9. This intentionally is NOT an LLM: stage, safety and
// difficulty decisions must stay predictable and explainable in the demo.
export const ActivityGenerationService = {
  generateNextActivity({
    patient,
    previousActivity,
    previousEngagement,
    assistanceRequired,
    recentActivityIds = [],
    preferences = [],
  }: GenerateParams): ActivityRecommendation {
    const pool = activities.filter((a) => a.stage === patient.stage)

    const scored = pool.map((activity) => {
      let score = 50 + Math.random() * 5

      // IF previous activity = HIGH_ENGAGEMENT -> increase probability of similar
      if (previousActivity && previousEngagement === 'positive' && activity.type === previousActivity.type) {
        score += 25
      }
      // IF previous activity = LOW_ENGAGEMENT -> reduce probability of similar
      if (previousActivity && previousEngagement === 'negative' && activity.type === previousActivity.type) {
        score -= 40
      }
      // IF patient requires repeated assistance -> reduce complexity
      if (assistanceRequired === 'assisted' || assistanceRequired === 'no_response') {
        if (activity.difficulty === 'low') score += 25
        if (activity.difficulty === 'high') score -= 35
      }
      if (assistanceRequired === 'hint' && activity.difficulty === 'high') {
        score -= 15
      }
      // Avoid immediately repeating the exact same activity
      if (previousActivity && activity.id === previousActivity.id) score -= 60
      if (recentActivityIds.includes(activity.id)) score -= 20

      // Prefer stimuli with an observed positive personal preference
      const relatedCategory = activity.type === 'music' || activity.type === 'comfort' ? 'music' : 'activity'
      const positivePref = preferences.find((p) => p.category === relatedCategory && p.response === 'positive')
      const negativePref = preferences.find((p) => p.category === relatedCategory && p.response === 'negative')
      if (positivePref) score += positivePref.engagementScore / 4
      if (negativePref) score -= negativePref.engagementScore / 4

      return { activity, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const chosen = scored[0]?.activity ?? pool[0]

    return { activity: chosen, reason: buildReason({ chosen, previousActivity, previousEngagement, assistanceRequired }) }
  },
}

function buildReason({
  chosen,
  previousActivity,
  previousEngagement,
  assistanceRequired,
}: {
  chosen: Activity
  previousActivity?: Activity
  previousEngagement?: EngagementLevel
  assistanceRequired?: AssistanceLevel
}): string {
  if (!previousActivity) {
    return `Starting with a ${chosen.stage}-stage ${chosen.type} activity based on the current care plan.`
  }
  if (previousEngagement === 'positive' && chosen.type === previousActivity.type) {
    return `Positive engagement detected with ${previousActivity.title.toLowerCase()}. Continuing with a similar ${chosen.type} activity.`
  }
  if (previousEngagement === 'negative') {
    return `Lower engagement observed with the last activity. Switching from ${previousActivity.type} to a gentler ${chosen.type} activity.`
  }
  if (assistanceRequired === 'assisted' || assistanceRequired === 'no_response') {
    return `Assistance was needed on the last activity. Reducing complexity and choosing a simpler ${chosen.type} activity.`
  }
  if (previousEngagement === 'positive') {
    return `Positive engagement detected. Moving to the next planned ${chosen.type} activity.`
  }
  return `Adjusting the next activity to a ${chosen.difficulty}-difficulty ${chosen.type} task based on the recent response.`
}
