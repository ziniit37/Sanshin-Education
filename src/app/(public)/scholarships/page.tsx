import type { Metadata } from 'next'
import { ScholarshipFinderPage } from '@/views/ExpandedGuidancePages'

export const metadata: Metadata = {
  title: 'Korean University Scholarships and GKS',
  description: 'Compare official GKS and university scholarship pathways for study in South Korea. Confirm current eligibility, benefits, countries, and deadlines with each provider.',
  alternates: { canonical: '/scholarships' },
}

export default function ScholarshipsRoute() {
  return <ScholarshipFinderPage />
}
