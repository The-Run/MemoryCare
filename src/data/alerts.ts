import type { Alert } from '../types'

export const alerts: Alert[] = [
  {
    id: 'al1',
    patientId: 'p-anima-das',
    severity: 'yellow',
    title: 'Response time increased from personal baseline',
    whatChanged: 'Response time increased from 8s to 15s over the last 7 sessions (88% above baseline).',
    whyItMatters: 'Repeated deviation observed across 4 consecutive sessions — a caregiver review is recommended.',
    recommendedAction: 'Review recent routine changes and conduct a low-pressure recognition session before trying recall activities.',
    status: 'new',
    createdAt: '2026-09-09T09:00:00+05:30',
  },
  {
    id: 'al2',
    patientId: 'p-anima-das',
    severity: 'yellow',
    title: 'Recognition accuracy trending down',
    whatChanged: 'Recognition accuracy declined from 80% to 68% over the last 9 sessions.',
    whyItMatters: 'Gradual decline observed alongside increased assistance needs.',
    recommendedAction: 'Favor two-choice recognition activities using familiar photos over open recall tasks.',
    status: 'reviewing',
    createdAt: '2026-09-06T10:00:00+05:30',
    caregiverNote: 'Discussed with family over phone call on Sept 7.',
  },
  {
    id: 'al3',
    patientId: 'p-ibomcha',
    severity: 'red',
    title: 'Morning medication missed twice this week',
    whatChanged: 'Morning medication was not administered on 2 of the last 5 days.',
    whyItMatters: 'Missed medication can affect overall stability and comfort.',
    recommendedAction: 'Contact the assigned care-home staff and confirm the medication administration process.',
    status: 'new',
    createdAt: '2026-09-09T08:00:00+05:30',
  },
  {
    id: 'al4',
    patientId: 'p-pemba-sherpa',
    severity: 'yellow',
    title: 'Response time gradually increasing',
    whatChanged: 'Response time increased from 9s to 13s over the last 4 sessions (44% above baseline).',
    whyItMatters: 'Early gradual change — worth monitoring over the next few sessions.',
    recommendedAction: 'Continue familiar conversation activities and monitor over the next week.',
    status: 'new',
    createdAt: '2026-09-07T12:00:00+05:30',
  },
  {
    id: 'al5',
    patientId: 'p-ranjit-singh',
    severity: 'green',
    title: 'Stable engagement this week',
    whatChanged: 'No meaningful deviation detected from personal baseline.',
    whyItMatters: 'Consistent engagement supports current activity plan.',
    recommendedAction: 'Continue current activity mix; no action needed.',
    status: 'resolved',
    createdAt: '2026-09-05T09:00:00+05:30',
  },
]

export const getAlertsForPatient = (patientId: string) =>
  alerts.filter((a) => a.patientId === patientId)
