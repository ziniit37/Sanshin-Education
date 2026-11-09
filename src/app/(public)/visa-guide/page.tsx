import type { Metadata } from 'next'
import { StudentVisaGuidePage } from '@/views/ExpandedGuidancePages'

export const metadata: Metadata = {
  title: 'Korean Student Visa Guide: D-2 and D-4',
  description: 'Learn the broad D-2 and D-4 study visa categories, common preparation items, and official sources for Korean immigration procedures.',
  alternates: { canonical: '/visa-guide' },
}

export default function VisaGuideRoute() {
  return <StudentVisaGuidePage />
}
