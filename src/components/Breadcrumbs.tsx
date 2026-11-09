'use client'

import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Link } from '@/lib/navigation'

const labels: Record<string, string> = {
  admissions: 'Admissions',
  intakes: 'Intakes',
  'how-to-apply': 'How to apply',
  transfer: 'Transfer admissions',
  graduate: 'Graduate admissions',
  programs: 'Programs',
  'korean-language': 'Korean language programs',
  universities: 'Universities',
  scholarships: 'Scholarships',
  resources: 'Resources',
  'study-in-korea': 'Study in Korea',
  costs: 'Costs and budgeting',
  'study-pathways': 'Study pathways',
  'visa-guide': 'Student visa guide',
  'visa-guidance': 'Student visa guide',
  'cost-of-living': 'Costs and budgeting',
  contact: 'Contact',
  'book-consultation': 'Book a consultation',
  'student-life': 'Student life',
  services: 'Services',
  about: 'About',
  faq: 'FAQ',
  eligibility: 'Eligibility',
  privacy: 'Privacy',
  terms: 'Terms',
  'study-abroad': 'Study abroad',
  'success-stories': 'Student stories',
}

function readableSegment(segment: string) {
  return labels[segment] ?? segment.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0 || segments[0] === 'admin' || segments[0] === 'portal') return null

  return (
    <nav aria-label="Breadcrumb" className="container py-3">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <li><Link className="transition hover:text-foreground" to="/">Home</Link></li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const current = index === segments.length - 1
          return (
            <li key={href} className="inline-flex items-center gap-1">
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              {current
                ? <span aria-current="page" className="font-medium text-foreground">{readableSegment(segment)}</span>
                : <Link className="transition hover:text-foreground" to={href}>{readableSegment(segment)}</Link>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
