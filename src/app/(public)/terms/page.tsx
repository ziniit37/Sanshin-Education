import type { Metadata } from 'next'
import { TermsPage } from '@/views/MiscPages'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Review the terms and limitations for general information and study guidance published by Sanshin Global Education.',
  alternates: { canonical: '/terms' },
}

export default function TermsRoute() {
  return <TermsPage />
}
