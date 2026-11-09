import { ArrowRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/lib/navigation'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type GuideSection = {
  title: string
  description: string
  points: string[]
}

const guides: Record<string, { kicker: string; title: string; description: string; sections: GuideSection[] }> = {
  study: {
    kicker: 'Study destination',
    title: 'Study in South Korea',
    description: 'Explore education pathways, admissions planning, funding, and the practical questions to research before you apply.',
    sections: [
      {
        title: 'Choose a study pathway',
        description: 'Your goals, current education, language skills, and preferred subject can help narrow the options.',
        points: [
          'Korean-language programs are one pathway for students building language proficiency.',
          'Undergraduate and graduate degrees have institution- and program-specific admission requirements.',
          'Research programs may require a clear academic fit and additional documents.',
        ],
      },
      {
        title: 'Compare institutions and programs',
        description: 'Check the exact curriculum, language of instruction, campus, and admissions calendar for each program.',
        points: [
          'Confirm that the program is open to international applicants.',
          'Review current tuition and other costs on the university’s official site.',
          'Ask the admissions office about requirements that are unclear or not listed.',
        ],
      },
      {
        title: 'Plan for funding and daily life',
        description: 'Scholarships and living expenses depend on the institution, city, eligibility, and personal circumstances.',
        points: [
          'Research government and university scholarships separately.',
          'Plan for housing, food, transport, insurance, and initial setup expenses.',
          'Build time for language learning and practical preparation before departure.',
        ],
      },
    ],
  },
  admissions: {
    kicker: 'Application planning',
    title: 'Korean university admissions',
    description: 'A practical framework for researching programs and preparing an application. Requirements and dates are set by each institution.',
    sections: [
      {
        title: '1. Confirm eligibility and program fit',
        description: 'Start with the program’s official international admissions page and read the entry criteria carefully.',
        points: ['Check academic prerequisites and eligible applicant categories.', 'Confirm the language of instruction and accepted language tests.', 'Review program structure, campus, and application route.'],
      },
      {
        title: '2. Build a document checklist',
        description: 'The exact checklist varies. These are examples of documents institutions may request.',
        points: ['Academic transcripts and graduation certificates.', 'Personal statement, study plan, or research proposal.', 'Language test results, recommendations, and identity documents.', 'Translations, notarization, or apostilles where specified.'],
      },
      {
        title: '3. Submit and follow up',
        description: 'Use only the current instructions from the university, and keep copies of submitted materials.',
        points: ['Work backward from the official deadline and allow time for document processing.', 'Check whether the application includes an interview, portfolio, or additional assessment.', 'Ask the admissions office how and when decisions will be communicated.'],
      },
    ],
  },
  visa: {
    kicker: 'After admission',
    title: 'Student visa guidance',
    description: 'Understand the broad study-visa categories and where to verify current application requirements. This page is general information, not immigration advice.',
    sections: [
      {
        title: 'D-2 degree study',
        description: 'D-2 status is generally associated with eligible degree-level study. The appropriate category and documentation depend on the course and applicant.',
        points: ['Follow the instructions provided by your admitting institution.', 'Confirm required forms, proof of funds, and supporting evidence with the Korean embassy or consulate serving your location.', 'Check whether documents need translation, certification, or recent issue dates.'],
      },
      {
        title: 'D-4 language or training study',
        description: 'D-4 categories cover certain non-degree training programs, including some language study. Confirm the correct category with the school and immigration authorities.',
        points: ['Verify that the school and specific course qualify for the status you are seeking.', 'Do not assume that D-2 and D-4 requirements or work conditions are the same.', 'Review the latest rules before making travel or employment plans.'],
      },
      {
        title: 'Use official, current instructions',
        description: 'Visa requirements can depend on nationality, location, program, and current policy. An admission offer does not guarantee visa approval.',
        points: ['Check the Korean immigration and embassy guidance current to your application date.', 'Contact the relevant authority if your circumstances are unusual.', 'The final decision belongs to the responsible government authority.'],
      },
    ],
  },
  life: {
    kicker: 'Living and learning',
    title: 'Student life in South Korea',
    description: 'Prepare for everyday life alongside your academic plans. Your experience will differ by city, campus, housing, and personal circumstances.',
    sections: [
      {
        title: 'Housing and arrival',
        description: 'Compare university residences and private housing early, and understand the terms before paying a deposit.',
        points: ['Ask your university about dormitory application dates and eligibility.', 'Check commute time, deposit requirements, utilities, and contract terms.', 'Keep copies of important documents and arrival instructions.'],
      },
      {
        title: 'Getting around and settling in',
        description: 'Learn the local transport options for your campus and identify essential services before classes begin.',
        points: ['Research transit routes and payment methods for your city.', 'Ask the university about orientation, student support, and health coverage.', 'Save emergency and university contact information in an accessible place.'],
      },
      {
        title: 'Language and community',
        description: 'Language practice and campus communities can make it easier to navigate daily routines and meet people.',
        points: ['Explore language classes and conversation groups.', 'Check clubs, student associations, and international student support.', 'Learn local expectations while making room for a gradual adjustment.'],
      },
    ],
  },
  cost: {
    kicker: 'Financial planning',
    title: 'Cost of living in South Korea',
    description: 'Build a personal budget from current university and official information. Costs change over time and vary by city, housing, and lifestyle.',
    sections: [
      {
        title: 'Budget categories to include',
        description: 'Separate recurring monthly expenses from one-time costs so you can plan for both regular spending and arrival.',
        points: ['Tuition and mandatory university fees.', 'Housing, utilities, meals, and local transportation.', 'Health coverage, books, phone service, and personal expenses.', 'Travel, deposits, and other one-time setup costs.'],
      },
      {
        title: 'Find current figures',
        description: 'Use institution-specific and current references rather than relying on a single national estimate.',
        points: ['Check the university’s published tuition and housing information.', 'Ask the international office for student budget guidance for the current year.', 'Confirm any minimum financial evidence required for your visa application.', 'Record the source and date for each estimate in your budget.'],
      },
      {
        title: 'Plan for uncertainty',
        description: 'Your actual costs may differ from estimates, especially when housing or exchange rates change.',
        points: ['Compare more than one housing option.', 'Include a contingency for unexpected costs.', 'Recheck costs before accepting an offer or submitting visa documents.'],
      },
    ],
  },
}

