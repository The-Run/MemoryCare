import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/patients', label: 'Patients', icon: '🧑‍🤝‍🧑' },
  { to: '/sessions', label: 'Care Sessions', icon: '🗓️' },
  { to: '/passports', label: 'Care & Memory Passport', icon: '📔' },
  { to: '/insights', label: 'Insights', icon: '📈' },
  { to: '/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/copilot', label: 'AI Copilot', icon: '🤖' },
  { to: '/routine', label: 'Routine', icon: '💊' },
  { to: '/care-home', label: 'Care Home', icon: '🏥' },
  { to: '/offline', label: 'Offline Sync', icon: '📶' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

const SECONDARY_ITEMS = [
  { to: '/cultural-engine', label: 'NER Cultural Engine', icon: '🗺️' },
  { to: '/family', label: 'Family Contributions', icon: '👪' },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-navy-800 text-navy-100">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">🧠</span>
        <div>
          <div className="text-sm font-bold leading-tight text-white">MemoryCare</div>
          <div className="text-[11px] tracking-wide text-navy-300">NER</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item, i) => (
          <NavLink
            key={item.label + i}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-navy-600 text-white' : 'text-navy-200 hover:bg-navy-700/60 hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="mt-3 border-t border-navy-700 pt-3">
          {SECONDARY_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-navy-600 text-white' : 'text-navy-300 hover:bg-navy-700/60 hover:text-white'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="px-5 py-4 text-[11px] text-navy-400">Prototype · No cloud dependency</div>
    </aside>
  )
}
