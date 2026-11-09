import type { Metadata } from 'next'
import { ScholarshipDetailPage } from '@/views/CatalogPages'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = slug === 'global-korea-scholarship'
    ? 'Global Korea Scholarship (GKS)'
    : 'Korean University Scholarship Information'
  return {
    title,
    description: 'Review Korean government and university scholarship information, then confirm current eligibility, benefits, and application dates with official providers.',
    alternates: { canonical: `/scholarships/${slug}` },
  }
}

export default function ScholarshipDetailRoute() {
  return <ScholarshipDetailPage />
}
