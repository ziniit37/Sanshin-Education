import type { Metadata } from 'next'
import { HomePage } from '@/views/Home'

export const metadata: Metadata = {
  title: 'Study in South Korea',
  description: 'Explore Korean universities, scholarships, language programs, transfer routes, and verified admissions guidance for international students.',
  alternates: { canonical: '/' },
}

export default function HomeRoute() {
  return <HomePage />
}
