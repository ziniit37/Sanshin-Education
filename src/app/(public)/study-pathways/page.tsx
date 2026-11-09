import type { Metadata } from 'next'
import { StudyPathwaysPage } from '@/views/AdmissionsPages'

export const metadata: Metadata = {
  title: 'Study Pathways in South Korea',
  description: 'Compare undergraduate, graduate, language, transfer, exchange, research, and English-taught study routes in South Korea.',
  alternates: { canonical: '/study-pathways' },
}

export default function Page() {
  return <StudyPathwaysPage />
}
