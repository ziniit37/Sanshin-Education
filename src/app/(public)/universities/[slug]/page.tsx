import type { Metadata } from 'next'
import { UniversityDetailPage } from '@/views/CatalogPages'
import { UNIVERSITY_DIRECTORY } from '@/lib/university-directory'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const university = UNIVERSITY_DIRECTORY.find((entry) => entry.slug === slug)
  return {
    title: university ? `${university.name} Admissions and Study Options` : 'Korean University Profile',
    description: university
      ? `Explore study pathways at ${university.name} in ${university.city}, then verify current admissions, language, tuition, and scholarship details with official sources.`
      : 'Review a Korean university profile and follow the institution’s official international admissions information.',
    alternates: { canonical: `/universities/${slug}` },
  }
}

export default function UniversityProfileRoute() {
  return <UniversityDetailPage />
}
