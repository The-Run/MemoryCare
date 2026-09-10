import { useState } from 'react'
import { useData } from '../store/DataContext'
import { useToast } from '../components/Toast'
import { Card, PrimaryButton, SecondaryButton } from '../components/atoms'

const SYNC_STEPS = ['Check network', 'Encrypt', 'Diff Sync', 'Secure Server', 'Updated Bundle']

export function OfflinePage() {
  const { data, isOnline, syncing, pendingCount, lastSyncedAt, goOffline, goOnline, addObservation, logAudit } = useData()
  const { showToast } = useToast()
  const [demoPatientId] = useState(data.patients[0]?.id)
  const patient = data.patients.find((p) => p.id === demoPatientId)

  const recordOfflineObservation = () => {
    if (!patient) return
    addObservation({
      sessionId: 'offline-demo',
      patientId: patient.id,
      activityId: 'a-music-1',
      response: 'positive',
      responseTime: 6,
      assistanceRequired: 'independent',
      engagement: 'positive',
      caregiverNote: 'Recorded while offline — queued for sync.',
    })
    logAudit('Recorded observation offline', patient.name)
    showToast(isOnline ? 'Observation recorded.' : 'Observation saved locally — will sync when online.', 'info')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Offline Mode</h1>
        <p className="max-w-xl text-sm text-navy-400">
          MemoryCare NER works fully on-device with no connectivity, and syncs safely once the network returns.
        </p>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className={`text-lg font-semibold ${isOnline ? 'text-[var(--color-alert-green)]' : 'text-[var(--color-alert-yellow)]'}`}>
            {syncing ? 'Syncing…' : isOnline ? 'Online & Synced' : 'Offline'}
          </div>
          <div className="mt-1 text-xs text-navy-400">Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'never'}</div>
          {pendingCount > 0 && <div className="mt-1 text-xs text-[var(--color-alert-yellow)]">{pendingCount} change(s) pending sync</div>}
        </div>
        {isOnline ? (
          <SecondaryButton onClick={goOffline}>Simulate Offline</SecondaryButton>
        ) : (
          <PrimaryButton onClick={goOnline}>Restore Connection</PrimaryButton>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy-400">When offline, the device stores</h3>
          <ul className="space-y-1 text-sm text-navy-600">
            <li>🗂️ Patient profile (IndexedDB / localStorage)</li>

            <li>🎯 Active sessions & cached activities</li>
            <li>🎵 Audio / cultural content</li>
            <li>📝 Observations & caregiver notes</li>
          </ul>
          {patient && (
            <div className="mt-3 rounded-lg bg-navy-50/60 p-2 text-xs text-navy-500">
              e.g. {data.preferences.filter((p) => p.patientId === patient.id).length} cached preference records for{' '}
              {patient.preferredName}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy-400">When network returns</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {SYNC_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 font-medium ${syncing ? 'bg-navy-600 text-white' : 'bg-navy-50 text-navy-500'}`}>{step}</span>
                {i < SYNC_STEPS.length - 1 && <span className="text-navy-300">→</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 text-sm font-semibold text-navy-800">Try it: record an observation {isOnline ? '' : 'while offline'}</h3>
        <p className="mb-3 text-sm text-navy-400">
          Toggle offline above, record an observation, then restore connection and watch it sync.
        </p>
        <SecondaryButton onClick={recordOfflineObservation}>Record Sample Observation</SecondaryButton>
      </Card>
    </div>
  )
}
