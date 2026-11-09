import type { Metadata } from 'next'
import { UniversitiesPage } from '@/views/CatalogPages'

export const metadata: Metadata = {
  title: 'Korean University Directory',
  description: 'Explore Korean universities by location and study pathway, with official international admissions links and source-led guidance.',
  alternates: { canonical: '/universities' },
}

export default function UniversitiesRoute() {
  return <UniversitiesPage />
}
