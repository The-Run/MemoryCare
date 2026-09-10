import type { CulturalStateData } from '../types'

// Mock NER cultural knowledge base. Presented as CANDIDATE stimuli only —
// never treated as an automatic personal preference (see BUILD SPEC §10).
export const culturalData: CulturalStateData[] = [
  {
    state: 'Assam',
    languages: ['Assamese', 'Bodo', 'Bengali'],
    music: [
      { title: 'Bihu folk songs', description: 'Festive songs sung during Rongali Bihu', icon: '🎶' },
      { title: 'Borgeet', description: 'Devotional classical compositions by Srimanta Sankardev', icon: '🎼' },
    ],
    food: [
      { title: 'Khar', description: 'Traditional alkali-based Assamese dish', icon: '🍲' },
      { title: 'Pitha', description: 'Rice cakes made during festivals', icon: '🍘' },
    ],
    festivals: [{ title: 'Bihu', description: 'Assam\'s major seasonal festival', icon: '🎉' }],
    places: [
      { title: 'Kaziranga', description: 'National park famous for one-horned rhinos', icon: '🦏' },
      { title: 'Brahmaputra River', description: 'The great river of the valley', icon: '🌊' },
    ],
    stories: [{ title: 'Tales of Sankardev', description: 'Stories of the saint-reformer', icon: '📖' }],
    visualObjects: [{ title: 'Gamosa', description: 'Traditional woven towel/scarf', icon: '🧣' }],
  },
  {
    state: 'Arunachal Pradesh',
    languages: ['Nyishi', 'Adi', 'Hindi'],
    music: [{ title: 'Ponung folk songs', description: 'Traditional Adi community songs', icon: '🎶' }],
    food: [{ title: 'Thukpa', description: 'Warm noodle soup', icon: '🍜' }],
    festivals: [{ title: 'Losar', description: 'Tibetan-Buddhist New Year celebration', icon: '🎉' }],
    places: [{ title: 'Tawang Monastery', description: 'Historic Buddhist monastery', icon: '🏯' }],
    stories: [{ title: 'Abotani legends', description: 'Origin stories of the Tani tribes', icon: '📖' }],
    visualObjects: [{ title: 'Bamboo handicrafts', description: 'Woven bamboo household items', icon: '🧺' }],
  },
  {
    state: 'Manipur',
    languages: ['Meitei', 'Thadou'],
    music: [{ title: 'Pena recitals', description: 'Traditional string-instrument ballads', icon: '🎻' }],
    food: [{ title: 'Eromba', description: 'Mashed vegetable and fish dish', icon: '🍲' }],
    festivals: [{ title: 'Yaoshang', description: 'Manipuri spring festival', icon: '🎉' }],
    places: [{ title: 'Loktak Lake', description: 'Famous floating-island lake', icon: '🌊' }],
    stories: [{ title: 'Khamba-Thoibi legend', description: 'Classic Manipuri folk romance', icon: '📖' }],
    visualObjects: [{ title: 'Innaphi shawl', description: 'Traditional handwoven wrap', icon: '🧣' }],
  },
  {
    state: 'Meghalaya',
    languages: ['Khasi', 'Garo', 'Jaintia'],
    music: [{ title: 'Khasi folk chants', description: 'Traditional community songs', icon: '🎶' }],
    food: [{ title: 'Jadoh', description: 'Khasi rice and meat dish', icon: '🍚' }],
    festivals: [{ title: 'Wangala', description: 'Garo harvest festival', icon: '🎉' }],
    places: [{ title: 'Living Root Bridges', description: 'Famous natural bridges of Cherrapunji', icon: '🌉' }],
    stories: [{ title: 'Tales of U Thlen', description: 'Well-known Khasi folk legend', icon: '📖' }],
    visualObjects: [{ title: 'Khasi cane hat (Knup)', description: 'Traditional rain shield', icon: '🧢' }],
  },
  {
    state: 'Mizoram',
    languages: ['Mizo'],
    music: [{ title: 'Mizo folk hymns', description: 'Traditional community singing', icon: '🎶' }],
    food: [{ title: 'Bai', description: 'Mizo vegetable stew', icon: '🍲' }],
    festivals: [{ title: 'Chapchar Kut', description: 'Spring festival celebrating harvest', icon: '🎉' }],
    places: [{ title: 'Reiek Hill', description: 'Popular scenic hill near Aizawl', icon: '⛰️' }],
    stories: [{ title: 'Legend of Chhurbura', description: 'Well-loved Mizo folk tale', icon: '📖' }],
    visualObjects: [{ title: 'Puan textile', description: 'Traditional handwoven cloth', icon: '🧵' }],
  },
  {
    state: 'Nagaland',
    languages: ['Ao', 'Angami', 'Nagamese'],
    music: [{ title: 'Naga folk songs', description: 'Traditional tribal community songs', icon: '🎶' }],
    food: [{ title: 'Smoked pork with bamboo shoot', description: 'Traditional Naga delicacy', icon: '🍖' }],
    festivals: [{ title: 'Hornbill Festival', description: 'Annual celebration of Naga heritage', icon: '🎉' }],
    places: [{ title: 'Dzükou Valley', description: 'Valley of flowers on the Manipur border', icon: '🏞️' }],
    stories: [{ title: 'Naga folk legends', description: 'Oral tribal storytelling traditions', icon: '📖' }],
    visualObjects: [{ title: 'Naga shawl', description: 'Tribe-specific woven shawl', icon: '🧣' }],
  },
  {
    state: 'Tripura',
    languages: ['Bengali', 'Kokborok'],
    music: [{ title: 'Hojagiri dance songs', description: 'Traditional Tripuri performance music', icon: '🎶' }],
    food: [{ title: 'Mui Borok', description: 'Traditional fermented dish', icon: '🍲' }],
    festivals: [{ title: 'Garia Puja', description: 'Major Tripuri agricultural festival', icon: '🎉' }],
    places: [{ title: 'Ujjayanta Palace', description: 'Historic royal palace in Agartala', icon: '🏰' }],
    stories: [{ title: 'Tripuri royal folklore', description: 'Stories of the Manikya dynasty', icon: '📖' }],
    visualObjects: [{ title: 'Risa cloth', description: 'Traditional Tripuri handwoven wrap', icon: '🧵' }],
  },
  {
    state: 'Sikkim',
    languages: ['Nepali', 'Bhutia', 'Lepcha'],
    music: [{ title: 'Nepali folk songs', description: 'Traditional hill community songs', icon: '🎶' }],
    food: [{ title: 'Gundruk', description: 'Fermented leafy vegetable dish', icon: '🥬' }],
    festivals: [{ title: 'Losoong', description: 'Sikkimese harvest New Year festival', icon: '🎉' }],
    places: [{ title: 'MG Marg, Gangtok', description: 'Popular town promenade', icon: '🏞️' }],
    stories: [{ title: 'Legends of Kanchenjunga', description: 'Mountain-guardian folk stories', icon: '📖' }],
    visualObjects: [{ title: 'Khada scarf', description: 'Traditional ceremonial silk scarf', icon: '🧣' }],
  },
]

export const getCulturalData = (state: string) => culturalData.find((c) => c.state === state)
