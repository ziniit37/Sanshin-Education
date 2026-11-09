import type { Metadata } from 'next'
import { PrivacyPage } from '@/views/MiscPages'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy information for inquiries submitted to Sanshin Global Education.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyRoute() {
  return <PrivacyPage />
}
