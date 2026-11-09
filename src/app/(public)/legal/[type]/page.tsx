import type { Metadata } from 'next'
import { LegalPage } from '@/views/MiscPages'

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  const isTerms = type === 'terms'
  return {
    title: isTerms ? 'Terms of Service' : 'Privacy Policy',
    description: isTerms
      ? 'Review terms and limitations for general information and study guidance published by Sanshin Global Education.'
      : 'Read privacy information for inquiries submitted to Sanshin Global Education.',
    alternates: { canonical: `/legal/${type}` },
  }
}

export default function LegalRoute() {
  return <LegalPage />
}
