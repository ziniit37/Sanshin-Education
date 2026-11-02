'use client'

import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { PortalLayout } from '@/views/PortalPages'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={['student', 'counselor', 'admin', 'super_admin']}>
      <PortalLayout>{children}</PortalLayout>
    </RoleGuard>
  )
}
