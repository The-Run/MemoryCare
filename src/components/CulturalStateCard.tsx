import type { CulturalStateData } from '../types'

export function CulturalStateCard({ data, selected, onClick }: { data: CulturalStateData; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected ? 'border-navy-600 bg-navy-600 text-white' : 'border-navy-100 bg-white hover:border-navy-300'
      }`}
    >
      <div className="text-2xl">🗺️</div>
      <div className={`mt-2 font-semibold ${selected ? 'text-white' : 'text-navy-800'}`}>{data.state}</div>
      <div className={`mt-0.5 text-xs ${selected ? 'text-navy-100' : 'text-navy-400'}`}>{data.languages.join(', ')}</div>
    </button>
  )
}

export function CulturalContentSection({ title, items }: { title: string; items: { title: string; description: string; icon: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-400">{title}</h4>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-xl bg-navy-50/60 p-3">
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="text-sm font-medium text-navy-700">{item.title}</div>
              <div className="text-xs text-navy-400">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
