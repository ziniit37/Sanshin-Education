import type { Metadata } from 'next'
import { AboutPage } from '@/views/CatalogPages'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sanshin Global Education’s Korea-focused study guidance and approach to international university admissions.',
  alternates: { canonical: '/about' },
}

export default function AboutRoute() {
  return <AboutPage />
}
