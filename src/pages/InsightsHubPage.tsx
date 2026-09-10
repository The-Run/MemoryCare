import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { PatientAvatar } from '../components/PatientAvatar'
import { StageBadge, SeverityBadge, Card } from '../components/atoms'

export function InsightsHubPage() {
  const { data } = useData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Insights</h1>
        <p className="text-sm text-navy-400">Behavioral engagement and personal-baseline change, per patient.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.patients.map((p) => {
          const declining = data.baselines.filter((b) => b.patientId === p.id && b.trend === 'declining').length
          return (
            <Link key={p.id} to={`/patients/${p.id}/insights`}>
              <Card className="flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                <PatientAvatar patient={p} size={52} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-navy-800">{p.name}</span>
                    <SeverityBadge severity={p.attentionStatus} />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StageBadge stage={p.stage} size="sm" />
                    {declining > 0 && <span className="text-xs text-navy-400">{declining} metric(s) trending down</span>}
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
