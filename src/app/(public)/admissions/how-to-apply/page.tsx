import type { Metadata } from 'next'
import { HowToApplyPage } from '@/views/AdmissionsPages'

export const metadata: Metadata = {
  title: 'How to Apply to Korean Universities',
  description: 'A practical step-by-step guide to Korean university admission routes, eligibility, language requirements, documents, and enrollment.',
  alternates: { canonical: '/admissions/how-to-apply' },
}

export default function Page() {
  return <HowToApplyPage />
}
