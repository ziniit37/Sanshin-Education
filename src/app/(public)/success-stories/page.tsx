import type { Metadata } from 'next'
import { SuccessStoriesPage } from '@/views/CatalogPages'

export const metadata: Metadata = {
  title: 'Student Stories and Experiences',
  description: 'Learn about Sanshin Global Education’s approach to sharing student experiences with permission and without invented testimonials.',
  alternates: { canonical: '/success-stories' },
}

export default function SuccessStoriesRoute() {
  return <SuccessStoriesPage />
}
