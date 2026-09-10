// Local Data Layer — the browser stand-in for IndexedDB/SQLite described
// in the master architecture. Everything lives in localStorage under one
// namespaced key so the whole app is a working offline-first PWA-style
// prototype without any backend.
import type {
  Patient,
  Memory,
  Preference,
  Activity,
  Session,
  Observation,
  BaselineMetric,
  Alert,
  Routine,
  PatientPicture,
  MusicTrack,
  AuditLogEntry,
  ConsentRecord,
  Caregiver,
} from '../types'
import {
  patients as seedPatients,
  caregivers as seedCaregivers,
  memories as seedMemories,
  preferences as seedPreferences,
  activities as seedActivities,
  pictures as seedPictures,
  musicTracks as seedMusicTracks,
  routines as seedRoutines,
  sessions as seedSessions,
  observations as seedObservations,
  baselines as seedBaselines,
  alerts as seedAlerts,
} from '../data'
import { nowIso } from './id'

const STORAGE_KEY = 'memorycare_ner_v1'
const SCHEMA_VERSION = 1

export interface SyncState {
  isOnline: boolean
  syncing: boolean
  lastSyncedAt: string | null
  pendingChangeIds: string[]
}

export interface AppData {
  schemaVersion: number
  patients: Patient[]
  caregivers: Caregiver[]
  memories: Memory[]
  preferences: Preference[]
  activities: Activity[]
  pictures: PatientPicture[]
  musicTracks: MusicTrack[]
  routines: Routine[]
  sessions: Session[]
  observations: Observation[]
  baselines: BaselineMetric[]
  alerts: Alert[]
  auditLog: AuditLogEntry[]
  consents: ConsentRecord[]
  sync: SyncState
  currentCaregiverId: string
  patientModeActive: boolean
  activePatientId: string | null
}

function seedState(): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    patients: seedPatients,
    caregivers: seedCaregivers,
    memories: seedMemories,
    preferences: seedPreferences,
    activities: seedActivities,
    pictures: seedPictures,
    musicTracks: seedMusicTracks,
    routines: seedRoutines,
    sessions: seedSessions,
    observations: seedObservations,
    baselines: seedBaselines,
    alerts: seedAlerts,
    auditLog: [
      { id: 'audit-1', actor: 'Priya Sharma', action: 'Viewed Care & Memory Passport', target: 'Anima Das', timestamp: '2026-09-09T09:05:00+05:30' },
      { id: 'audit-2', actor: 'Priya Sharma', action: 'Recorded observation', target: 'Anima Das — Recognition activity', timestamp: '2026-09-09T09:10:00+05:30' },
      { id: 'audit-3', actor: 'Daniel Lyngdoh', action: 'Acknowledged alert', target: 'Ngangbam Ibomcha — Missed medication', timestamp: '2026-09-09T08:15:00+05:30' },
    ],
    consents: [
      { type: 'voice', granted: true, grantedBy: 'Rohan Das (Family)', date: '2026-01-12' },
      { type: 'photos', granted: true, grantedBy: 'Rohan Das (Family)', date: '2026-01-12' },
      { type: 'memories', granted: true, grantedBy: 'Rohan Das (Family)', date: '2026-01-12' },
      { type: 'careData', granted: true, grantedBy: 'Rohan Das (Family)', date: '2026-01-12' },
    ],
    sync: { isOnline: true, syncing: false, lastSyncedAt: nowIso(), pendingChangeIds: [] },
    currentCaregiverId: 'c-priya',
    patientModeActive: false,
    activePatientId: 'p-anima-das',
  }
}

export function loadState(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.schemaVersion || parsed.schemaVersion !== SCHEMA_VERSION) return seedState()
    return parsed
  } catch {
    return seedState()
  }
}

export function saveState(state: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode, quota) — fail silently, app still
    // works in-memory for the current session
  }
}

export function resetState(): AppData {
  const fresh = seedState()
  saveState(fresh)
  return fresh
}
