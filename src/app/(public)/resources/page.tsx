import type { Metadata } from 'next'
import { ResourcesPage } from '@/views/CatalogPages'

export const metadata: Metadata = {
  title: 'South Korea Study Resource Center',
  description: 'Read practical guides to Korean university admissions, transfers, language programs, GKS scholarships, student visas, documents, and budgets.',
  alternates: { canonical: '/resources' },
}

export default function ResourcesRoute() {
  return <ResourcesPage />
}
