import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useAuth } from '../store/AuthContext'
import { PatientAvatar } from '../components/PatientAvatar'
import { OfflineSyncIndicator } from '../components/OfflineSyncIndicator'
import { ConnectivitySimulator } from '../components/ConnectivitySimulator'

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentCaregiver, data, enterPatientMode } = useData()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('English')
  const [profileOpen, setProfileOpen] = useState(false)
  const alertCount = data.alerts.filter((a) => a.status === 'new').length

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-navy-100 bg-white px-4 sm:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-navy-500 hover:bg-navy-50 lg:hidden" aria-label="Menu">
        ☰
      </button>
      <div className="flex items-center gap-2 lg:hidden">
        <span className="text-xl">🧠</span>
        <span className="text-sm font-bold text-navy-800">MemoryCare NER</span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span
          className="hidden rounded-full bg-[var(--color-amber-100)] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[var(--color-amber-600)] lg:inline-flex"
          title="Demo Mode: preloaded data, mocked AI services, simulated connectivity"
        >
          DEMO MODE
        </span>
        <ConnectivitySimulator className="hidden sm:inline-flex" />
        <OfflineSyncIndicator compact />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="hidden rounded-lg border border-navy-200 bg-white px-2 py-1.5 text-xs text-navy-600 sm:block"
          aria-label="Language"
        >
          <option>English</option>
          <option>Assamese</option>
          <option>Khasi</option>
          <option>Nepali</option>
        </select>

        <button
          onClick={() => navigate('/alerts')}
          className="relative rounded-lg p-2 text-navy-500 hover:bg-navy-50"
          aria-label="Notifications"
        >
          🔔
          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-alert-red)] text-[9px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { enterPatientMode(); navigate('/patient/home') }}
          className="hidden rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-100 md:inline-flex"
        >
          Enter Patient Mode
        </button>

        <div className="relative">
          <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 rounded-full hover:opacity-80">
            <PatientAvatar patient={{ name: currentCaregiver.name, avatarInitials: initials(currentCaregiver.name), avatarColor: currentCaregiver.avatarColor }} size={34} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-navy-100 bg-white p-2 card-shadow">
              <div className="px-2 py-1.5 text-sm font-semibold text-navy-700">{currentCaregiver.name}</div>
              <div className="px-2 pb-2 text-xs capitalize text-navy-400">{currentCaregiver.role}</div>
              <button
                onClick={() => navigate('/settings')}
                className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-navy-600 hover:bg-navy-50"
              >
                Settings
              </button>
              <button onClick={() => { logout(); navigate('/login') }} className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-navy-600 hover:bg-navy-50">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
