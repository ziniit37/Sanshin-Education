import type { Metadata } from 'next'
import { ServicesPage } from '@/views/CatalogPages'

export const metadata: Metadata = {
  title: 'Korean University Admissions Support Services',
  description: 'Explore study selection, application preparation, scholarship research, visa information, and pre-departure guidance.',
  alternates: { canonical: '/services' },
}

export default function ServicesRoute() {
  return <ServicesPage />
}
