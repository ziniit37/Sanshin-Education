'use client'

import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { AdminLayout } from '@/views/AdminPages'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={['admin', 'super_admin']}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  )
}
