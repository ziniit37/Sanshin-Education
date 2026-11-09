import type { Metadata } from 'next'
import { FaqPage } from '@/views/MiscPages'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions About Studying in Korea',
  description: 'Answers about Korean university admissions, transfers, scholarships, student visas, and budgeting for international students.',
  alternates: { canonical: '/faq' },
}

export default function FaqRoute() {
  return <FaqPage />
}
