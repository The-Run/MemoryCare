// Core domain types for MemoryCare NER
// These mirror the target backend data model (see BUILD SPEC section 6)
// but are used directly as the browser-local data shape for the prototype.

export type Stage = 'early' | 'moderate' | 'advanced'

export type EngagementLevel = 'positive' | 'neutral' | 'negative'

export type AssistanceLevel =
  | 'independent'
  | 'hint'
  | 'assisted'
  | 'no_response'

export type AlertSeverity = 'green' | 'yellow' | 'red'

export type AlertStatus = 'new' | 'reviewing' | 'resolved' | 'escalated'

export type MemorySource =
  | 'patient'
  | 'family'
  | 'caregiver'
  | 'record'
  | 'observed'

export type MemoryCategory =
  | 'person'
  | 'place'
  | 'music'
  | 'food'
  | 'occupation'
  | 'event'
  | 'routine'
  | 'hobby'

export type RoutineStatus = 'upcoming' | 'completed' | 'missed'

export type RoutineType =
  | 'medication'
  | 'meal'
  | 'sleep'
  | 'exercise'
  | 'appointment'
  | 'activity'

export type ActivityType =
  | 'recognition'
  | 'memory'
  | 'attention'
  | 'language'
  | 'sequencing'
  | 'music'
  | 'comfort'
  | 'conversation'
  | 'voice'

export type NerState =
  | 'Assam'
  | 'Arunachal Pradesh'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Tripura'
  | 'Sikkim'

export type CaregiverRole =
  | 'caregiver'
  | 'asha'
  | 'clinician'
  | 'family'
  | 'admin'

export interface Caregiver {
  id: string
  name: string
  role: CaregiverRole
  organization?: string
  avatarColor: string
}

export interface Patient {
  id: string
  name: string
  preferredName: string
  age: number
  gender: 'female' | 'male' | 'other'
  stage: Stage
  language: string
  state: NerState
  hometown: string
  avatarInitials: string
  avatarColor: string
  occupation: string
  familyAvailable: boolean
  communicationMode: 'voice' | 'touch' | 'mixed'
  careHome: boolean
  assignedCaregiverId: string
  lastSessionAt: string | null
  attentionStatus: AlertSeverity
  createdAt: string
  updatedAt: string
  // Identity / passport extras
  importantPeople: { name: string; relation: string }[]
  importantPlaces: string[]
  majorLifeEvents: string[]
  yesNoPreference: boolean
  knownCommunicationDifficulties: string[]
  wakeTime: string
  sleepTime: string
  meals: string[]
  medicationSchedule: { name: string; time: string }[]
}

export interface Memory {
  id: string
  patientId: string
  category: MemoryCategory
  title: string
  description: string
  source: MemorySource
  confidence: number // 0-1
  icon: string // emoji placeholder for image
  createdAt: string
}

export interface Preference {
  id: string
  patientId: string
  stimulus: string
  category: 'music' | 'food' | 'activity' | 'topic' | 'visual' | 'audio'
  response: EngagementLevel
  engagementScore: number // 0-100
  confidence: number
  source: MemorySource
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  stage: Stage
  difficulty: 'low' | 'medium' | 'high'
  culturalContext?: NerState
  duration: number // minutes
  icon: string
}

export interface Session {
  id: string
  patientId: string
  date: string
  duration: number
  stage: Stage
  activityIds: string[]
  overallEngagement: EngagementLevel
}

export interface Observation {
  id: string
  sessionId: string
  patientId: string
  activityId: string
  response: EngagementLevel
  responseTime: number // seconds
  assistanceRequired: AssistanceLevel
  engagement: EngagementLevel
  caregiverNote?: string
  createdAt: string
}

export interface BaselineMetric {
  patientId: string
  metric: 'responseTime' | 'assistanceRate' | 'recognitionAccuracy' | 'engagementScore'
  label: string
  unit: string
  baselineValue: number
  currentValue: number
  changePercent: number
  trend: 'improving' | 'stable' | 'declining'
  confidence: number
  history: { session: number; value: number; date: string }[]
}

export interface Alert {
  id: string
  patientId: string
  severity: AlertSeverity
  title: string
  whatChanged: string
  whyItMatters: string
  recommendedAction: string
  status: AlertStatus
  createdAt: string
  caregiverNote?: string
}

export interface Routine {
  id: string
  patientId: string
  type: RoutineType
  title: string
  time: string
  status: RoutineStatus
  showDosageToPatient: boolean
  dosage?: string
}

export interface CulturalContentItem {
  title: string
  description: string
  icon: string
}

export interface CulturalStateData {
  state: NerState
  languages: string[]
  music: CulturalContentItem[]
  food: CulturalContentItem[]
  festivals: CulturalContentItem[]
  places: CulturalContentItem[]
  stories: CulturalContentItem[]
  visualObjects: CulturalContentItem[]
}

export interface PatientPicture {
  id: string
  patientId: string
  label: string
  personOrPlace: string
  description: string
  icon: string
  color: string
  source: MemorySource
}

export interface MusicTrack {
  id: string
  patientId: string
  title: string
  region: NerState
  language: string
  engagementScore: number
  approvedBy: MemorySource
  icon: string
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}

export interface ConsentRecord {
  type: 'voice' | 'photos' | 'memories' | 'careData'
  granted: boolean
  grantedBy: string
  date: string
}

export interface CopilotRecommendationCard {
  id: string
  patientId: string
  headline: string
  observation: string
  recommendation: string
  priority: 'high' | 'medium' | 'low'
}

export interface ExtractedProfileField {
  id: string
  field: string
  value: string
  category: MemoryCategory | 'routine'
  status: 'pending' | 'accepted' | 'rejected'
}
