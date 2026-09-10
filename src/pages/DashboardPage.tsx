import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { AddObservationModal } from '../components/AddObservationModal'
import { PatientAvatar } from '../components/PatientAvatar'
import { Card, PrimaryButton, SecondaryButton, SeverityBadge } from '../components/atoms'
import { OfflineSyncIndicator } from '../components/OfflineSyncIndicator'

export function DashboardPage() {
  const { data, currentCaregiver } = useData()
  const navigate = useNavigate()
  const [observationOpen, setObservationOpen] = useState(false)
  const { patients, sessions, alerts, observations } = data

  const todaysSessions = sessions.filter((s) => new Date(s.date).toDateString() === new Date().toDateString())
  const needsAttention = patients.filter((p) => p.attentionStatus !== 'green')
  const openAlerts = [...alerts].filter((a) => a.status !== 'resolved').slice(0, 3)

  const recent = [...observations]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5)
    .map((o) => {
      const session = sessions.find((s) => s.id === o.sessionId)
      const patient = patients.find((p) => p.id === o.patientId)
      return { o, session, patient }
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Good morning, {currentCaregiver.name.split(' ')[0]} 👋</h1>
        <p className="text-sm text-navy-400">Here's what's happening with your patients today.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Active Patients" value={patients.length} icon="🧑‍🤝‍🧑" />
        <SummaryCard label="Today's Sessions" value={todaysSessions.length} icon="🗓️" />
        <SummaryCard label="Needing Attention" value={needsAttention.length} icon="⚠️" tone="warning" />
        <div className="rounded-2xl bg-white p-4 card-shadow">
          <div className="text-xs font-medium uppercase tracking-wide text-navy-400">Offline Sync</div>
          <div className="mt-2">
            <OfflineSyncIndicator />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-800">Today's Care Plan</h2>
          </div>
          <div className="space-y-3">
            {patients.slice(0, 4).map((p) => {
              const plan = data.activities.filter((a) => a.stage === p.stage).slice(0, 2)
              const routine = data.routines.find((r) => r.patientId === p.id && r.status === 'upcoming')
              return (
                <Card key={p.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to={`/patients/${p.id}`} className="flex items-center gap-3 hover:opacity-80 sm:w-56 sm:shrink-0">
                    <PatientAvatar patient={p} />
                    <div>
                      <div className="font-semibold text-navy-800">{p.name}</div>
                      <div className="text-xs text-navy-400">{p.language}</div>
                    </div>
                  </Link>
                  <ul className="flex-1 space-y-1 text-sm text-navy-600">
                    {plan.map((a) => (
                      <li key={a.id}>
                        {a.icon} {a.title} — {a.duration} min
                      </li>
                    ))}
                    {routine && <li>🔔 {routine.title} reminder at {routine.time}</li>}
                  </ul>
                  <SecondaryButton onClick={() => navigate(`/session/${p.id}`)}>Start Session</SecondaryButton>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-800">Needs Attention</h2>
          <div className="space-y-3">
            {openAlerts.map((a) => {
              const patient = patients.find((p) => p.id === a.patientId)
              return (
                <Card key={a.id}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy-800">{patient?.preferredName}</span>
                    <SeverityBadge severity={a.severity} />
                  </div>
                  <p className="mt-2 text-sm text-navy-600">{a.whatChanged}</p>
                  <p className="mt-2 rounded-lg bg-navy-50/70 p-2 text-xs text-navy-600">
                    <span className="font-semibold">Recommended: </span>
                    {a.recommendedAction}
                  </p>
                  <Link to="/alerts" className="mt-2 inline-block text-xs font-semibold text-navy-500 hover:underline">
                    View alert →
                  </Link>
                </Card>
              )
            })}
            {openAlerts.length === 0 && <Card className="text-sm text-navy-400">No open alerts right now.</Card>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-navy-800">Recent Activity</h2>
          <Card className="divide-y divide-navy-50 p-0">
            {recent.map(({ o, session, patient }) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <div>
                  <span className="font-semibold text-navy-700">{patient?.preferredName}</span>{' '}
                  <span className="text-navy-400">· {session?.stage} session</span>
                </div>
                <span className="text-navy-500 capitalize">{o.engagement}</span>
                <span className="text-navy-400">{o.responseTime}s</span>
                {o.caregiverNote && <span className="italic text-navy-400">"{o.caregiverNote}"</span>}
              </div>
            ))}
            {recent.length === 0 && <div className="p-4 text-sm text-navy-400">No recent activity yet.</div>}
          </Card>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-navy-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <PrimaryButton onClick={() => navigate('/patients/new')}>+ Add Patient</PrimaryButton>
            <SecondaryButton onClick={() => navigate('/sessions')}>Start Session</SecondaryButton>
            <SecondaryButton onClick={() => setObservationOpen(true)}>Add Observation</SecondaryButton>
            <SecondaryButton onClick={() => navigate('/alerts')}>View Alerts</SecondaryButton>
          </div>
          <AddObservationModal open={observationOpen} onClose={() => setObservationOpen(false)} />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, icon, tone }: { label: string; value: number; icon: string; tone?: 'warning' }) {
  return (
    <div className="rounded-2xl bg-white p-4 card-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-navy-400">{label}</span>
        <span>{icon}</span>
      </div>
      <div className={`mt-2 text-2xl font-bold ${tone === 'warning' ? 'text-[var(--color-alert-yellow)]' : 'text-navy-800'}`}>{value}</div>
    </div>
  )
}
