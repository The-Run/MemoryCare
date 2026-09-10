import type { Memory } from '../types'

export const memories: Memory[] = [
  // Anima Das
  { id: 'm1', patientId: 'p-anima-das', category: 'occupation', title: 'Mathematics Teacher', description: 'Taught mathematics at Jorhat Girls School for 32 years.', source: 'family', confidence: 0.95, icon: '📐', createdAt: '2026-01-12' },
  { id: 'm2', patientId: 'p-anima-das', category: 'person', title: 'Rohan — Son', description: 'Lives abroad, calls every Sunday evening.', source: 'family', confidence: 0.98, icon: '👦', createdAt: '2026-01-12' },
  { id: 'm3', patientId: 'p-anima-das', category: 'music', title: 'Bihu songs', description: 'Loved singing Bihu songs during festival season.', source: 'observed', confidence: 0.9, icon: '🎶', createdAt: '2026-02-01' },
  { id: 'm4', patientId: 'p-anima-das', category: 'place', title: 'Brahmaputra ghat', description: 'Used to walk by the river every evening.', source: 'caregiver', confidence: 0.8, icon: '🌊', createdAt: '2026-02-10' },
  { id: 'm5', patientId: 'p-anima-das', category: 'routine', title: 'Morning tea', description: 'Always drinks tea right after waking up.', source: 'caregiver', confidence: 0.92, icon: '🍵', createdAt: '2026-01-20' },
  { id: 'm6', patientId: 'p-anima-das', category: 'hobby', title: 'Knitting', description: 'Enjoys knitting in the afternoon sun.', source: 'observed', confidence: 0.75, icon: '🧶', createdAt: '2026-03-01' },

  // Ranjit Singh
  { id: 'm7', patientId: 'p-ranjit-singh', category: 'occupation', title: 'Government Clerk', description: 'Worked at the district office for 28 years.', source: 'family', confidence: 0.95, icon: '🗂️', createdAt: '2026-02-02' },
  { id: 'm8', patientId: 'p-ranjit-singh', category: 'person', title: 'Aveto — Daughter', description: 'Primary family contact, visits weekly.', source: 'family', confidence: 0.97, icon: '👧', createdAt: '2026-02-02' },
  { id: 'm9', patientId: 'p-ranjit-singh', category: 'event', title: 'Hornbill Festival', description: 'Attends every year with family.', source: 'family', confidence: 0.85, icon: '🎉', createdAt: '2026-02-05' },
  { id: 'm10', patientId: 'p-ranjit-singh', category: 'hobby', title: 'Carrom', description: 'Enjoys playing carrom in the evenings.', source: 'observed', confidence: 0.8, icon: '🎯', createdAt: '2026-03-10' },

  // Banri Kharshiing
  { id: 'm11', patientId: 'p-banri-kharshiing', category: 'occupation', title: 'Traditional Weaver', description: 'Won a state handicrafts award in 1998.', source: 'family', confidence: 0.94, icon: '🧵', createdAt: '2026-03-15' },
  { id: 'm12', patientId: 'p-banri-kharshiing', category: 'place', title: "Ward's Lake", description: 'Enjoyed walking there with friends.', source: 'caregiver', confidence: 0.78, icon: '🏞️', createdAt: '2026-03-20' },
  { id: 'm13', patientId: 'p-banri-kharshiing', category: 'person', title: 'Iaroh — Niece', description: 'Primary caregiver and closest family member.', source: 'family', confidence: 0.96, icon: '👩', createdAt: '2026-03-15' },

  // Ngangbam Ibomcha
  { id: 'm14', patientId: 'p-ibomcha', category: 'occupation', title: 'Rice Farmer', description: 'Farmed rice for over 50 years near Loktak Lake.', source: 'record', confidence: 0.9, icon: '🌾', createdAt: '2025-11-20' },
  { id: 'm15', patientId: 'p-ibomcha', category: 'place', title: 'Loktak Lake', description: 'Lived near the lake his whole life.', source: 'record', confidence: 0.85, icon: '🌊', createdAt: '2025-11-20' },
  { id: 'm16', patientId: 'p-ibomcha', category: 'music', title: 'Pena recitals', description: 'Calms with traditional Pena string music.', source: 'observed', confidence: 0.7, icon: '🎻', createdAt: '2026-01-05' },

  // Pemba Sherpa
  { id: 'm17', patientId: 'p-pemba-sherpa', category: 'occupation', title: 'Shopkeeper', description: 'Ran the family general store for 40 years.', source: 'family', confidence: 0.93, icon: '🏪', createdAt: '2026-04-01' },
  { id: 'm18', patientId: 'p-pemba-sherpa', category: 'person', title: 'Doma — Wife', description: 'Married for over 45 years.', source: 'family', confidence: 0.97, icon: '👵', createdAt: '2026-04-01' },
  { id: 'm19', patientId: 'p-pemba-sherpa', category: 'place', title: 'MG Marg', description: 'Enjoyed evening walks on the promenade.', source: 'observed', confidence: 0.7, icon: '🏞️', createdAt: '2026-04-15' },

  // Bijoya Tripura
  { id: 'm20', patientId: 'p-bijoya-tripura', category: 'hobby', title: 'Bamboo Craft', description: 'Known locally for bamboo craftwork.', source: 'family', confidence: 0.92, icon: '🎋', createdAt: '2026-05-18' },
  { id: 'm21', patientId: 'p-bijoya-tripura', category: 'person', title: 'Tapati — Daughter-in-law', description: 'Lives with the family and provides daily care.', source: 'family', confidence: 0.95, icon: '👩', createdAt: '2026-05-18' },
]

export const getMemoriesForPatient = (patientId: string) =>
  memories.filter((m) => m.patientId === patientId)
