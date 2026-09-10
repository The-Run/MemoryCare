import type { Session, Observation } from '../types'

// A short realistic session/observation history, focused on Anima Das
// (the primary demo patient) with lighter history for the others.
// Dates step backward from "today" (2026-09-09) in the demo timeline.
function iso(daysAgo: number, hour = 9) {
  const d = new Date('2026-09-09T00:00:00+05:30')
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export const sessions: Session[] = [
  { id: 's1', patientId: 'p-anima-das', date: iso(0, 8), duration: 18, stage: 'moderate', activityIds: ['a-music-1', 'a-recog-2', 'a-voice-2'], overallEngagement: 'positive' },
  { id: 's2', patientId: 'p-anima-das', date: iso(2), duration: 15, stage: 'moderate', activityIds: ['a-recog-2', 'a-attn-1'], overallEngagement: 'neutral' },
  { id: 's3', patientId: 'p-anima-das', date: iso(4), duration: 16, stage: 'moderate', activityIds: ['a-music-1', 'a-mem-2'], overallEngagement: 'positive' },
  { id: 's4', patientId: 'p-anima-das', date: iso(6), duration: 14, stage: 'moderate', activityIds: ['a-recog-3', 'a-voice-2'], overallEngagement: 'neutral' },
  { id: 's5', patientId: 'p-anima-das', date: iso(9), duration: 15, stage: 'moderate', activityIds: ['a-recog-2', 'a-mem-2'], overallEngagement: 'neutral' },
  { id: 's6', patientId: 'p-anima-das', date: iso(11), duration: 17, stage: 'moderate', activityIds: ['a-music-1', 'a-recog-3'], overallEngagement: 'positive' },
  { id: 's7', patientId: 'p-anima-das', date: iso(13), duration: 15, stage: 'moderate', activityIds: ['a-recog-2', 'a-attn-1'], overallEngagement: 'positive' },

  { id: 's8', patientId: 'p-ranjit-singh', date: iso(1, 10), duration: 20, stage: 'early', activityIds: ['a-recall-1', 'a-seq-1'], overallEngagement: 'positive' },
  { id: 's9', patientId: 'p-ranjit-singh', date: iso(5), duration: 18, stage: 'early', activityIds: ['a-voice-1', 'a-recog-1'], overallEngagement: 'positive' },

  { id: 's10', patientId: 'p-banri-kharshiing', date: iso(3, 16), duration: 16, stage: 'early', activityIds: ['a-lang-1', 'a-recog-1'], overallEngagement: 'positive' },

  { id: 's11', patientId: 'p-ibomcha', date: iso(0, 7), duration: 10, stage: 'advanced', activityIds: ['a-comfort-1', 'a-sensory-1'], overallEngagement: 'positive' },
  { id: 's12', patientId: 'p-ibomcha', date: iso(2), duration: 9, stage: 'advanced', activityIds: ['a-comfort-2', 'a-voice-3'], overallEngagement: 'neutral' },

  { id: 's13', patientId: 'p-pemba-sherpa', date: iso(2, 11), duration: 14, stage: 'moderate', activityIds: ['a-voice-2', 'a-recog-3'], overallEngagement: 'neutral' },

  { id: 's14', patientId: 'p-bijoya-tripura', date: iso(3, 9), duration: 15, stage: 'early', activityIds: ['a-recall-1', 'a-lang-1'], overallEngagement: 'positive' },
]

export const observations: Observation[] = [
  { id: 'o1', sessionId: 's1', patientId: 'p-anima-das', activityId: 'a-music-1', response: 'positive', responseTime: 6, assistanceRequired: 'independent', engagement: 'positive', caregiverNote: 'Smiled and hummed along to Bihu song.', createdAt: iso(0, 8) },
  { id: 'o2', sessionId: 's1', patientId: 'p-anima-das', activityId: 'a-recog-2', response: 'neutral', responseTime: 15, assistanceRequired: 'hint', engagement: 'neutral', createdAt: iso(0, 8) },
  { id: 'o3', sessionId: 's2', patientId: 'p-anima-das', activityId: 'a-recog-2', response: 'neutral', responseTime: 16, assistanceRequired: 'hint', engagement: 'neutral', createdAt: iso(2) },
  { id: 'o4', sessionId: 's3', patientId: 'p-anima-das', activityId: 'a-music-1', response: 'positive', responseTime: 5, assistanceRequired: 'independent', engagement: 'positive', createdAt: iso(4) },
  { id: 'o5', sessionId: 's4', patientId: 'p-anima-das', activityId: 'a-recog-3', response: 'neutral', responseTime: 14, assistanceRequired: 'assisted', engagement: 'neutral', createdAt: iso(6) },
  { id: 'o6', sessionId: 's5', patientId: 'p-anima-das', activityId: 'a-recog-2', response: 'neutral', responseTime: 11, assistanceRequired: 'hint', engagement: 'neutral', createdAt: iso(9) },
  { id: 'o7', sessionId: 's6', patientId: 'p-anima-das', activityId: 'a-music-1', response: 'positive', responseTime: 7, assistanceRequired: 'independent', engagement: 'positive', createdAt: iso(11) },
  { id: 'o8', sessionId: 's7', patientId: 'p-anima-das', activityId: 'a-recog-2', response: 'positive', responseTime: 8, assistanceRequired: 'independent', engagement: 'positive', createdAt: iso(13) },

  { id: 'o9', sessionId: 's8', patientId: 'p-ranjit-singh', activityId: 'a-recall-1', response: 'positive', responseTime: 9, assistanceRequired: 'independent', engagement: 'positive', createdAt: iso(1, 10) },
  { id: 'o10', sessionId: 's11', patientId: 'p-ibomcha', activityId: 'a-comfort-1', response: 'positive', responseTime: 4, assistanceRequired: 'no_response', engagement: 'positive', caregiverNote: 'Calmed noticeably once music started.', createdAt: iso(0, 7) },
]

export const getSessionsForPatient = (patientId: string) =>
  sessions.filter((s) => s.patientId === patientId).sort((a, b) => (a.date < b.date ? 1 : -1))

export const getObservationsForPatient = (patientId: string) =>
  observations.filter((o) => o.patientId === patientId)
