import type { Metadata } from 'next'
import { StudentVisaGuidePage } from '@/views/ExpandedGuidancePages'

export const metadata: Metadata = {
  title: 'Student Visa Guidance',
  description: 'Official-source overview of South Korea D-2 and D-4 student visa categories, common preparation items, and immigration links.',
  alternates: { canonical: '/visa-guide' },
}

export default function VisaGuidancePage() {
  return <StudentVisaGuidePage />
}
