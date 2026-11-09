import type { Metadata } from 'next'
import { ContactPage } from '@/views/MiscPages'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Sanshin Global Education about Korean university admissions, study pathways, language programs, scholarships, and student preparation.',
  alternates: { canonical: '/contact' },
}

export default function ContactRoute() {
  return <ContactPage />
}
