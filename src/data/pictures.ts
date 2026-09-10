import type { PatientPicture } from '../types'

// Caregiver/family-labeled photos shown in Patient Mode → My Pictures.
// Rendered as icon-based placeholder cards (no external image assets),
// which also keeps the "offline-first" story honest.
export const pictures: PatientPicture[] = [
  { id: 'pic1', patientId: 'p-anima-das', label: 'My Son — Rohan', personOrPlace: 'Rohan', description: 'Taken during his last visit home.', icon: '👦', color: '#DDEFE3', source: 'family' },
  { id: 'pic2', patientId: 'p-anima-das', label: 'My School', personOrPlace: 'Jorhat Girls School', description: 'Where I taught mathematics for many years.', icon: '🏫', color: '#FDECC8', source: 'caregiver' },
  { id: 'pic3', patientId: 'p-anima-das', label: 'The River', personOrPlace: 'Brahmaputra', description: 'My favourite evening walk.', icon: '🌊', color: '#DCEAF7', source: 'caregiver' },
  { id: 'pic4', patientId: 'p-anima-das', label: 'Mrs. Bora — Friend', personOrPlace: 'Mrs. Bora', description: 'My close friend from school.', icon: '👩', color: '#F3E1F0', source: 'family' },

  { id: 'pic5', patientId: 'p-ranjit-singh', label: 'My Daughter — Aveto', personOrPlace: 'Aveto', description: 'Visits every weekend.', icon: '👧', color: '#DDEFE3', source: 'family' },
  { id: 'pic6', patientId: 'p-ranjit-singh', label: 'My Grandson — Kevi', personOrPlace: 'Kevi', description: 'Loves playing carrom with me.', icon: '🧒', color: '#FDECC8', source: 'family' },
  { id: 'pic7', patientId: 'p-ranjit-singh', label: 'Hornbill Festival', personOrPlace: 'Hornbill Festival', description: 'We go every year together.', icon: '🎉', color: '#DCEAF7', source: 'family' },

  { id: 'pic8', patientId: 'p-banri-kharshiing', label: 'My Niece — Iaroh', personOrPlace: 'Iaroh', description: 'Takes care of me every day.', icon: '👩', color: '#DDEFE3', source: 'family' },
  { id: 'pic9', patientId: 'p-banri-kharshiing', label: "Ward's Lake", personOrPlace: "Ward's Lake", description: 'My favourite place to walk.', icon: '🏞️', color: '#DCEAF7', source: 'caregiver' },
  { id: 'pic10', patientId: 'p-banri-kharshiing', label: 'My Loom', personOrPlace: 'Weaving loom', description: 'I wove for over 40 years.', icon: '🧵', color: '#FDECC8', source: 'caregiver' },

  { id: 'pic11', patientId: 'p-ibomcha', label: 'Loktak Lake', personOrPlace: 'Loktak Lake', description: 'My home by the lake.', icon: '🌊', color: '#DCEAF7', source: 'record' },
  { id: 'pic12', patientId: 'p-ibomcha', label: 'The Farm', personOrPlace: 'Family farmland', description: 'Where I farmed rice.', icon: '🌾', color: '#DDEFE3', source: 'record' },

  { id: 'pic13', patientId: 'p-pemba-sherpa', label: 'My Wife — Doma', personOrPlace: 'Doma', description: 'Married for 45 years.', icon: '👵', color: '#F3E1F0', source: 'family' },
  { id: 'pic14', patientId: 'p-pemba-sherpa', label: 'My Shop', personOrPlace: 'Family general store', description: 'I ran this shop for 40 years.', icon: '🏪', color: '#FDECC8', source: 'family' },

  { id: 'pic15', patientId: 'p-bijoya-tripura', label: 'My Daughter-in-law — Tapati', personOrPlace: 'Tapati', description: 'Takes care of me every day.', icon: '👩', color: '#DDEFE3', source: 'family' },
  { id: 'pic16', patientId: 'p-bijoya-tripura', label: 'My Bamboo Craft', personOrPlace: 'Bamboo craft', description: 'I made these for many years.', icon: '🎋', color: '#FDECC8', source: 'family' },
]

export const getPicturesForPatient = (patientId: string) =>
  pictures.filter((p) => p.patientId === patientId)
