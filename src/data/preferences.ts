import type { Preference } from '../types'

export const preferences: Preference[] = [
  // Anima Das — strong music response, medium recognition, low complex text
  { id: 'pr1', patientId: 'p-anima-das', stimulus: 'Assamese folk / Bihu music', category: 'music', response: 'positive', engagementScore: 92, confidence: 0.9, source: 'observed' },
  { id: 'pr2', patientId: 'p-anima-das', stimulus: 'Nature imagery (river, fields)', category: 'visual', response: 'positive', engagementScore: 80, confidence: 0.85, source: 'observed' },
  { id: 'pr3', patientId: 'p-anima-das', stimulus: 'Familiar cooking conversation', category: 'topic', response: 'positive', engagementScore: 75, confidence: 0.8, source: 'observed' },
  { id: 'pr4', patientId: 'p-anima-das', stimulus: 'Photo recognition (family)', category: 'activity', response: 'neutral', engagementScore: 58, confidence: 0.7, source: 'observed' },
  { id: 'pr5', patientId: 'p-anima-das', stimulus: 'Loud audio', category: 'audio', response: 'negative', engagementScore: 20, confidence: 0.75, source: 'observed' },
  { id: 'pr6', patientId: 'p-anima-das', stimulus: 'Complex text-based activities', category: 'activity', response: 'negative', engagementScore: 15, confidence: 0.8, source: 'observed' },

  // Ranjit Singh
  { id: 'pr7', patientId: 'p-ranjit-singh', stimulus: 'Carrom / tactile games', category: 'activity', response: 'positive', engagementScore: 88, confidence: 0.85, source: 'observed' },
  { id: 'pr8', patientId: 'p-ranjit-singh', stimulus: 'Naga folk songs', category: 'music', response: 'positive', engagementScore: 82, confidence: 0.8, source: 'observed' },
  { id: 'pr9', patientId: 'p-ranjit-singh', stimulus: 'Sequencing / recall tasks', category: 'activity', response: 'positive', engagementScore: 78, confidence: 0.75, source: 'observed' },

  // Banri Kharshiing
  { id: 'pr10', patientId: 'p-banri-kharshiing', stimulus: 'Weaving-related conversation', category: 'topic', response: 'positive', engagementScore: 90, confidence: 0.88, source: 'observed' },
  { id: 'pr11', patientId: 'p-banri-kharshiing', stimulus: 'Khasi folk chants', category: 'music', response: 'positive', engagementScore: 84, confidence: 0.8, source: 'observed' },

  // Ngangbam Ibomcha — advanced, comfort-focused
  { id: 'pr12', patientId: 'p-ibomcha', stimulus: 'Pena recitals (calming)', category: 'music', response: 'positive', engagementScore: 70, confidence: 0.6, source: 'observed' },
  { id: 'pr13', patientId: 'p-ibomcha', stimulus: 'Sudden loud noise', category: 'audio', response: 'negative', engagementScore: 10, confidence: 0.7, source: 'observed' },
  { id: 'pr14', patientId: 'p-ibomcha', stimulus: 'Gentle touch / hand-holding', category: 'activity', response: 'positive', engagementScore: 75, confidence: 0.65, source: 'observed' },

  // Pemba Sherpa
  { id: 'pr15', patientId: 'p-pemba-sherpa', stimulus: 'Shop / market conversation', category: 'topic', response: 'positive', engagementScore: 77, confidence: 0.75, source: 'observed' },
  { id: 'pr16', patientId: 'p-pemba-sherpa', stimulus: 'Nepali folk songs', category: 'music', response: 'positive', engagementScore: 81, confidence: 0.78, source: 'observed' },
  { id: 'pr17', patientId: 'p-pemba-sherpa', stimulus: 'Word-recall activities', category: 'activity', response: 'neutral', engagementScore: 50, confidence: 0.6, source: 'observed' },

  // Bijoya Tripura
  { id: 'pr18', patientId: 'p-bijoya-tripura', stimulus: 'Bamboo craft conversation', category: 'topic', response: 'positive', engagementScore: 86, confidence: 0.8, source: 'observed' },
  { id: 'pr19', patientId: 'p-bijoya-tripura', stimulus: 'Hojagiri dance music', category: 'music', response: 'positive', engagementScore: 79, confidence: 0.75, source: 'observed' },
]

export const getPreferencesForPatient = (patientId: string) =>
  preferences.filter((p) => p.patientId === patientId)
