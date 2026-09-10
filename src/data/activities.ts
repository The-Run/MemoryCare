import type { Activity } from '../types'

// Generic activity catalog. ActivityGenerationService picks/combines these
// with the patient's cultural context and personal preferences.
export const activities: Activity[] = [
  // EARLY — stimulate
  { id: 'a-recall-1', type: 'memory', title: 'Recall three familiar objects', description: 'Show three familiar objects, hide them, ask which one is missing.', stage: 'early', difficulty: 'high', duration: 6, icon: '🧠' },
  { id: 'a-seq-1', type: 'sequencing', title: 'Morning routine ordering', description: 'Arrange the steps of a morning routine in order.', stage: 'early', difficulty: 'medium', duration: 5, icon: '🔢' },
  { id: 'a-lang-1', type: 'language', title: 'Complete the familiar phrase', description: 'Complete a well-known saying or song line.', stage: 'early', difficulty: 'medium', duration: 4, icon: '💬' },
  { id: 'a-voice-1', type: 'conversation', title: 'Talk about your work', description: 'A gentle guided conversation about their occupation.', stage: 'early', difficulty: 'medium', duration: 8, icon: '🗣️' },
  { id: 'a-recog-1', type: 'recognition', title: 'Match person to name', description: 'Match a familiar photo to the correct name.', stage: 'early', difficulty: 'medium', duration: 5, icon: '🧩' },

  // MODERATE — support
  { id: 'a-recog-2', type: 'recognition', title: 'Choose the familiar picture', description: 'Show two pictures, ask the patient to choose the familiar one.', stage: 'moderate', difficulty: 'low', duration: 4, icon: '🖼️' },
  { id: 'a-recog-3', type: 'recognition', title: 'Identify a familiar object', description: 'Show a familiar household object and ask what it is used for.', stage: 'moderate', difficulty: 'low', duration: 4, icon: '🔍' },
  { id: 'a-mem-2', type: 'memory', title: 'Simple picture matching', description: 'Match two identical picture cards from a small set.', stage: 'moderate', difficulty: 'medium', duration: 5, icon: '🃏' },
  { id: 'a-music-1', type: 'music', title: 'Familiar regional music', description: 'Play familiar regional songs and observe engagement.', stage: 'moderate', difficulty: 'low', duration: 6, icon: '🎵' },
  { id: 'a-voice-2', type: 'conversation', title: 'Simple memory conversation', description: 'Short guided conversation about a comfortable topic.', stage: 'moderate', difficulty: 'low', duration: 6, icon: '💬' },
  { id: 'a-attn-1', type: 'attention', title: 'Find the matching object', description: 'Find the object that matches a shown picture.', stage: 'moderate', difficulty: 'medium', duration: 4, icon: '👀' },

  // ADVANCED — comfort
  { id: 'a-comfort-1', type: 'comfort', title: 'Familiar calming music', description: 'Play familiar, calming music at a gentle volume.', stage: 'advanced', difficulty: 'low', duration: 8, icon: '🎼' },
  { id: 'a-comfort-2', type: 'comfort', title: 'Calming regional imagery', description: 'Show slow-moving calming imagery from home region.', stage: 'advanced', difficulty: 'low', duration: 6, icon: '🌄' },
  { id: 'a-voice-3', type: 'voice', title: 'Simple yes/no check-in', description: 'Ask a simple yes/no question in the preferred language.', stage: 'advanced', difficulty: 'low', duration: 3, icon: '🎙️' },
  { id: 'a-recog-4', type: 'recognition', title: 'Simple recognition (non-stressful)', description: 'Show one familiar face and simply name it aloud — no test pressure.', stage: 'advanced', difficulty: 'low', duration: 3, icon: '🙂' },
  { id: 'a-sensory-1', type: 'comfort', title: 'Gentle sensory interaction', description: 'Familiar-textured object for gentle touch interaction.', stage: 'advanced', difficulty: 'low', duration: 5, icon: '🤲' },
]

export const getActivity = (id: string) => activities.find((a) => a.id === id)
export const getActivitiesForStage = (stage: Activity['stage']) =>
  activities.filter((a) => a.stage === stage)
