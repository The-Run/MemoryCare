import type { CopilotRecommendationCard } from '../types'

export function CopilotRecommendation({ card }: { card: CopilotRecommendationCard }) {
  const priorityColor = card.priority === 'high' ? 'var(--color-alert-red)' : card.priority === 'medium' ? 'var(--color-alert-yellow)' : 'var(--color-alert-green)'
  return (
    <div className="rounded-2xl bg-white p-5 card-shadow">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: priorityColor }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">{card.priority} priority</span>
      </div>
      <h3 className="mt-2 font-semibold text-navy-800">{card.headline}</h3>
      <p className="mt-1 text-sm text-navy-500">{card.observation}</p>
      <div className="mt-3 rounded-xl bg-navy-50/70 p-3 text-sm text-navy-700">
        <span className="font-semibold text-navy-800">Recommendation: </span>
        {card.recommendation}
      </div>
    </div>
  )
}
