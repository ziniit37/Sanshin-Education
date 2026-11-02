import type { Metadata } from 'next'
import { GuidancePage } from '@/views/GuidancePages'

export const metadata: Metadata = {
  title: 'Student Visa Guidance',
  description: 'General information about D-2 degree study and D-4 training pathways, with links to official Korean immigration resources.',
}

export default function VisaGuidancePage() {
  return <GuidancePage page="visa" />
}
