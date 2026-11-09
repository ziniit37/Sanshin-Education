import type { Metadata } from 'next'
import { StudyAbroadPage } from '@/views/StudyAbroad'

export const metadata: Metadata = {
  title: 'Study in South Korea',
  description: 'Explore South Korea as an international study destination and continue to university admissions, programs, and student-life guidance.',
  alternates: { canonical: '/study-abroad' },
}

export default function StudyAbroadRoute() {
  return <StudyAbroadPage />
}
