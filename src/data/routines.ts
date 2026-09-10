import type { Routine } from '../types'

export const routines: Routine[] = [
  // Anima Das
  { id: 'r1', patientId: 'p-anima-das', type: 'medication', title: 'Morning medicine', time: '8:00 AM', status: 'completed', showDosageToPatient: false, dosage: '1 tablet — Blood pressure' },
  { id: 'r2', patientId: 'p-anima-das', type: 'meal', title: 'Breakfast', time: '7:30 AM', status: 'completed', showDosageToPatient: true },
  { id: 'r3', patientId: 'p-anima-das', type: 'activity', title: 'Music time', time: '11:00 AM', status: 'upcoming', showDosageToPatient: true },
  { id: 'r4', patientId: 'p-anima-das', type: 'exercise', title: 'Evening walk', time: '5:00 PM', status: 'upcoming', showDosageToPatient: true },
  { id: 'r5', patientId: 'p-anima-das', type: 'medication', title: 'Evening supplement', time: '8:00 PM', status: 'upcoming', showDosageToPatient: false, dosage: '1 capsule — Multivitamin' },

  // Ranjit Singh
  { id: 'r6', patientId: 'p-ranjit-singh', type: 'medication', title: 'Morning medicine', time: '9:00 AM', status: 'completed', showDosageToPatient: false, dosage: '1 tablet — Joint pain' },
  { id: 'r7', patientId: 'p-ranjit-singh', type: 'activity', title: 'Carrom time', time: '4:00 PM', status: 'upcoming', showDosageToPatient: true },
  { id: 'r8', patientId: 'p-ranjit-singh', type: 'meal', title: 'Lunch', time: '12:30 PM', status: 'upcoming', showDosageToPatient: true },

  // Banri Kharshiing
  { id: 'r9', patientId: 'p-banri-kharshiing', type: 'medication', title: 'Morning supplement', time: '8:00 AM', status: 'completed', showDosageToPatient: false, dosage: '1 tablet — Vitamin' },
  { id: 'r10', patientId: 'p-banri-kharshiing', type: 'activity', title: 'Weaving time', time: '3:00 PM', status: 'upcoming', showDosageToPatient: true },

  // Ngangbam Ibomcha
  { id: 'r11', patientId: 'p-ibomcha', type: 'medication', title: 'Morning medication', time: '8:00 AM', status: 'missed', showDosageToPatient: false, dosage: '2 tablets' },
  { id: 'r12', patientId: 'p-ibomcha', type: 'meal', title: 'Breakfast', time: '7:30 AM', status: 'completed', showDosageToPatient: true },
  { id: 'r13', patientId: 'p-ibomcha', type: 'activity', title: 'Music & comfort time', time: '2:00 PM', status: 'upcoming', showDosageToPatient: true },

  // Pemba Sherpa
  { id: 'r14', patientId: 'p-pemba-sherpa', type: 'medication', title: 'Morning medicine', time: '7:30 AM', status: 'completed', showDosageToPatient: false, dosage: '1 tablet — Diabetes' },
  { id: 'r15', patientId: 'p-pemba-sherpa', type: 'activity', title: 'Conversation time', time: '5:30 PM', status: 'upcoming', showDosageToPatient: true },

  // Bijoya Tripura
  { id: 'r16', patientId: 'p-bijoya-tripura', type: 'medication', title: 'Morning tablet', time: '6:00 AM', status: 'completed', showDosageToPatient: false, dosage: '1 tablet — Thyroid' },
  { id: 'r17', patientId: 'p-bijoya-tripura', type: 'activity', title: 'Craft time', time: '4:00 PM', status: 'upcoming', showDosageToPatient: true },
]

export const getRoutinesForPatient = (patientId: string) =>
  routines.filter((r) => r.patientId === patientId)
