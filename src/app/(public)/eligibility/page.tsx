import type { Metadata } from 'next'
import { EligibilityPage } from '@/views/MiscPages'

export const metadata: Metadata = {
  title: 'Study in Korea Eligibility Planning',
  description: 'Share your academic background and study interests to explore Korean education pathways; guidance is not an admissions decision.',
  alternates: { canonical: '/eligibility' },
}

export default function EligibilityRoute() {
  return <EligibilityPage />
}
