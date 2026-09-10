import type { Caregiver } from '../types'

export const caregivers: Caregiver[] = [
  { id: 'c-priya', name: 'Priya Sharma', role: 'caregiver', organization: 'MemoryCare NER Home Visit Team', avatarColor: '#2F6F4F' },
  { id: 'c-daniel', name: 'Daniel Lyngdoh', role: 'asha', organization: 'MemoryCare NER Home Visit Team', avatarColor: '#3B6EA8' },
  { id: 'c-doctor', name: 'Dr. Mena Rai', role: 'clinician', organization: 'District Health Centre', avatarColor: '#8B3A62' },
  { id: 'c-family', name: 'Rohan Das', role: 'family', avatarColor: '#B5652E' },
  { id: 'c-admin', name: 'System Admin', role: 'admin', avatarColor: '#4A4A4A' },
]

export const demoCaregiver = caregivers[0]

export const getCaregiver = (id: string) => caregivers.find((c) => c.id === id)
