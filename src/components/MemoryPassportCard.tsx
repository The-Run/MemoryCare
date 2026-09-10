import type { ReactNode } from 'react'
import type { MemorySource } from '../types'

export function PassportSection({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 card-shadow">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-navy-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}

const SOURCE_LABEL: Record<MemorySource, string> = {
  patient: 'Patient',
  family: 'Family',
  caregiver: 'Caregiver',
  record: 'Record',
  observed: 'Observed',
}

export function SourceTag({ source }: { source: MemorySource }) {
  return <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-medium text-navy-400">Source: {SOURCE_LABEL[source]}</span>
}

export function FieldRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-navy-50 py-2 text-sm last:border-0">
      <span className="text-navy-400">{label}</span>
      <span className="font-medium text-navy-700">{value}</span>
    </div>
  )
}
