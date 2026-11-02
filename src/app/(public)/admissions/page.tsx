import type { Metadata } from 'next'
import { GuidancePage } from '@/views/GuidancePages'

export const metadata: Metadata = {
  title: 'Korean University Admissions',
  description: 'Learn how to research program eligibility, prepare application documents, and confirm deadlines with Korean universities.',
}

export default function AdmissionsPage() {
  return <GuidancePage page="admissions" />
}
