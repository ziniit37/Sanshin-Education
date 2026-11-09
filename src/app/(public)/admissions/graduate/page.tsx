import type { Metadata } from 'next'
import { GraduateAdmissionsPage } from '@/views/AdmissionsPages'

export const metadata: Metadata = {
  title: 'Graduate Admissions in South Korea',
  description: 'Plan master’s, doctoral, integrated, and research-oriented applications to Korean universities.',
  alternates: { canonical: '/admissions/graduate' },
}

export default function Page() {
  return <GraduateAdmissionsPage />
}
