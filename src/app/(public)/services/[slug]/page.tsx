import type { Metadata } from 'next'
import { ServiceDetailPage } from '@/views/CatalogPages'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  return {
    title: `${title} Support`,
    description: 'Review Korea study support options and confirm current requirements with the relevant university and authorities.',
    alternates: { canonical: `/services/${slug}` },
  }
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />
}
