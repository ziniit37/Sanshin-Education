import type { Metadata } from 'next'
import { StudyBudgetPage } from '@/views/ExpandedGuidancePages'

export const metadata: Metadata = {
  title: 'Tuition and Student Budget in South Korea',
  description: 'Estimate Korean study costs using official tuition averages and your own housing, food, transport, insurance, and setup-cost assumptions.',
  alternates: { canonical: '/study-in-korea/costs' },
}

export default function CostOfLivingPage() {
  return <StudyBudgetPage />
}
