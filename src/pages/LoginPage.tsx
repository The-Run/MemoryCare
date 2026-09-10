import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import type { CaregiverRole } from '../types'
import { PrimaryButton, SecondaryButton } from '../components/atoms'

const ROLES: { value: CaregiverRole; label: string }[] = [
  { value: 'caregiver', label: 'Caregiver' },
  { value: 'asha', label: 'Care Home Staff / ASHA' },
  { value: 'family', label: 'Family' },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<CaregiverRole>('caregiver')

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault()
    login(role)
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 card-shadow">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <div>
            <div className="text-base font-bold leading-tight text-navy-800">MemoryCare NER</div>
            <div className="text-[11px] text-navy-400">Caregiver sign in</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy-500">Email or phone</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya.sharma@example.com"
              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm outline-none focus:border-navy-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm outline-none focus:border-navy-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy-500">I am a...</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    role === r.value ? 'border-navy-600 bg-navy-600 text-white' : 'border-navy-200 text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <PrimaryButton type="submit" className="w-full">
            Sign in
          </PrimaryButton>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-navy-300">
          <div className="h-px flex-1 bg-navy-100" />
          or
          <div className="h-px flex-1 bg-navy-100" />
        </div>

        <SecondaryButton className="w-full" onClick={() => handleLogin()}>
          Continue as Demo Caregiver
        </SecondaryButton>
        <p className="mt-4 text-center text-[11px] text-navy-300">
          Hackathon prototype — demo login skips real authentication.
        </p>
      </div>
    </div>
  )
}
