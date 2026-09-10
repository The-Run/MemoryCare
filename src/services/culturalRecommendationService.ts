import type { Activity, NerState, Preference, Stage } from '../types'
import { activities } from '../data/activities'
import { getCulturalData } from '../data/cultural'

export interface CandidateActivity extends Activity {
  culturalNote?: string
}

// CulturalRecommendationService — turns NER cultural knowledge into
// CANDIDATE stimuli only. It never assumes a candidate is a confirmed
// personal preference; ActivityGenerationService still checks the
// patient's own observed responses before using it.
export const CulturalRecommendationService = {
  getCandidateActivities(state: NerState, stage: Stage, preferences: Preference[]): CandidateActivity[] {
    const cultural = getCulturalData(state)
    const pool = activities.filter((a) => a.stage === stage)

    return pool.map((activity) => {
      let culturalNote: string | undefined
      if (cultural) {
        if (activity.type === 'music' && cultural.music[0]) {
          culturalNote = `Candidate: ${cultural.music[0].title} (${state})`
        } else if (activity.type === 'comfort' && cultural.music[0]) {
          culturalNote = `Candidate: ${cultural.music[0].title}, calming (${state})`
        } else if (activity.type === 'conversation') {
          culturalNote = `Candidate topic: ${cultural.places[0]?.title ?? cultural.food[0]?.title} (${state})`
        }
      }
      // If the patient has an observed personal preference for this
      // stimulus type, that always outranks the generic cultural guess.
      const personalMatch = preferences.find(
        (p) => p.category === (activity.type === 'music' || activity.type === 'comfort' ? 'music' : 'activity') && p.response === 'positive',
      )
      if (personalMatch) {
        culturalNote = `Personalized: ${personalMatch.stimulus} (observed preference)`
      }
      return { ...activity, culturalNote }
    })
  },

  getStateData(state: NerState) {
    return getCulturalData(state)
  },
}
