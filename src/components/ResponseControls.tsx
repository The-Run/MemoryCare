import { useState } from 'react'
import type { AssistanceLevel, EngagementLevel } from '../types'
import { PrimaryButton } from './atoms'

export function ResponseControls({
  onSubmit,
}: {
  onSubmit: (result: { engagement: EngagementLevel; assistance: AssistanceLevel; note?: string }) => void
}) {
  const [engagement, setEngagement] = useState<EngagementLevel | null>(null)
  const [assistance, setAssistance] = useState<AssistanceLevel | null>(null)
  const [note, setNote] = useState('')

  const engagementOptions: { value: EngagementLevel; label: string; icon: string }[] = [
    { value: 'positive', label: 'Positive engagement', icon: '😊' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'negative', label: 'Negative / discomfort', icon: '☹️' },
  ]
  const assistanceOptions: { value: AssistanceLevel; label: string }[] = [
    { value: 'independent', label: 'Remembered independently' },
    { value: 'hint', label: 'Needed hint' },
    { value: 'assisted', label: 'Needed assistance' },
    { value: 'no_response', label: 'No response' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Response</div>
        <div className="grid grid-cols-3 gap-2">
          {engagementOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEngagement(opt.value)}
              className={`rounded-xl border-2 px-3 py-4 text-center transition ${
                engagement === opt.value ? 'border-navy-600 bg-navy-50' : 'border-navy-100 bg-white hover:border-navy-300'
              }`}
            >
              <div className="text-2xl">{opt.icon}</div>
              <div className="mt-1 text-xs font-medium text-navy-600">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Assistance level</div>
        <div className="flex flex-wrap gap-2">
          {assistanceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAssistance(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                assistance === opt.value ? 'border-navy-600 bg-navy-600 text-white' : 'border-navy-200 text-navy-600 hover:bg-navy-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">Caregiver note (optional)</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="e.g. Smiled and hummed along to the song"
          className="w-full rounded-xl border border-navy-200 p-2 text-sm outline-none focus:border-navy-500"
        />
      </div>

      <PrimaryButton
        className="w-full"
        disabled={!engagement || !assistance}
        onClick={() => engagement && assistance && onSubmit({ engagement, assistance, note: note || undefined })}
      >
        Record response
      </PrimaryButton>
    </div>
  )
}
