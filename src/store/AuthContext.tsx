import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CaregiverRole } from '../types'

interface AuthContextValue {
  isAuthenticated: boolean
  role: CaregiverRole
  login: (role?: CaregiverRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'memorycare_auth_v1'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')
  const [role, setRole] = useState<CaregiverRole>('caregiver')

  const login = (nextRole: CaregiverRole = 'caregiver') => {
    setRole(nextRole)
    setIsAuthenticated(true)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
