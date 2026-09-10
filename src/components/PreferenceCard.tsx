import type { Preference } from '../types'
import { EngagementMeter } from './EngagementMeter'
import { SourceTag } from './MemoryPassportCard'

export function PreferenceCard({ preference }: { preference: Preference }) {
  return (
    <div className="rounded-xl border border-navy-100 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-navy-700">{preference.stimulus}</span>
        <SourceTag source={preference.source} />
      </div>
      <div className="mt-2">
        <EngagementMeter score={preference.engagementScore} />
      </div>
    </div>
  )
}
