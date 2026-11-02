import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useData } from '@/contexts/DataProvider'
import { getDb, setDb } from '@/lib/db'
import type { Role, User } from '@/lib/types'
import { hashPassword, nowIso, uid } from '@/lib/utils'

const SESSION_KEY = 'sanshin.session'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<{ error?: string; otp?: string }>
  verifyOtp: (email: string, code: string) => Promise<string | null>
  loginWithGoogle: (name: string, email: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error?: string; token?: string }>
  resetPassword: (token: string, password: string) => Promise<string | null>
  logout: () => void
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { db, ready } = useData()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setUserId(localStorage.getItem(SESSION_KEY))
  }, [])

  const user = useMemo(() => {
    if (!db || !userId) return null
    return db.users.find((u) => u.id === userId) ?? null
  }, [db, userId])

  const persistSession = (id: string | null) => {
    setUserId(id)
    if (id) localStorage.setItem(SESSION_KEY, id)
    else localStorage.removeItem(SESSION_KEY)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email, password) => {
        const hash = await hashPassword(password)
        const match = getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash)
        if (!match) return 'Invalid email or password.'
        if (!match.emailVerified) return 'Please verify your email with the OTP we issued.'
        persistSession(match.id)
        return null
      },
      register: async (name, email, password) => {
        const existing = getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (existing) return { error: 'An account with that email already exists.' }
        const passwordHash = await hashPassword(password)
        const id = uid('user')
        const code = String(Math.floor(100000 + Math.random() * 900000))
        setDb((current) => ({
          ...current,
          users: [
            ...current.users,
            {
              id,
              email,
              passwordHash,
              name,
              role: 'student',
              emailVerified: false,
              createdAt: nowIso(),
            },
          ],
          studentProfiles: [
            ...current.studentProfiles,
            {
              id: uid('sprof'),
              userId: id,
              nationality: '',
              educationLevel: '',
              createdAt: nowIso(),
            },
          ],
          authMeta: {
            ...current.authMeta,
            otps: [
              ...current.authMeta.otps.filter((o) => o.email !== email.toLowerCase()),
              { email: email.toLowerCase(), code, expiresAt: Date.now() + 15 * 60 * 1000 },
            ],
          },
        }))
        return { otp: code }
      },
      verifyOtp: async (email, code) => {
        const dbNow = getDb()
        const otp = dbNow.authMeta.otps.find(
          (o) => o.email === email.toLowerCase() && o.code === code && o.expiresAt > Date.now(),
        )
        if (!otp) return 'Invalid or expired code.'
        const match = dbNow.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!match) return 'Account not found.'
        setDb((current) => ({
          ...current,
          users: current.users.map((u) => (u.id === match.id ? { ...u, emailVerified: true } : u)),
          authMeta: {
            ...current.authMeta,
            otps: current.authMeta.otps.filter((o) => o.email !== email.toLowerCase()),
          },
        }))
        persistSession(match.id)
        return null
      },
      loginWithGoogle: async (name, email) => {
        const existing = getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (existing) {
          persistSession(existing.id)
          return
        }
        const id = uid('user')
        setDb((current) => ({
          ...current,
          users: [
            ...current.users,
            {
              id,
              email,
              passwordHash: '',
              name,
              role: 'student',
              emailVerified: true,
              googleId: 'demo-google',
              createdAt: nowIso(),
            },
          ],
          studentProfiles: [
            ...current.studentProfiles,
            {
              id: uid('sprof'),
              userId: id,
              nationality: '',
              educationLevel: '',
              createdAt: nowIso(),
            },
          ],
        }))
        persistSession(id)
      },
      requestPasswordReset: async (email) => {
        const match = getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!match) return { error: 'No account found for that email.' }
        const token = uid('rst')
        setDb((current) => ({
          ...current,
          authMeta: {
            ...current.authMeta,
            resetTokens: [
              ...current.authMeta.resetTokens.filter((t) => t.email !== email.toLowerCase()),
              { email: email.toLowerCase(), token, expiresAt: Date.now() + 30 * 60 * 1000 },
            ],
          },
        }))
        return { token }
      },
      resetPassword: async (token, password) => {
        const entry = getDb().authMeta.resetTokens.find((t) => t.token === token && t.expiresAt > Date.now())
        if (!entry) return 'Invalid or expired reset link.'
        const passwordHash = await hashPassword(password)
        setDb((current) => ({
          ...current,
          users: current.users.map((u) =>
            u.email.toLowerCase() === entry.email ? { ...u, passwordHash } : u,
          ),
          authMeta: {
            ...current.authMeta,
            resetTokens: current.authMeta.resetTokens.filter((t) => t.token !== token),
          },
        }))
        return null
      },
      logout: () => persistSession(null),
      hasRole: (...roles) => !!user && roles.includes(user.role),
    }),
    [user, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
