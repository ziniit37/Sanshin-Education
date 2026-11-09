import type { Metadata } from 'next'
import { ProgramsPage } from '@/views/CatalogPages'

export const metadata: Metadata = {
  title: 'Study Programs in South Korea',
  description: 'Browse selected Korean academic program examples and follow official university sources for current availability and requirements.',
  alternates: { canonical: '/programs' },
}

export default function ProgramsRoute() {
  return <ProgramsPage />
}
