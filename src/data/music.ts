import type { MusicTrack } from '../types'

export const musicTracks: MusicTrack[] = [
  { id: 'mt1', patientId: 'p-anima-das', title: 'Rongali Bihu Geet', region: 'Assam', language: 'Assamese', engagementScore: 92, approvedBy: 'caregiver', icon: '🎶' },
  { id: 'mt2', patientId: 'p-anima-das', title: 'Borgeet — Morning Raga', region: 'Assam', language: 'Assamese', engagementScore: 85, approvedBy: 'caregiver', icon: '🎼' },
  { id: 'mt3', patientId: 'p-anima-das', title: 'Calming Nature Sounds', region: 'Assam', language: 'Assamese', engagementScore: 70, approvedBy: 'family', icon: '🌿' },

  { id: 'mt4', patientId: 'p-ranjit-singh', title: 'Naga Folk Melody', region: 'Nagaland', language: 'Ao', engagementScore: 82, approvedBy: 'family', icon: '🎶' },
  { id: 'mt5', patientId: 'p-ranjit-singh', title: 'Hornbill Festival Drums', region: 'Nagaland', language: 'Ao', engagementScore: 76, approvedBy: 'family', icon: '🥁' },

  { id: 'mt6', patientId: 'p-banri-kharshiing', title: 'Khasi Folk Chant', region: 'Meghalaya', language: 'Khasi', engagementScore: 84, approvedBy: 'caregiver', icon: '🎶' },

  { id: 'mt7', patientId: 'p-ibomcha', title: 'Pena Recital — Calming', region: 'Manipur', language: 'Meitei', engagementScore: 70, approvedBy: 'caregiver', icon: '🎻' },

  { id: 'mt8', patientId: 'p-pemba-sherpa', title: 'Nepali Folk Song', region: 'Sikkim', language: 'Nepali', engagementScore: 81, approvedBy: 'family', icon: '🎶' },

  { id: 'mt9', patientId: 'p-bijoya-tripura', title: 'Hojagiri Dance Song', region: 'Tripura', language: 'Kokborok', engagementScore: 79, approvedBy: 'family', icon: '🎶' },
]

export const getMusicForPatient = (patientId: string) =>
  musicTracks.filter((m) => m.patientId === patientId)
