import type { Activity } from '../types'

export function ActivityCard({ activity, index, active }: { activity: Activity; index?: number; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${active ? 'border-navy-600 bg-navy-50/60' : 'border-navy-100 bg-white'}`}>
      {typeof index === 'number' && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-600">
          {index + 1}
        </span>
      )}
      <span className="text-2xl">{activity.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-navy-800">{activity.title}</div>
        <div className="text-xs text-navy-400">
          {activity.duration} min · {activity.type}
        </div>
      </div>
    </div>
  )
}
