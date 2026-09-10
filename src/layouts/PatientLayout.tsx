import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { getPatient } from '../data/patients'

const NAV = [
  { to: '/patient/home', label: 'Home', icon: '🏠' },
  { to: '/patient/pictures', label: 'Pictures', icon: '🖼️' },
  { to: '/patient/games', label: 'Games', icon: '🧩' },
  { to: '/patient/music', label: 'Music', icon: '🎵' },
  { to: '/patient/routine', label: 'Routine', icon: '📋' },
]

export function PatientLayout() {
  const { activePatientId, exitPatientMode } = useData()
  const navigate = useNavigate()
  const patient = activePatientId ? getPatient(activePatientId) : undefined

  const handleExit = () => {
    exitPatientMode()
    navigate('/dashboard')
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden" style={{ background: '#fbfaf6' }}>
      <header className="flex items-center justify-between border-b border-navy-100 bg-white px-5 py-3">
        <div className="text-lg font-semibold text-navy-800">{patient ? patient.preferredName : 'MemoryCare'}</div>
        <button
          onClick={handleExit}
          className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-400 hover:bg-navy-50"
          title="Caregiver only"
        >
          Exit Patient Mode
        </button>
      </header>

      <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <Outlet />
        <button
          onClick={() => navigate('/patient/voice')}
          className="fixed bottom-24 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-navy-600 text-3xl text-white shadow-lg transition hover:bg-navy-700 sm:right-8"
          aria-label="Talk"
        >
          🎙️
        </button>
      </main>

      <nav className="grid shrink-0 grid-cols-5 gap-1 border-t border-navy-100 bg-white px-2 py-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold ${
                isActive ? 'bg-navy-600 text-white' : 'text-navy-500'
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
