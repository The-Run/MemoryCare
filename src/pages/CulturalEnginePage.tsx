import { useState } from 'react'
import { culturalData } from '../data/cultural'
import { CulturalStateCard, CulturalContentSection } from '../components/CulturalStateCard'
import { Card } from '../components/atoms'

export function CulturalEnginePage() {
  const [selected, setSelected] = useState(culturalData[0].state)
  const data = culturalData.find((c) => c.state === selected)!

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">NER Cultural Intelligence</h1>
        <p className="max-w-2xl text-sm text-navy-400">
          Cultural knowledge from all 8 North Eastern states, used as candidate stimuli — never assumed to be a
          patient's personal preference. The system always learns and prioritizes the individual's own observed
          response.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {culturalData.map((c) => (
          <CulturalStateCard key={c.state} data={c} selected={c.state === selected} onClick={() => setSelected(c.state)} />
        ))}
      </div>

      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-navy-900">{data.state}</h2>
          <p className="text-sm text-navy-400">Languages: {data.languages.join(', ')}</p>
        </div>
        <CulturalContentSection title="Music" items={data.music} />
        <CulturalContentSection title="Food" items={data.food} />
        <CulturalContentSection title="Festivals" items={data.festivals} />
        <CulturalContentSection title="Places" items={data.places} />
        <CulturalContentSection title="Stories" items={data.stories} />
        <CulturalContentSection title="Visual objects" items={data.visualObjects} />
      </Card>

      <div className="rounded-2xl bg-navy-50/60 p-4 text-center text-sm text-navy-600">
        NER Cultural Knowledge → <strong>Candidate Activity</strong> → Patient Response → <strong>Personal Preference</strong>
      </div>
    </div>
  )
}
