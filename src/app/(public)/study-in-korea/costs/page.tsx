import type { Metadata } from 'next'
import { StudyBudgetPage } from '@/views/ExpandedGuidancePages'

export const metadata: Metadata = {
  title: 'Study in Korea Costs and Budget Estimator',
  description: 'Plan a South Korea study budget with official tuition averages and customizable living-cost assumptions.',
  alternates: { canonical: '/study-in-korea/costs' },
}

export default function StudyCostsRoute() {
  return <StudyBudgetPage />
}
