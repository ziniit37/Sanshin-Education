import type { Metadata } from 'next'
import { ProgramDetailPage } from '@/views/CatalogPages'
import { PROGRAM_DIRECTORY } from '@/lib/university-directory'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = PROGRAM_DIRECTORY.find((entry) => entry.slug === slug)
  return {
    title: program ? `${program.name} at a Korean University` : 'Study Programs in South Korea',
    description: program
      ? `Review ${program.name} at its official university source and confirm current international admissions, language, and tuition requirements.`
      : 'Explore Korean academic programs and verify current program details with the official university.',
    alternates: { canonical: `/programs/${slug}` },
  }
}

export default function ProgramDetailRoute() {
  return <ProgramDetailPage />
}
