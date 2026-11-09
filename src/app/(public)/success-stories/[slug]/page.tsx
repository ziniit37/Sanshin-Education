import type { Metadata } from 'next'
import { SuccessStoryDetailPage } from '@/views/CatalogPages'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return {
    title: 'Student Experience',
    description: 'Read a student experience about study in South Korea, when an authorized story is available.',
    alternates: { canonical: `/success-stories/${slug}` },
  }
}

export default function SuccessStoryDetailRoute() {
  return <SuccessStoryDetailPage />
}
