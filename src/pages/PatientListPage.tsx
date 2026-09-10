import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { PatientCard } from '../components/PatientCard'
import { PrimaryButton } from '../components/atoms'
import { EmptyState } from '../components/atoms'
import type { Stage, AlertSeverity } from '../types'

export function PatientListPage() {
  const { data } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState<Stage | 'all'>('all')
  const [language, setLanguage] = useState('all')
  const [attention, setAttention] = useState<AlertSeverity | 'all'>('all')
  const [careHomeOnly, setCareHomeOnly] = useState(false)

  const languages = useMemo(() => Array.from(new Set(data.patients.map((p) => p.language))), [data.patients])

  const filtered = data.patients.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.preferredName.toLowerCase().includes(search.toLowerCase())) return false
    if (stage !== 'all' && p.stage !== stage) return false
    if (language !== 'all' && p.language !== language) return false
    if (attention !== 'all' && p.attentionStatus !== attention) return false
    if (careHomeOnly && !p.careHome) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Patients</h1>
          <p className="text-sm text-navy-400">{data.patients.length} patients under care</p>
        </div>
        <PrimaryButton onClick={() => navigate('/patients/new')}>+ Add Patient</PrimaryButton>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 card-shadow">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="min-w-[180px] flex-1 rounded-xl border border-navy-200 px-3 py-2 text-sm outline-none focus:border-navy-500"
        />
        <select value={stage} onChange={(e) => setStage(e.target.value as Stage | 'all')} className="rounded-xl border border-navy-200 px-3 py-2 text-sm">
          <option value="all">All stages</option>
          <option value="early">Early</option>
          <option value="moderate">Moderate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-xl border border-navy-200 px-3 py-2 text-sm">
          <option value="all">All languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select value={attention} onChange={(e) => setAttention(e.target.value as AlertSeverity | 'all')} className="rounded-xl border border-navy-200 px-3 py-2 text-sm">
          <option value="all">All attention levels</option>
          <option value="green">Normal</option>
          <option value="yellow">Attention</option>
          <option value="red">Concern</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-navy-200 px-3 py-2 text-sm text-navy-600">
          <input type="checkbox" checked={careHomeOnly} onChange={(e) => setCareHomeOnly(e.target.checked)} />
          Care home only
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No patients match these filters" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
    </div>
  )
}
