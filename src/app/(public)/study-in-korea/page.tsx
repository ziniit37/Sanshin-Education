import type { Metadata } from 'next'
import { GuidancePage } from '@/views/GuidancePages'

export const metadata: Metadata = {
  title: 'Study in South Korea',
  description: 'Explore study pathways, university admissions, scholarships, and practical preparation for studying in South Korea.',
  alternates: { canonical: '/study-in-korea' },
}

export default function StudyInKoreaPage() {
  return <GuidancePage page="study" />
}
