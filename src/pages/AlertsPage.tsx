import { useState } from 'react'
import { useData } from '../store/DataContext'
import { AlertCard } from '../components/AlertCard'
import { EmptyState } from '../components/atoms'
import type { AlertSeverity } from '../types'

export function AlertsPage() {
  const { data, updateAlertStatus } = useData()
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all')

  const alerts = data.alerts.filter((a) => filter === 'all' || a.severity === filter)
  const patientName = (id: string) => data.patients.find((p) => p.id === id)?.name ?? 'Unknown patient'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Alerts</h1>
        <p className="text-sm text-navy-400">Meaningful, explained changes — not raw scores.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'green', 'yellow', 'red'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === f ? 'border-navy-600 bg-navy-600 text-white' : 'border-navy-200 text-navy-600 hover:bg-navy-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'green' ? 'Normal' : f === 'yellow' ? 'Attention' : 'Concern'}
          </button>
        ))}
      </div>

      {alerts.length === 0 ? (
        <EmptyState icon="✅" title="No alerts in this category" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {alerts.map((a) => (
            <div key={a.id}>
              <div className="mb-1 text-xs font-semibold text-navy-500">{patientName(a.patientId)}</div>
              <AlertCard
                alert={a}
                onAcknowledge={() => updateAlertStatus(a.id, 'reviewing')}
                onResolve={() => updateAlertStatus(a.id, 'resolved')}
                onEscalate={() => updateAlertStatus(a.id, 'escalated')}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