const officialLinks = [
  { label: 'Study in Korea — official government information', href: 'https://www.studyinkorea.go.kr/' },
  { label: 'Korea Immigration Service — official immigration information', href: 'https://www.immigration.go.kr/immigration_eng/index.do' },
]

export function GuidancePage({ page }: { page: keyof typeof guides }) {
  const guide = guides[page]
  return (
    <div>
      <PageHeader kicker={guide.kicker} title={guide.title} description={guide.description} />
      {page === 'admissions' ? (
        <section className="container grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Admissions resources">
          {[
            ['2027 intake calendar', 'Compare published university application windows.', '/admissions/intakes'],
            ['How to apply', 'Follow the steps from choosing a route to enrollment.', '/admissions/how-to-apply'],
            ['Transfer admissions', 'Understand transfer, major changes, and credit review.', '/admissions/transfer'],
            ['Graduate study', 'Plan a master’s, doctoral, or research application.', '/admissions/graduate'],
          ].map(([title, description, href]) => (
            <Link key={href} to={href} className="rounded-xl border bg-card p-4 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <h2 className="font-heading font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </Link>
          ))}
        </section>
      ) : null}
      {page === 'life' ? (
        <div className="container relative mt-10 h-64 overflow-hidden rounded-2xl md:h-96">
          <Image
            src="/images/seoul-skyline.jpg"
            alt="Seoul city skyline in South Korea"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="container grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          {guide.sections.map((section) => (
            <Card key={section.title} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {section.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
          <div className="rounded-2xl bg-muted/50 p-5 text-sm leading-relaxed text-muted-foreground">
            Information can change. Confirm program, scholarship, cost, and immigration details with the official source
            relevant to your circumstances before making a decision.
          </div>
        </div>
        <aside className="space-y-5">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-lg">Official references</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {officialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 text-sm text-accent underline underline-offset-2"
                >
                  {item.label}<ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl bg-primary text-primary-foreground">
            <CardHeader><CardTitle className="text-lg">Want help planning?</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/80">Share your goals and explore your next steps with Sanshin Global Education.</p>
              <Button asChild variant="gold" className="mt-4 w-full">
                <Link to="/book-consultation">Request a consultation <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
