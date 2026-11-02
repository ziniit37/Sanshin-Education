'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthProvider'
import { DataProvider } from '@/contexts/DataProvider'
import { SiteContentProvider } from '@/contexts/SiteContentProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { ToastProvider } from '@/contexts/ToastProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DataProvider>
        <SiteContentProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </SiteContentProvider>
      </DataProvider>
    </ThemeProvider>
  )
}
