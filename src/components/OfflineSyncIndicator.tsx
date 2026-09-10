import { useData } from '../store/DataContext'

export function OfflineSyncIndicator({ compact = false }: { compact?: boolean }) {
  const { isOnline, pendingCount, lastSyncedAt } = useData()

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          isOnline ? 'bg-[var(--color-alert-green-bg)] text-[var(--color-alert-green)]' : 'bg-[var(--color-alert-yellow-bg)] text-[var(--color-alert-yellow)]'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
        {isOnline ? 'Online' : `Offline${pendingCount ? ` · ${pendingCount} pending` : ''}`}
      </span>
    )
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-navy-700">{isOnline ? 'Online & synced' : 'Working offline'}</span>
        {pendingCount > 0 && <span className="text-xs text-navy-400">{pendingCount} change(s) pending sync</span>}
      </div>
      <div className="mt-1 text-xs text-navy-400">
        Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'never'}
      </div>
    </div>
  )
}
