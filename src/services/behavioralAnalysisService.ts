import type { Observation, Preference } from '../types'

export interface EngagementSummary {
  stimulus: string
  category: string
  level: 'High' | 'Medium' | 'Low'
  score: number
}

// BehavioralAnalysisService — turns observation/preference history into
// "observed engagement" summaries. Deliberately avoids any language that
// claims to detect emotion (see BUILD SPEC §19).
export const BehavioralAnalysisService = {
  summarizeEngagementByStimulus(preferences: Preference[]): EngagementSummary[] {
    return preferences
      .map((p) => ({
        stimulus: p.stimulus,
        category: p.category,
        score: p.engagementScore,
        level: (p.engagementScore >= 70 ? 'High' : p.engagementScore >= 40 ? 'Medium' : 'Low') as EngagementSummary['level'],
      }))
      .sort((a, b) => b.score - a.score)
  },

  responseTimeTrend(observations: Observation[]) {
    return [...observations]
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      .map((o, i) => ({ index: i + 1, responseTime: o.responseTime, date: o.createdAt }))
  },

  engagementCounts(observations: Observation[]) {
    return observations.reduce(
      (acc, o) => {
        acc[o.engagement] += 1
        return acc
      },
      { positive: 0, neutral: 0, negative: 0 } as Record<'positive' | 'neutral' | 'negative', number>,
    )
  },

  assistanceCounts(observations: Observation[]) {
    return observations.reduce(
      (acc, o) => {
        acc[o.assistanceRequired] += 1
        return acc
      },
      { independent: 0, hint: 0, assisted: 0, no_response: 0 } as Record<Observation['assistanceRequired'], number>,
    )
  },
}
