import type { Metadata } from 'next'
import { BookConsultationPage } from '@/views/MiscPages'

export const metadata: Metadata = {
  title: 'Book a Korea Study Consultation',
  description: 'Request a consultation about South Korean university admissions, study pathways, and application preparation.',
  alternates: { canonical: '/book-consultation' },
}

export default function BookConsultationRoute() {
  return <BookConsultationPage />
}
