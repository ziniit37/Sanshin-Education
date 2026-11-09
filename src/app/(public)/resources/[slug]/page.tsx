import type { Metadata } from 'next'
import { ResourceDetailPage } from '@/views/CatalogPages'
import { getStudyResource } from '@/lib/study-resources'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resource = getStudyResource(slug)
  return {
    title: resource?.title ?? 'South Korea Study Guide',
    description: resource?.excerpt ?? 'Read practical, source-linked guidance for international students researching study in South Korea.',
    alternates: { canonical: `/resources/${slug}` },
  }
}

export default function ResourceDetailRoute() {
  return <ResourceDetailPage />
}
