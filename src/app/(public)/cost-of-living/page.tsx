import type { Metadata } from 'next'
import { GuidancePage } from '@/views/GuidancePages'

export const metadata: Metadata = {
  title: 'Cost of Living in South Korea',
  description: 'Plan a student budget with current tuition, housing, food, transport, and setup costs from university and official sources.',
}

export default function CostOfLivingPage() {
  return <GuidancePage page="cost" />
}
