import type { Metadata } from 'next'
import { KoreanLanguageProgramsPage } from '@/views/AdmissionsPages'

export const metadata: Metadata = {
  title: 'Korean Language Programs in South Korea',
  description: 'Compare university-affiliated Korean language institutes, review verified 2027 examples, and understand the language-to-degree pathway.',
  alternates: { canonical: '/programs/korean-language' },
}

export default function Page() {
  return <KoreanLanguageProgramsPage />
}
