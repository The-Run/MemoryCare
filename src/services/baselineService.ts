import type { AlertSeverity, BaselineMetric } from '../types'

export interface BaselineEvaluation {
  deviated: boolean
  severity: AlertSeverity
  message: string
}

// BaselineService — flags meaningful deviation from a patient's OWN
// historical baseline. Never claims diagnosis; always frames results as an
// observational signal for caregiver/clinician review (BUILD SPEC §12, §19).
const METRIC_IS_BAD_WHEN_UP: Record<BaselineMetric['metric'], boolean> = {
  responseTime: true,
  assistanceRate: true,
  recognitionAccuracy: false,
  engagementScore: false,
}

export const BaselineService = {
  evaluate(baseline: BaselineMetric): BaselineEvaluation {
    const magnitude = Math.abs(baseline.changePercent)
    const isBadDirection = METRIC_IS_BAD_WHEN_UP[baseline.metric]
      ? baseline.changePercent > 0
      : baseline.changePercent < 0

    if (!isBadDirection || magnitude < 15) {
      return { deviated: false, severity: 'green', message: 'No meaningful deviation detected from personal baseline.' }
    }
    if (magnitude < 50) {
      return {
        deviated: true,
        severity: 'yellow',
        message: `Possible change: ${baseline.label} moved ${magnitude}% from personal baseline. Caregiver review recommended.`,
      }
    }
    return {
      deviated: true,
      severity: 'red',
      message: `Meaningful deviation detected: ${baseline.label} moved ${magnitude}% from personal baseline. This is an observational change signal and should be reviewed by a caregiver/clinician.`,
    }
  },
}
