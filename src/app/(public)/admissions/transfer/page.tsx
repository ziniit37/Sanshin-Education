import type { Metadata } from 'next'
import { TransferAdmissionsPage } from '@/views/AdmissionsPages'

export const metadata: Metadata = {
  title: 'Transfer Admissions in South Korea',
  description: 'Understand Korean university transfer admission, internal changes of major, and the difference between language study and degree admission.',
  alternates: { canonical: '/admissions/transfer' },
}

export default function Page() {
  return <TransferAdmissionsPage />
}
