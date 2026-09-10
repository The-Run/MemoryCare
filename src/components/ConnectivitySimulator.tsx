import { useData } from '../store/DataContext'

export function ConnectivitySimulator({ className = '' }: { className?: string }) {
  const { isOnline, goOffline, goOnline } = useData()
  return (
    <button
      onClick={() => (isOnline ? goOffline() : goOnline())}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        isOnline ? 'border-navy-200 text-navy-600 hover:bg-navy-50' : 'border-[var(--color-alert-yellow)] bg-[var(--color-alert-yellow-bg)] text-[var(--color-alert-yellow)]'
      } ${className}`}
      title="Simulate connectivity change (demo)"
    >
      <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[var(--color-alert-green)]' : 'bg-[var(--color-alert-yellow)]'}`} />
      {isOnline ? 'Simulate offline' : 'Restore connection'}
    </button>
  )
}
