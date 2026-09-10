import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppData } from '../services/storage'
import { loadState, saveState, resetState } from '../services/storage'
import { newId, nowIso } from '../services/id'
import type {
  Alert,
  AlertStatus,
  Memory,
  Observation,
  Patient,
  Routine,
  RoutineStatus,
  Session,
} from '../types'

interface DataContextValue {
  data: AppData
  currentCaregiver: AppData['caregivers'][number]
  // patients
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patch: Partial<Patient>) => void
  // memories
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void
  // sessions / observations
  addSession: (session: Omit<Session, 'id'>) => Session
  addObservation: (observation: Omit<Observation, 'id' | 'createdAt'>) => void
  // alerts
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void
  updateAlertStatus: (id: string, status: AlertStatus, note?: string) => void
  // routines
  updateRoutineStatus: (id: string, status: RoutineStatus) => void
  addRoutine: (routine: Omit<Routine, 'id'>) => void
  // audit
  logAudit: (action: string, target: string) => void
  // connectivity simulation
  isOnline: boolean
  syncing: boolean
  pendingCount: number
  lastSyncedAt: string | null
  goOffline: () => void
  goOnline: () => void
  // patient mode
  patientModeActive: boolean
  activePatientId: string | null
  enterPatientMode: (patientId?: string) => void
  exitPatientMode: () => void
  setActivePatientId: (id: string) => void
  // demo
  resetDemoData: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadState())

  useEffect(() => {
    saveState(data)
  }, [data])

  // Queue a mutation: if offline, mark it pending and "sync" later.
  const mutate = useCallback((updater: (prev: AppData) => AppData, changeId: string) => {
    setData((prev) => {
      const next = updater(prev)
      if (!prev.sync.isOnline) {
        return { ...next, sync: { ...next.sync, pendingChangeIds: [...next.sync.pendingChangeIds, changeId] } }
      }
      return next
    })
  }, [])

  const addPatient = useCallback(
    (patient: Patient) => mutate((prev) => ({ ...prev, patients: [...prev.patients, patient] }), patient.id),
    [mutate],
  )

  const updatePatient = useCallback(
    (id: string, patch: Partial<Patient>) =>
      mutate(
        (prev) => ({
          ...prev,
          patients: prev.patients.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p)),
        }),
        id,
      ),
    [mutate],
  )

  const addMemory = useCallback(
    (memory: Omit<Memory, 'id' | 'createdAt'>) => {
      const id = newId('mem')
      mutate((prev) => ({ ...prev, memories: [...prev.memories, { ...memory, id, createdAt: nowIso() }] }), id)
    },
    [mutate],
  )

  const addSession = useCallback(
    (session: Omit<Session, 'id'>) => {
      const id = newId('sess')
      const full: Session = { ...session, id }
      mutate((prev) => ({ ...prev, sessions: [...prev.sessions, full] }), id)
      return full
    },
    [mutate],
  )

  const addObservation = useCallback(
    (observation: Omit<Observation, 'id' | 'createdAt'>) => {
      const id = newId('obs')
      mutate(
        (prev) => ({ ...prev, observations: [...prev.observations, { ...observation, id, createdAt: nowIso() }] }),
        id,
      )
    },
    [mutate],
  )

  const addAlert = useCallback(
    (alert: Omit<Alert, 'id' | 'createdAt'>) => {
      const id = newId('al')
      mutate((prev) => ({ ...prev, alerts: [{ ...alert, id, createdAt: nowIso() }, ...prev.alerts] }), id)
    },
    [mutate],
  )

  const updateAlertStatus = useCallback(
    (id: string, status: AlertStatus, note?: string) =>
      mutate(
        (prev) => ({
          ...prev,
          alerts: prev.alerts.map((a) => (a.id === id ? { ...a, status, caregiverNote: note ?? a.caregiverNote } : a)),
        }),
        id,
      ),
    [mutate],
  )

  const updateRoutineStatus = useCallback(
    (id: string, status: RoutineStatus) =>
      mutate((prev) => ({ ...prev, routines: prev.routines.map((r) => (r.id === id ? { ...r, status } : r)) }), id),
    [mutate],
  )

  const addRoutine = useCallback(
    (routine: Omit<Routine, 'id'>) => {
      const id = newId('rt')
      mutate((prev) => ({ ...prev, routines: [...prev.routines, { ...routine, id }] }), id)
    },
    [mutate],
  )

  const logAudit = useCallback(
    (action: string, target: string) => {
      const id = newId('audit')
      setData((prev) => ({
        ...prev,
        auditLog: [{ id, actor: prev.caregivers.find((c) => c.id === prev.currentCaregiverId)?.name ?? 'Caregiver', action, target, timestamp: nowIso() }, ...prev.auditLog].slice(0, 100),
      }))
    },
    [],
  )

  const goOffline = useCallback(() => {
    setData((prev) => ({ ...prev, sync: { ...prev.sync, isOnline: false } }))
  }, [])

  const goOnline = useCallback(() => {
    // Simulate: check network -> encrypt -> diff sync -> secure server -> updated bundle
    setData((prev) => ({ ...prev, sync: { ...prev.sync, isOnline: true, syncing: true } }))
    setTimeout(() => {
      setData((prev) => ({ ...prev, sync: { isOnline: true, syncing: false, lastSyncedAt: nowIso(), pendingChangeIds: [] } }))
    }, 1600)
  }, [])

  const enterPatientMode = useCallback((patientId?: string) => {
    setData((prev) => ({
      ...prev,
      patientModeActive: true,
      activePatientId: patientId ?? prev.activePatientId ?? prev.patients[0]?.id ?? null,
    }))
  }, [])
  const exitPatientMode = useCallback(() => setData((prev) => ({ ...prev, patientModeActive: false })), [])
  const setActivePatientId = useCallback((id: string) => setData((prev) => ({ ...prev, activePatientId: id })), [])

  const resetDemoData = useCallback(() => setData(resetState()), [])

  const currentCaregiver = useMemo(
    () => data.caregivers.find((c) => c.id === data.currentCaregiverId) ?? data.caregivers[0],
    [data.caregivers, data.currentCaregiverId],
  )

  const value: DataContextValue = {
    data,
    currentCaregiver,
    addPatient,
    updatePatient,
    addMemory,
    addSession,
    addObservation,
    addAlert,
    updateAlertStatus,
    updateRoutineStatus,
    addRoutine,
    logAudit,
    isOnline: data.sync.isOnline,
    syncing: data.sync.syncing,
    pendingCount: data.sync.pendingChangeIds.length,
    lastSyncedAt: data.sync.lastSyncedAt,
    goOffline,
    goOnline,
    patientModeActive: data.patientModeActive,
    activePatientId: data.activePatientId,
    enterPatientMode,
    exitPatientMode,
    setActivePatientId,
    resetDemoData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

/**
 * Live per-patient selectors.
 *
 * Always read patient data through this hook rather than the `src/data/*`
 * modules — those are seed data only. Reading them directly would miss
 * everything written at runtime: memories added by the voice profile
 * builder or family portal, observations recorded in a session, routine
 * completions, generated alerts, and care-stage changes.
 */
export function usePatientData(patientId?: string | null) {
  const { data } = useData()
  return useMemo(() => {
    const id = patientId ?? ''
    return {
      patient: data.patients.find((p) => p.id === id),
      memories: data.memories.filter((m) => m.patientId === id),
      preferences: data.preferences.filter((p) => p.patientId === id),
      pictures: data.pictures.filter((p) => p.patientId === id),
      music: data.musicTracks.filter((m) => m.patientId === id),
      routines: data.routines.filter((r) => r.patientId === id),
      sessions: data.sessions.filter((s) => s.patientId === id).sort((a, b) => (a.date < b.date ? 1 : -1)),
      observations: data.observations.filter((o) => o.patientId === id),
      baselines: data.baselines.filter((b) => b.patientId === id),
      alerts: data.alerts.filter((a) => a.patientId === id),
      activities: data.activities,
    }
  }, [data, patientId])
}

/** Activities available for a given care stage, from live state. */
export function useActivitiesForStage(stage?: string) {
  const { data } = useData()
  return useMemo(() => data.activities.filter((a) => a.stage === stage), [data.activities, stage])
}
