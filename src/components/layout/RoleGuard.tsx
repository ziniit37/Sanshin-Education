import type { ReactNode } from 'react'
import { Navigate } from '@/lib/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import { useData } from '@/contexts/DataProvider'
import type { Role } from '@/lib/types'

export function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = useAuth()
  const { ready } = useData()
  if (!ready) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={user.role === 'student' || user.role === 'counselor' ? '/portal' : '/'} replace />
  return <>{children}</>
}
