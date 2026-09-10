import { useData } from '../store/DataContext'
import { ConsentBadge, Card, SecondaryButton } from '../components/atoms'
import { useToast } from '../components/Toast'

const ROLES = ['Caregiver', 'ASHA', 'Clinician', 'Family', 'Admin']
const CONSENT_LABELS: Record<string, string> = { voice: 'Voice recordings', photos: 'Photos', memories: 'Memories', careData: 'Care data' }

export function SettingsPage() {
  const { data, resetDemoData } = useData()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Settings & Privacy</h1>
        <p className="text-sm text-navy-400">Minimal, transparent access control — no unnecessary medical exposure.</p>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Access Control</h2>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <span key={r} className="chip">
              {r}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-navy-400">
          Least-privilege UI: a patient never sees caregiver-only analytics or private profile information.
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Consent</h2>
        <div className="flex flex-wrap gap-2">
          {data.consents.map((c) => (
            <ConsentBadge key={c.type} granted={c.granted} label={CONSENT_LABELS[c.type]} />
          ))}
        </div>
        <div className="mt-3 space-y-1 text-xs text-navy-400">
          {data.consents.map((c) => (
            <div key={c.type}>
              {CONSENT_LABELS[c.type]} — granted by {c.grantedBy} on {c.date}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Privacy</h2>
        <ul className="space-y-1.5 text-sm text-navy-600">
          <li>🔒 AES-256 local encryption (target architecture)</li>
          <li>📉 Data minimization — only what care requires is stored</li>
          <li>🧩 Role-based / attribute-based access control</li>
          <li>🚫 No raw voice retained in the cloud</li>
        </ul>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-navy-800">Audit Log</h2>
        <div className="max-h-72 space-y-2 overflow-y-auto">
          {data.auditLog.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-50 pb-2 text-sm last:border-0">
              <span className="font-medium text-navy-700">{entry.actor}</span>
              <span className="text-navy-500">{entry.action}</span>
              <span className="text-navy-400">{entry.target}</span>
              <span className="text-xs text-navy-300">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          ))}
          {data.auditLog.length === 0 && <p className="text-sm text-navy-400">No activity logged yet.</p>}
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold text-navy-800">Demo Mode</h2>
        <ul className="mb-3 space-y-1 text-sm text-navy-600">
          <li>✓ Preloaded realistic patients, sessions, baselines and alerts</li>
          <li>✓ Authentication skipped — one-click demo login</li>
          <li>✓ AI services mocked deterministically (no API keys, no cloud)</li>
          <li>✓ Connectivity, sync and adaptive activity changes simulated locally</li>
        </ul>
        <p className="mb-3 text-sm text-navy-400">Reset the prototype back to its original seeded demo state.</p>
        <SecondaryButton
          onClick={() => {
            resetDemoData()
            showToast('Demo data reset.', 'info')
          }}
        >
          Reset Demo Data
        </SecondaryButton>
      </Card>
    </div>
  )
}
