import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { Card, EmptyState, Modal, PrimaryButton, StageBadge } from '../components/atoms'

export function SessionsListPage() {
  const { data } = useData()
  const navigate = useNavigate()
  const [pickerOpen, setPickerOpen] = useState(false)

  const sessions = [...data.sessions].sort((a, b) => (a.date < b.date ? 1 : -1))
  const patientName = (id: string) => data.patients.find((p) => p.id === id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Care Sessions</h1>
          <p className="text-sm text-navy-400">Every past and in-progress guided care session.</p>
        </div>
        <PrimaryButton onClick={() => setPickerOpen(true)}>+ Start Session</PrimaryButton>
      </div>

      {sessions.length === 0 ? (
        <EmptyState icon="🗓️" title="No sessions yet" action={<PrimaryButton onClick={() => setPickerOpen(true)}>Start your first session</PrimaryButton>} />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const patient = patientName(s.patientId)
            return (
              <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-navy-800">{patient?.name}</div>
                  <div className="text-xs text-navy-400">
                    {new Date(s.date).toLocaleString()} · {s.duration} min · {s.activityIds.length} activities
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {patient && <StageBadge stage={patient.stage} size="sm" />}
                  <span className="text-sm capitalize text-navy-600">{s.overallEngagement}</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Start a Care Session">
        <div className="space-y-2">
          {data.patients.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/session/${p.id}`)}
              className="flex w-full items-center justify-between rounded-xl border border-navy-100 p-3 text-left hover:border-navy-400"
            >
              <span className="font-medium text-navy-700">{p.name}</span>
              <StageBadge stage={p.stage} size="sm" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
