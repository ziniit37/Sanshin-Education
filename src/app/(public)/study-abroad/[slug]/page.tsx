import type { Metadata } from 'next'
import { CountryDetailPage } from '@/views/StudyAbroad'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replaceAll('-', ' ')} Study Information`,
    description: 'Review South Korea study information and verify current program, admissions, and visa details with official sources.',
    alternates: { canonical: `/study-abroad/${slug}` },
  }
}

export default function CountryDetailRoute() {
  return <CountryDetailPage />
}
