import type { Metadata } from 'next'
import { GuidancePage } from '@/views/GuidancePages'

export const metadata: Metadata = {
  title: 'Student Life in South Korea',
  description: 'Prepare for housing, transport, language learning, campus communities, and everyday life as a student in South Korea.',
}

export default function StudentLifePage() {
  return <GuidancePage page="life" />
}
