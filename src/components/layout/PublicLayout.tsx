import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FloatingContact } from '@/components/layout/FloatingContact'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  )
}
