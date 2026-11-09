import type { Metadata } from 'next'
import { AdmissionsIntakesPage } from '@/views/AdmissionsPages'

export const metadata: Metadata = {
  title: 'Korean University Intakes and 2027 Admissions Calendar',
  description: 'Compare official Korean university application windows for 2027 and check intake, deadlines, status, and source links.',
  alternates: { canonical: '/admissions/intakes' },
}

export default function Page() {
  return <AdmissionsIntakesPage />
}
