'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, CalendarDays, ExternalLink, GraduationCap, Languages } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { PageHeader } from '@/components/PageHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ADMISSION_CYCLES,
  formatKoreanDate,
  getAdmissionStatus,
  getTimeInKorea,
  getTodayInKorea,
  type AdmissionCycle,
  type AdmissionStatus,
} from '@/lib/admissions-data'

const officialLinks = {
  studyInKorea: 'https://www.studyinkorea.go.kr/',
  topik: 'https://www.topik.go.kr/',
  visa: 'https://www.studyinkorea.go.kr/ko/plan/visaAndStay.do',
  hiKorea: 'https://www.hikorea.go.kr/',
  immigration: 'https://www.immigration.go.kr/',
}

function OfficialLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-medium text-accent underline underline-offset-4 hover:text-accent/80"
    >
      {children}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

function StatusBadge({ status }: { status: AdmissionStatus }) {
  const colors: Record<AdmissionStatus, string> = {
    Open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
    Closed: 'bg-muted text-muted-foreground',
    'To Be Announced': 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}>{status}</span>
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const id = `admissions-filter-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="all">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  )
}

function AdmissionCycleCard({ cycle, today, time }: { cycle: AdmissionCycle; today: string | null; time: string | null }) {
  const status = today && time ? getAdmissionStatus(cycle, today, time) : null
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent" aria-hidden="true" />
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {cycle.academicYear} {cycle.intake} · {cycle.studyLevel}
            </p>
            <CardTitle className="mt-1 text-lg">{cycle.university}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{cycle.location} · {cycle.admissionRoute}</p>
          </div>
          {status ? <StatusBadge status={status} /> : <span className="text-xs text-muted-foreground">Checking KST date…</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Application window</dt>
            <dd className="mt-0.5 font-medium">
              {cycle.applicationOpens
                ? `${formatKoreanDate(cycle.applicationOpens)} – ${formatKoreanDate(cycle.applicationCloses)}`
                : 'To Be Announced'}
            </dd>
            {cycle.deadlineTime ? <dd className="text-xs text-muted-foreground">Deadline: {cycle.deadlineTime}</dd> : null}
          </div>
          <div><dt className="text-xs text-muted-foreground">Language of instruction</dt><dd className="mt-0.5">{cycle.language}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Field / subject</dt><dd className="mt-0.5">{cycle.subject}</dd></div>
          {cycle.documentDeadline ? <div><dt className="text-xs text-muted-foreground">Document deadline</dt><dd className="mt-0.5">{cycle.documentDeadline}</dd></div> : null}
          {cycle.interviews ? <div><dt className="text-xs text-muted-foreground">Interview</dt><dd className="mt-0.5">{cycle.interviews}</dd></div> : null}
          {cycle.results ? <div><dt className="text-xs text-muted-foreground">Result notification</dt><dd className="mt-0.5">{cycle.results}</dd></div> : null}
          {cycle.enrollment ? <div><dt className="text-xs text-muted-foreground">Enrollment / tuition</dt><dd className="mt-0.5">{cycle.enrollment}</dd></div> : null}
        </dl>
        {cycle.tentative ? (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
            Tentative schedule; the university says dates are subject to change.
          </p>
        ) : null}
        {cycle.notes ? <p className="text-sm leading-relaxed text-muted-foreground">{cycle.notes}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
          <span>Last checked: {formatKoreanDate(cycle.lastVerified)} · Dates shown in KST where specified</span>
          <OfficialLink href={cycle.officialUrl}>Official source and application details</OfficialLink>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdmissionsIntakesPage() {
  const [today, setToday] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [timelineMonth, setTimelineMonth] = useState('all')
  const [filters, setFilters] = useState({
    year: 'all',
    intake: 'all',
    university: 'all',
    level: 'all',
    route: 'all',
    language: 'all',
    status: 'all',
    location: 'all',
    subject: 'all',
  })

  useEffect(() => {
    const refreshKoreaTime = () => {
      setToday(getTodayInKorea())
      setTime(getTimeInKorea())
    }
    refreshKoreaTime()
    const intervalId = window.setInterval(refreshKoreaTime, 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  const options = useMemo(() => ({
    year: [...new Set(ADMISSION_CYCLES.map((cycle) => String(cycle.academicYear)))],
    university: [...new Set(ADMISSION_CYCLES.map((cycle) => cycle.university))],
    level: [...new Set(ADMISSION_CYCLES.map((cycle) => cycle.studyLevel))],
    route: [...new Set(ADMISSION_CYCLES.map((cycle) => cycle.admissionRoute))],
    language: [...new Set(ADMISSION_CYCLES.map((cycle) => cycle.language))],
    location: [...new Set(ADMISSION_CYCLES.map((cycle) => cycle.location))],
    subject: [...new Set(ADMISSION_CYCLES.map((cycle) => cycle.subject))],
  }), [])
  const timelineMonths = useMemo(() => [...new Set(ADMISSION_CYCLES.flatMap((cycle) => (
    [cycle.applicationOpens, cycle.applicationCloses]
      .filter((date): date is string => date !== null)
      .map((date) => date.slice(0, 7))
  )))].sort(), [])

  const filtered = ADMISSION_CYCLES.filter((cycle) => (
    (filters.year === 'all' || String(cycle.academicYear) === filters.year)
    && (filters.intake === 'all' || cycle.intake === filters.intake)
    && (filters.university === 'all' || cycle.university === filters.university)
    && (filters.level === 'all' || cycle.studyLevel === filters.level)
    && (filters.route === 'all' || cycle.admissionRoute === filters.route)
    && (filters.language === 'all' || cycle.language === filters.language)
    && (filters.location === 'all' || cycle.location === filters.location)
    && (filters.subject === 'all' || cycle.subject === filters.subject)
    && (filters.status === 'all' || (today !== null && time !== null && getAdmissionStatus(cycle, today, time) === filters.status))
  )).sort((a, b) => (a.applicationOpens ?? '9999').localeCompare(b.applicationOpens ?? '9999'))
  const timelineFiltered = timelineMonth === 'all'
    ? filtered
    : filtered.filter((cycle) => cycle.applicationOpens?.startsWith(timelineMonth) || cycle.applicationCloses?.startsWith(timelineMonth))
  const formatTimelineMonth = (month: string) => new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${month}-01T00:00:00Z`))
  const timelineCount = (month: string) => filtered.filter((cycle) => (
    cycle.applicationOpens?.startsWith(month) || cycle.applicationCloses?.startsWith(month)
  )).length

  const setFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const statusOptions = ['Open', 'Upcoming', 'Closed', 'To Be Announced']

  return (
    <div>
      <PageHeader
        kicker="Admissions planning"
        title="Korean university intakes and application calendar"
        description="Compare verified university application windows and follow the official source for current instructions. Dates differ by institution, program, and applicant route."
      />
      <div className="container space-y-12 py-10 md:py-14">
        <section className="grid gap-5 md:grid-cols-3" aria-label="Typical Korean study intakes">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CalendarDays className="h-5 w-5 text-accent" /> Spring semester</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">The university semester typically begins in March. Applications often open in the preceding year, but each university sets its own rounds and deadlines.</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CalendarDays className="h-5 w-5 text-accent" /> Fall semester</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">The second major semester typically begins in September. Many applications take place in spring, but dates and availability vary by program.</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Languages className="h-5 w-5 text-accent" /> Korean language terms</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">Language institutes may offer March, June, September, and December terms. These are separate from degree admissions and have their own calendars.</CardContent></Card>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-bold">2027 verified examples</h2>
              <p className="mt-1 text-sm text-muted-foreground">Status is calculated from each application window using the current date in Korea.</p>
            </div>
            <p className="text-xs text-muted-foreground">Reference date: November 9, 2026</p>
          </div>
          <div className="mb-6 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectFilter label="Year" value={filters.year} options={options.year} onChange={(value) => setFilter('year', value)} />
            <SelectFilter label="Intake" value={filters.intake} options={['Spring', 'Fall']} onChange={(value) => setFilter('intake', value)} />
            <SelectFilter label="University" value={filters.university} options={options.university} onChange={(value) => setFilter('university', value)} />
            <SelectFilter label="Degree level" value={filters.level} options={options.level} onChange={(value) => setFilter('level', value)} />
            <SelectFilter label="Admission route" value={filters.route} options={options.route} onChange={(value) => setFilter('route', value)} />
            <SelectFilter label="Language" value={filters.language} options={options.language} onChange={(value) => setFilter('language', value)} />
            <SelectFilter label="Status" value={filters.status} options={statusOptions} onChange={(value) => setFilter('status', value)} />
            <SelectFilter label="Location" value={filters.location} options={options.location} onChange={(value) => setFilter('location', value)} />
            <SelectFilter label="Subject" value={filters.subject} options={options.subject} onChange={(value) => setFilter('subject', value)} />
          </div>
          <div className="mb-6 rounded-xl border bg-muted/30 p-4">
            <h3 className="mb-3 text-sm font-semibold">Application timeline · select a month</h3>
            <div className="flex snap-x gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter application cards by month">
              <button
                type="button"
                aria-pressed={timelineMonth === 'all'}
                onClick={() => setTimelineMonth('all')}
                className={`min-w-24 snap-start rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${timelineMonth === 'all' ? 'border-accent bg-accent/10 text-accent' : 'bg-background'}`}
              >
                All months
                <span className="mt-1 block text-xs text-muted-foreground">{filtered.length} schedules</span>
              </button>
              {timelineMonths.map((month) => (
                <button
                  key={month}
                  type="button"
                  aria-pressed={timelineMonth === month}
                  onClick={() => setTimelineMonth(month)}
                  className={`min-w-28 snap-start rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${timelineMonth === month ? 'border-accent bg-accent/10 text-accent' : 'bg-background'}`}
                >
                  {formatTimelineMonth(month)}
                  <span className="mt-1 block text-xs text-muted-foreground">{timelineCount(month)} schedules</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative space-y-5 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-border">
            {timelineFiltered.map((cycle) => (
              <div key={cycle.id} className="relative pl-7">
                <span className="absolute left-0 top-5 h-4 w-4 rounded-full border-4 border-background bg-accent" aria-hidden="true" />
                <AdmissionCycleCard cycle={cycle} today={today} time={time} />
              </div>
            ))}
            {timelineFiltered.length === 0 ? <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No schedules match these filters.</p> : null}
          </div>
        </section>

        <div className="rounded-2xl bg-muted/60 p-6 md:p-8">
          <h2 className="font-heading text-xl font-bold">Treat dates as program-specific</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            These examples are not a complete list of Korean admissions. Deadlines can change, and an online application may have a separate document or payment deadline. Confirm the current admissions guide and time zone with the university before submitting.
          </p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <OfficialLink href={officialLinks.studyInKorea}>Study in Korea</OfficialLink>
            <Link className="font-medium text-accent underline underline-offset-4" to="/admissions/how-to-apply">How to apply</Link>
            <Link className="font-medium text-accent underline underline-offset-4" to="/admissions/transfer">Transfer admissions</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const applicationSteps = [
  {
    title: 'Choose the right admission route',
    text: 'Identify whether you are applying as a new undergraduate, transfer applicant, graduate student, language learner, exchange student, or visiting student. These routes have different eligibility and documents.',
    details: ['Read the international admissions guide for the specific university and program.', 'Check whether eligibility depends on your nationality, prior education, or both.', 'Ask the admissions office when the route is unclear.'],
  },
  {
    title: 'Check academic eligibility',
    text: 'Undergraduate applicants usually need recognized secondary-school completion. Master’s applicants generally need a bachelor’s degree; doctoral applicants generally need a master’s degree or an accepted equivalent route.',
    details: ['Transfer applicants may need a specified number of semesters, credits, or an associate degree.', 'Some institutions allow expected graduates to apply, but require final credentials by a separate deadline.', 'Prerequisites and recognized qualifications differ by institution and department.'],
  },
  {
    title: 'Review language requirements',
    text: 'Korean-taught programs may ask for TOPIK or another form of Korean-language evidence. English-taught programs may accept IELTS, TOEFL, or other evidence listed by that program.',
    details: ['Requirements can differ by department and degree level.', 'Some programs offer conditional language routes; availability is university-specific.', 'Check both admission requirements and language conditions for graduation.'],
  },
  {
    title: 'Prepare and authenticate documents',
    text: 'Build a checklist from the current admissions guide before requesting records. Authentication requirements depend on the issuing country and the institution.',
    details: ['Passport, application form, academic certificates, transcripts, and graduation or expected-graduation evidence.', 'Personal statement or study plan, recommendations, language evidence, portfolio, or research proposal when required.', 'Nationality, family relationship, and financial documents when required.', 'Confirm whether certified translations, apostilles, consular confirmation, originals, or mailed copies are required.'],
  },
  {
    title: 'Submit every part of the application',
    text: 'Use the official admissions portal, complete its online fields, upload documents, and pay the fee as instructed. Online submission alone may not complete the application.',
    details: ['Check the deadline in Korea Standard Time (KST).', 'Confirm whether original documents must arrive by post.', 'Keep payment receipts and application confirmation.', 'Recheck the portal for missing documents or follow-up requests.'],
  },
  {
    title: 'Prepare for evaluation',
    text: 'Universities may review academic records, language proficiency, statements, portfolios, interviews, or research fit. Do not rely on unofficial predictions of admission probability.',
    details: ['Check the interview format and schedule if an interview is listed.', 'Graduate applicants should follow department guidance about research interests and faculty contact.', 'Monitor the official portal and email for updates.'],
  },
  {
    title: 'Review the result and enrollment steps',
    text: 'Read the decision notice carefully. Conditional admission, scholarship selection, and final enrollment may have separate conditions and deadlines.',
    details: ['Confirm tuition invoices, deposits, and enrollment confirmation deadlines.', 'Check scholarship terms and whether funding is confirmed for your program.', 'Submit final graduation evidence if it is required after admission.'],
  },
  {
    title: 'Plan visa and arrival preparation',
    text: 'After admission, follow the university’s visa document instructions and check the relevant Korean embassy or immigration authority for your circumstances.',
    details: ['Review the appropriate D-2 or D-4 process with official authorities.', 'Plan housing, orientation, insurance, travel, and initial living expenses.', 'Admission does not guarantee visa approval.'],
  },
]

export function HowToApplyPage() {
  return (
    <div>
      <PageHeader kicker="Admissions guide" title="How to apply to a Korean university" description="A practical application journey for international students. Eligibility, documents, language rules, and deadlines must be confirmed in each university’s current official guide." />
      <div className="container max-w-4xl py-10 md:py-14">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="pt-6"><GraduationCap className="mb-3 h-6 w-6 text-accent" /><h2 className="font-semibold">New undergraduate</h2><p className="mt-1 text-sm text-muted-foreground">For students seeking a first bachelor’s degree.</p></CardContent></Card>
          <Card><CardContent className="pt-6"><GraduationCap className="mb-3 h-6 w-6 text-accent" /><h2 className="font-semibold">Transfer</h2><p className="mt-1 text-sm text-muted-foreground">For eligible applicants with previous university study.</p></CardContent></Card>
          <Card><CardContent className="pt-6"><GraduationCap className="mb-3 h-6 w-6 text-accent" /><h2 className="font-semibold">Graduate / language</h2><p className="mt-1 text-sm text-muted-foreground">For master’s, doctoral, research, or non-degree language study.</p></CardContent></Card>
        </div>
        <Accordion type="single" collapsible className="border-t">
          {applicationSteps.map((step, index) => (
            <AccordionItem key={step.title} value={`step-${index + 1}`}>
              <AccordionTrigger><span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">{index + 1}</span><span className="text-left">{step.title}</span></AccordionTrigger>
              <AccordionContent>
                <p className="leading-relaxed">{step.text}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  {step.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="accent"><Link to="/admissions/intakes">Browse intake calendar <ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild variant="outline"><Link to="/book-consultation">Discuss your study plan</Link></Button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          General education information only, not an admission decision or legal advice. <OfficialLink href={officialLinks.studyInKorea}>Study in Korea official portal</OfficialLink>.
        </p>
      </div>
    </div>
  )
}

const transferRoutes = [
  {
    title: 'Transfer between universities (편입학)',
    description: 'Some Korean universities admit eligible applicants into an advanced year of an undergraduate degree based on prior university study or an associate degree. Transfer admission is not offered by every university.',
    points: ['Check required semesters, credits, previous institution recognition, academic record, and nationality category.', 'Departments may limit applicants or require a compatible prior major.', 'The receiving university decides the entry year and which prior credits, if any, are recognized.'],
  },
  {
    title: 'Internal change of major (전과)',
    description: 'This is a change of department within the Korean university where a student is already enrolled. It is separate from changing universities.',
    points: ['Rules can depend on completed semesters or credits, academic standing, available places, and department restrictions.', 'Approval may be required and is not guaranteed.', 'Double majors, minors, and interdisciplinary programs are different academic options.'],
  },
  {
    title: 'Language study to degree study',
    description: 'Applying to a degree after Korean-language training is generally a new degree application, not an undergraduate transfer based on language-course credits.',
    points: ['Language study may help with preparation but does not guarantee degree admission.', 'Applicants still need to meet the degree program’s academic and language requirements.', 'Check the applicable visa process with the university and immigration authorities.'],
  },
]

export function TransferAdmissionsPage() {
  const [education, setEducation] = useState('')
  const [country, setCountry] = useState('')
  const [currentUniversity, setCurrentUniversity] = useState('')
  const [semesters, setSemesters] = useState('')
  const [credits, setCredits] = useState('')
  const [currentMajor, setCurrentMajor] = useState('')
  const [desiredMajor, setDesiredMajor] = useState('')
  const [language, setLanguage] = useState('')
  const [intake, setIntake] = useState('')

  const routeMessage = education === 'korean-university'
    ? 'Research internal major-change rules at your current university, and separately check inter-university transfer admissions if you plan to change schools.'
    : education === 'university'
      ? 'Compare transfer requirements at each receiving university. Some may also offer freshman or exchange routes that could fit your situation.'
      : education === 'associate'
        ? 'Check whether the receiving university accepts associate-degree transfer applicants and how it evaluates credits.'
        : education
          ? 'Explore first-year undergraduate admission, language preparation, or a program route that matches your prior education.'
          : 'Select your current study situation to see a starting point for further research.'
  const profileDetails = [
    country.trim() ? `Country: ${country.trim()}` : '',
    currentUniversity.trim() ? `Current institution: ${currentUniversity.trim()}` : '',
    semesters.trim() ? `Completed semesters: ${semesters.trim()}` : '',
    credits.trim() ? `Credits earned: ${credits.trim()}` : '',
    currentMajor.trim() ? `Current major: ${currentMajor.trim()}` : '',
    desiredMajor.trim() ? `Desired major: ${desiredMajor.trim()}` : '',
    language.trim() ? `Language evidence: ${language.trim()}` : '',
    intake ? `Target intake: ${intake}` : '',
  ].filter(Boolean)

  return (
    <div>
      <PageHeader kicker="Undergraduate transfer" title="Explore transfer options in South Korea" description="University transfer, internal change of major, and moving from language study to a degree are different routes. Use this overview to identify what to verify." />
      <div className="container space-y-12 py-10 md:py-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {transferRoutes.map((route) => (
            <Card key={route.title}>
              <CardHeader><CardTitle className="text-lg">{route.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{route.description}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {route.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-accent">Interactive route explorer</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">What should you research next?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">This tool suggests research directions only. It does not determine eligibility or predict credit recognition.</p>
          </div>
          <Card className="min-w-0">
            <CardContent className="grid min-w-0 grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
              <label className="grid min-w-0 gap-1.5 text-sm">Current education
                <select value={education} onChange={(event) => setEducation(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3">
                  <option value="">Choose one</option><option value="high-school">High school graduate</option><option value="associate">Associate degree</option><option value="university">Currently at a university outside Korea</option><option value="korean-university">Currently at a Korean university</option><option value="language">Korean-language institute</option>
                </select>
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Current country of study
                <input value={country} onChange={(event) => setCountry(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" placeholder="Country" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Current university or college
                <input value={currentUniversity} onChange={(event) => setCurrentUniversity(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" placeholder="If applicable" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Completed university semesters
                <input inputMode="numeric" value={semesters} onChange={(event) => setSemesters(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" placeholder="If applicable" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Credits earned
                <input inputMode="numeric" value={credits} onChange={(event) => setCredits(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" placeholder="If known" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Current major
                <input value={currentMajor} onChange={(event) => setCurrentMajor(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Desired major
                <input value={desiredMajor} onChange={(event) => setDesiredMajor(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm">Language proficiency
                <input value={language} onChange={(event) => setLanguage(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3" placeholder="TOPIK / IELTS / TOEFL, if known" />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm sm:col-span-2">Target intake
                <select value={intake} onChange={(event) => setIntake(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border bg-background px-3">
                  <option value="">Not decided</option><option>March / Spring</option><option>September / Fall</option>
                </select>
              </label>
              <div aria-live="polite" className="rounded-lg bg-muted p-4 text-sm leading-relaxed sm:col-span-2">
                <p>{routeMessage}</p>
                {profileDetails.length ? <p className="mt-2 text-muted-foreground">Research notes: {profileDetails.join(' · ')}</p> : null}
              </div>
              <Button asChild variant="accent" className="sm:col-span-2"><Link to="/book-consultation">Explore my university transfer options <ArrowRight className="h-4 w-4" /></Link></Button>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl bg-muted/50 p-6 md:p-8">
          <h2 className="font-heading text-xl font-bold">Credit recognition is decided by the receiving university</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            A university may recognize some courses, require additional major courses, place a student in a particular year, or decline credit for previous study. Keep detailed transcripts and course descriptions, but do not assume that credits will transfer or that a degree can be completed in a fixed time.
          </p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <OfficialLink href="https://oia.korea.ac.kr/oia2026/Admission-Guide.do">Korea University international admission guide</OfficialLink>
            <OfficialLink href="https://adm-iu.postech.ac.kr/user/comm/menu/3317587a17a23d4dacdb9ffc4762bf4a/content/index.do">POSTECH undergraduate admissions</OfficialLink>
            <OfficialLink href="https://en.snu.ac.kr/academics/resources/double_major_minor">SNU major and minor policies</OfficialLink>
          </div>
        </section>
      </div>
    </div>
  )
}

const languageInstitutes = [
  { name: 'Yonsei University Korean Language Institute', location: 'Seoul', url: 'https://www.yskli.com/course.php?mid=E01_01', description: 'Regular Korean language program information and current term schedules.' },
  { name: 'Seoul National University Language Education Institute', location: 'Seoul', url: 'https://lei.snu.ac.kr/mobile/en/klec/regular/regular.jsp', description: 'Korean Language & Culture Program information.' },
  { name: 'Korea University Korean Language Center', location: 'Seoul', url: 'https://klc.korea.ac.kr/', description: 'Check the center’s official site for programs and application guidance.' },
  { name: 'Sogang University Korean Language Education Center', location: 'Seoul', url: 'https://klec.sogang.ac.kr/', description: 'Check the center’s official site for current course information.' },
  { name: 'Sungkyunkwan University language programs', location: 'Seoul / Suwon', url: 'https://koreansli.skku.edu/', description: 'Check the university’s language program site for current details.' },
  { name: 'Hanyang University language programs', location: 'Seoul / ERICA', url: 'https://iie.hanyang.ac.kr/?passedIntro=true&lang=eng', description: 'Hanyang Institute of International Education Korean Language Program; confirm campus-specific courses and schedules.' },
  { name: 'Kyung Hee University language programs', location: 'Seoul / Global Campus', url: 'https://iie.khu.ac.kr/', description: 'Check the institute site for program and campus information.' },
  { name: 'Pusan National University language programs', location: 'Busan', url: 'https://www.pusan.ac.kr/eng/Main.do', description: 'Start at the university’s official English site and confirm the current language institute information.' },
]

export function KoreanLanguageProgramsPage() {
  return (
    <div>
      <PageHeader kicker="Non-degree Korean study" title="Korean language programs in South Korea" description="University-affiliated language institutes provide structured Korean study. They are separate from degree programs and do not guarantee admission to a later degree." />
      <div className="container space-y-12 py-10 md:py-14">
        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold">What to expect from language study</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">Many regular programs use terms of about 10 weeks and around 20 class hours per week, with levels covering listening, speaking, reading, and writing. This is a general model, not a promise about any particular institute: term length, weekly hours, placement, activities, fees, and attendance rules are set by each school.</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">Some learners use language study to prepare for TOPIK or future university study. Studying at a university’s language center does not automatically grant degree admission, transfer credits, or a specific immigration status.</p>
          </div>
          <Card>
            <CardHeader><CardTitle>Language study to degree: an example route</CardTitle></CardHeader>
            <CardContent>
              <ol className="grid gap-3 text-sm sm:grid-cols-2">
                {['Choose a language institute', 'Build Korean proficiency', 'Check degree program requirements', 'Submit a separate degree application'].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{index + 1}</span>{step}</li>
                ))}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Language preparation may help, but admission and visa decisions remain subject to the relevant university and authorities.</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="font-heading text-2xl font-bold">University language institutes</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use each official institute site for current programs, tuition, application windows, and visa documents. Dates and fees are not inferred where the source has not been checked.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {languageInstitutes.map((institute) => (
              <Card key={institute.name}>
                <CardHeader><CardTitle className="text-lg">{institute.name}</CardTitle><p className="text-sm text-muted-foreground">{institute.location}</p></CardHeader>
                <CardContent><p className="mb-3 text-sm leading-relaxed text-muted-foreground">{institute.description}</p><OfficialLink href={institute.url}>Official institute information</OfficialLink></CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Verified 2027 examples</CardTitle></CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div>
                <h3 className="font-semibold">Yonsei KLI · Spring 2027</h3>
                <p className="mt-1 text-muted-foreground">Applications: December 7, 2026–January 15, 2027. Classes: March 5–May 20, 2027. Tuition: KRW 1,960,000 per term; application fee: KRW 130,000; textbooks not included.</p>
                <p className="mt-2"><OfficialLink href="https://www.yskli.com/course.php?mid=E01_01">Verify schedule and fees at Yonsei KLI</OfficialLink></p>
              </div>
              <div>
                <h3 className="font-semibold">SNU LEI · Spring 2027</h3>
                <p className="mt-1 text-muted-foreground">Application and document submission: November 2–December 24, 2026. Classes: March 8–May 14, 2027. Verify current fees and requirements directly with the institute.</p>
                <p className="mt-2"><OfficialLink href="https://lei.snu.ac.kr/mobile/en/klec/regular/regular.jsp">Verify schedule at SNU LEI</OfficialLink></p>
              </div>
              <div>
                <h3 className="font-semibold">SNU LEI · Other 2027 terms</h3>
                <p className="mt-1 text-muted-foreground">Published class dates include Summer: June 7–August 13; Fall: September 6–November 12; and Winter: December 6, 2027–February 11, 2028. Check the institute page for the application window and current requirements for each term.</p>
                <p className="mt-2"><OfficialLink href="https://lei.snu.ac.kr/mobile/en/klec/regular/regular.jsp">Verify all term dates at SNU LEI</OfficialLink></p>
              </div>
              <p className="border-t pt-3 text-xs text-muted-foreground">Examples checked November 9, 2026. Confirm live availability and KST deadlines before applying.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Typical application steps</CardTitle></CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>Select an institute and verify its current eligibility.</li>
                <li>Complete the official online application and submit required academic documents.</li>
                <li>Pay the application fee and complete any screening steps.</li>
                <li>Pay tuition when instructed and receive the institute’s registration documents.</li>
                <li>Check whether a visa is required and follow official immigration instructions.</li>
                <li>Complete placement testing and attend orientation.</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-2xl font-bold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="border-t">
            {[
              ['Can I enroll without knowing Korean?', 'Many beginner classes accept students with little or no prior Korean, but entry, placement, and available levels are set by each institute.'],
              ['Do I need IELTS to study Korean?', 'English test scores are not a universal language-institute requirement. Review the current application guide for the institute you choose.'],
              ['Can I join a language institute after high school?', 'Many institutes accept applicants who meet their current education and document requirements, but age, graduation evidence, and visa documentation rules can differ. Confirm directly with the institute and the responsible Korean mission.'],
              ['How many terms should I register for?', 'There is no universal number. Choose based on your current proficiency, study goal, institute rules, budget, and any visa conditions that apply to you.'],
              ['Can language study guarantee degree admission?', 'No. A degree application is separately evaluated against that degree program’s academic, language, and document requirements.'],
              ['Can I transfer between language institutes?', 'Do not assume that enrollment or tuition can be transferred. Ask both institutes about admission, withdrawal, refund, and immigration procedures before changing.'],
              ['What is the refund policy?', 'Refund amounts and deadlines are institute-specific. Read the current written refund policy before paying and contact the school about your individual circumstances.'],
              ['Can I change from D-4 to D-2?', 'A change of status or a new visa may be needed when moving from language training to degree study. It is not automatic; verify your case with the university and Korean immigration.'],
              ['Can I work part-time while studying Korean?', 'Do not assume work is allowed. Eligibility, waiting periods, permissions, and conditions depend on current immigration rules and the student’s circumstances. Check with Hi Korea or the immigration authority.'],
              ['How long should I study Korean before a degree?', 'There is no universal duration. It depends on your current proficiency and the target program’s Korean-language requirements. Confirm accepted evidence with each department.'],
            ].map(([question, answer], index) => (
              <AccordionItem key={question} value={`language-faq-${index}`}>
                <AccordionTrigger className="text-left">{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="flex flex-wrap gap-4 text-sm">
          <OfficialLink href={officialLinks.topik}>TOPIK official site</OfficialLink>
          <OfficialLink href={officialLinks.visa}>Study in Korea: visa and stay</OfficialLink>
          <OfficialLink href={officialLinks.hiKorea}>Hi Korea immigration portal</OfficialLink>
          <OfficialLink href={officialLinks.immigration}>Korea Immigration Service</OfficialLink>
        </div>
        <div className="rounded-2xl bg-accent p-6 text-accent-foreground md:flex md:items-center md:justify-between md:gap-6">
          <div><h2 className="font-heading text-xl font-bold">Learn Korean first, then explore degree admission.</h2><p className="mt-2 text-sm text-accent-foreground/80">Get help comparing institutes and planning the next step.</p></div>
          <Button asChild variant="secondary" className="mt-4 shrink-0 md:mt-0"><Link to="/book-consultation">Discuss your options</Link></Button>
        </div>
      </div>
    </div>
  )
}

export function GraduateAdmissionsPage() {
  const steps = [
    ['Choose a degree and program', 'Compare master’s, doctoral, integrated master’s–PhD, research-focused, and professional programs. Confirm that the program is currently offered and open to international applicants.'],
    ['Check academic prerequisites', 'Graduate programs commonly require a prior degree: a bachelor’s for master’s study and a master’s for doctoral study, subject to the university’s accepted equivalents and program rules. Review prerequisite subjects and transcript evaluation.'],
    ['Prepare your academic and research profile', 'Depending on the program, prepare a CV, research-interest statement, writing sample, portfolio, proposal, recommendations, and evidence of relevant experience. Follow the department’s checklist rather than assuming every item is required.'],
    ['Confirm language and supervisor expectations', 'Language evidence varies by program. Research-oriented departments may value faculty or laboratory fit; contacting a prospective supervisor is appropriate where the department recommends it, but is not a universal requirement.'],
    ['Apply and confirm funding', 'Submit through the official graduate admissions route. Scholarships, assistantships, laboratory funding, and fellowships have separate eligibility, selection, and award terms; admission does not guarantee funding.'],
    ['Plan enrollment and visa steps', 'After an offer, follow tuition, enrollment, and university visa-document instructions. Verify current immigration requirements with the relevant Korean authorities.'],
  ]
  return (
    <div>
      <PageHeader kicker="Graduate study" title="Master’s, doctoral, and research admissions in Korea" description="Plan your graduate application around the requirements of the exact department, degree, and research area." />
      <div className="container max-w-4xl space-y-10 py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="pt-6"><h2 className="font-heading font-bold">Master’s</h2><p className="mt-2 text-sm text-muted-foreground">Typically requires a bachelor’s degree or an accepted equivalent, with any program-specific prerequisites.</p></CardContent></Card>
          <Card><CardContent className="pt-6"><h2 className="font-heading font-bold">Doctoral</h2><p className="mt-2 text-sm text-muted-foreground">Typically requires a master’s degree or an accepted route, alongside department-specific academic preparation.</p></CardContent></Card>
          <Card><CardContent className="pt-6"><h2 className="font-heading font-bold">Research / integrated</h2><p className="mt-2 text-sm text-muted-foreground">May emphasize research fit, methods preparation, faculty resources, and a proposal or writing sample.</p></CardContent></Card>
        </div>
        <ol className="relative space-y-6 before:absolute before:bottom-5 before:left-4 before:top-5 before:w-px before:bg-border">
          {steps.map(([title, text], index) => (
            <li key={title} className="relative pl-12">
              <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{index + 1}</span>
              <h2 className="font-heading text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
        <div className="rounded-xl border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Research source:</strong> Always check the relevant university graduate school and department. For official university and government information, start with <OfficialLink href={officialLinks.studyInKorea}>Study in Korea</OfficialLink>. Admissions, funding, and visa rules can change; confirm them for the current intake.
        </div>
        <Button asChild variant="accent"><Link to="/book-consultation">Discuss graduate study options <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
    </div>
  )
}

export function StudyPathwaysPage() {
  const [educationLevel, setEducationLevel] = useState('Secondary-school graduate')
  const [enrollment, setEnrollment] = useState('Not currently enrolled')
  const [country, setCountry] = useState('')
  const [subject, setSubject] = useState('')
  const [studyGoal, setStudyGoal] = useState('Degree program')
  const [transferInterest, setTransferInterest] = useState('Not sure')
  const [koreanLevel, setKoreanLevel] = useState('Beginner / no Korean yet')
  const [englishLevel, setEnglishLevel] = useState('Not sure')
  const [intake, setIntake] = useState('Flexible')
  const [budget, setBudget] = useState('')

  const pathways = [
    {
      title: 'Bachelor’s degree',
      text: 'For applicants with secondary-school completion who want an undergraduate degree.',
      href: '/admissions/how-to-apply',
      duration: 'Often about four years; confirm the degree structure.',
      prerequisites: 'Recognized secondary-school completion and university-specific academic documents.',
      language: 'Korean or English evidence depends on the program and university.',
      intake: 'Often March or September; verify the exact program calendar.',
      visa: 'Check the applicable D-2 category and current mission instructions.',
      next: 'Compare freshman eligibility and current program notices.',
    },
    {
      title: 'Master’s degree',
      text: 'For bachelor’s graduates exploring advanced or professional study.',
      href: '/admissions/graduate',
      duration: 'Often about two years; varies by degree and department.',
      prerequisites: 'Bachelor’s degree or accepted equivalent, transcripts, and any program prerequisites.',
      language: 'Accepted tests, scores, and instruction language are program-specific.',
      intake: 'Often March or September; some programs differ.',
      visa: 'Confirm the relevant D-2 category with the university and Korean authorities.',
      next: 'Review the graduate school and department admissions guide.',
    },
    {
      title: 'PhD or research',
      text: 'For applicants with relevant academic preparation and research interests.',
      href: '/admissions/graduate',
      duration: 'Research- and program-specific.',
      prerequisites: 'Prior degree, academic record, and research preparation as specified by the department.',
      language: 'Department-specific; verify requirements for study and research.',
      intake: 'University and lab schedules vary.',
      visa: 'Confirm the applicable D-2 or other status with official authorities.',
      next: 'Compare research fit, faculty guidance, and the official graduate notice.',
    },
    {
      title: 'Korean language institute',
      text: 'For structured Korean learning and language preparation outside a degree program.',
      href: '/programs/korean-language',
      duration: 'Term-based; many regular terms are around 10 weeks, but institutes differ.',
      prerequisites: 'Institute-specific application, education, and document requirements.',
      language: 'Beginner entry may be available; placement and levels are set by the institute.',
      intake: 'Often multiple terms each year; check the current school calendar.',
      visa: 'Ask whether D-4-1 applies to the specific course and your situation.',
      next: 'Compare official institute schedules, tuition, and visa documents.',
    },
    {
      title: 'International university transfer',
      text: 'For applicants whose previous university study may fit a receiving university’s transfer route.',
      href: '/admissions/transfer',
      duration: 'Depends on accepted credits and the receiving university’s degree plan.',
      prerequisites: 'Prior study, credits, institution recognition, and major rules vary.',
      language: 'Check the target department’s accepted language evidence.',
      intake: 'May be March or September; transfer rounds are university-specific.',
      visa: 'Confirm student status and university instructions before changing institutions.',
      next: 'Ask the receiving university about eligibility and credit evaluation.',
    },
    {
      title: 'Internal change of major',
      text: 'For students already enrolled at a Korean university researching 전과 or other academic options.',
      href: '/admissions/transfer',
      duration: 'Depends on the university’s academic rules and remaining requirements.',
      prerequisites: 'May depend on completed terms, grades, open places, and department rules.',
      language: 'Follow the institution’s course and departmental requirements.',
      intake: 'Use the current internal academic calendar.',
      visa: 'Ask the university how a program change affects your status, if applicable.',
      next: 'Check your current university’s official academic regulations.',
    },
    {
      title: 'Associate degree or vocational study',
      text: 'For applicants exploring practice-oriented or associate-level programs.',
      href: '/admissions/how-to-apply',
      duration: 'Program-specific; verify the credential and length with the institution.',
      prerequisites: 'School and department requirements vary; check international applicant eligibility.',
      language: 'Instruction language and accepted evidence vary by course.',
      intake: 'Confirm with the college or university.',
      visa: 'Verify the exact program’s visa eligibility with the institution and authorities.',
      next: 'Search official college admissions information and program outcomes.',
    },
    {
      title: 'Exchange study',
      text: 'For temporary study through an eligible home-university agreement.',
      href: '/admissions/how-to-apply',
      duration: 'Often one or two terms, as set by the partner arrangement.',
      prerequisites: 'Home-institution nomination or an exchange agreement may be required.',
      language: 'Depends on courses selected and the host university.',
      intake: 'Host and home university calendars apply.',
      visa: 'Confirm the correct status with the host university and Korean authorities.',
      next: 'Contact your home institution’s international office.',
    },
    {
      title: 'Visiting student',
      text: 'For temporary non-degree study where a host institution offers an individual application route.',
      href: '/admissions/how-to-apply',
      duration: 'Set by the host program.',
      prerequisites: 'Host-specific academic and application requirements.',
      language: 'Check each course and the host institution’s language rules.',
      intake: 'Host-specific; confirm application dates.',
      visa: 'Ask the host institution and Korean mission which status applies.',
      next: 'Search the host university’s visiting-student information.',
    },
    {
      title: 'Summer or winter short program',
      text: 'For short-term academic, cultural, or language programs offered on a seasonal basis.',
      href: '/programs',
      duration: 'Short-term; dates are program-specific.',
      prerequisites: 'Eligibility and enrollment process depend on the organizer.',
      language: 'Check whether activities are taught in Korean, English, or both.',
      intake: 'Summer or winter dates vary by provider.',
      visa: 'Confirm whether a visa is required for the exact course and stay.',
      next: 'Review the university’s current short-program notice.',
    },
    {
      title: 'English-taught degree',
      text: 'For applicants comparing programs with English instruction and program-specific language evidence.',
      href: '/programs',
      duration: 'Follows the structure of the selected degree.',
      prerequisites: 'Degree-level academic requirements still apply.',
      language: 'Verify the actual language of instruction and accepted English evidence.',
      intake: 'Depends on the university and department.',
      visa: 'Degree and immigration requirements still apply; confirm the relevant category.',
      next: 'Check the department’s current course and international admissions guides.',
    },
    {
      title: 'Conditional admission where available',
      text: 'For applicants considering a route with written conditions set by a specific institution.',
      href: '/admissions/how-to-apply',
      duration: 'Set by the offer and program.',
      prerequisites: 'Conditions and progression criteria are institution-specific.',
      language: 'Verify any required language study, scores, or deadlines in writing.',
      intake: 'Only when offered in the current university notice.',
      visa: 'Check the admission documents and immigration process for the exact route.',
      next: 'Ask the university to confirm every condition and consequence in writing.',
    },
  ]
  const recommendations: { title: string; text: string; href: string }[] = []
  const addRecommendation = (recommendation: { title: string; text: string; href: string }) => {
    if (!recommendations.some((item) => item.href === recommendation.href)) recommendations.push(recommendation)
  }

  if (studyGoal === 'Korean-language training') {
    addRecommendation({
      title: 'University-affiliated Korean language institute',
      text: 'Compare term dates, fees, attendance rules, and visa documents directly with each institute. Language study does not guarantee degree admission.',
      href: '/programs/korean-language',
    })
  } else if (educationLevel === 'Bachelor’s graduate' || educationLevel === 'Master’s graduate') {
    addRecommendation({
      title: 'Graduate admission',
      text: 'Review master’s, doctoral, and research routes against the target department’s prior-degree, research, and language requirements.',
      href: '/admissions/graduate',
    })
  } else if (educationLevel === 'Secondary-school graduate') {
    addRecommendation({
      title: 'Undergraduate freshman admission',
      text: 'Compare programs that accept international first-year applicants and verify graduation, language, and document requirements.',
      href: '/admissions/how-to-apply',
    })
  }

  if (enrollment === 'Currently at a university outside Korea' || transferInterest === 'Interested in transfer') {
    addRecommendation({
      title: 'International university transfer',
      text: 'Ask each receiving university about completed-credit thresholds, eligible departments, document authentication, and separate credit evaluation.',
      href: '/admissions/transfer',
    })
  }
  if (enrollment === 'Currently at a Korean university') {
    addRecommendation({
      title: 'Internal major change or transfer',
      text: 'Start with your current university’s academic regulations and international office; internal transfer and external admission are different processes.',
      href: '/admissions/transfer',
    })
  }
  if (koreanLevel === 'Beginner / no Korean yet' && studyGoal !== 'Korean-language training') {
    addRecommendation({
      title: 'Compare English-taught options and language preparation',
      text: 'Check the language of instruction and accepted evidence for each degree program. If needed, compare language institutes as a separate pathway.',
      href: '/programs/korean-language',
    })
  }
  addRecommendation({
    title: 'Check the next official application windows',
    text: `Use your ${intake.toLowerCase()} target to build a university-specific deadline list${subject.trim() ? ` for ${subject.trim()}` : ''}. Dates vary by institution and program.`,
    href: '/admissions/intakes',
  })

  return (
    <div>
      <PageHeader kicker="Study planning" title="Find a Korean study pathway" description="Compare study routes before narrowing down universities. Availability and eligibility are institution- and program-specific." />
      <div className="container py-10 md:py-14">
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Tell us what you’re planning</CardTitle>
            <p className="text-sm text-muted-foreground">Your answers stay in this browser session; this tool does not determine formal eligibility or submit personal information.</p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectFilter label="Current education level" value={educationLevel} options={['Secondary-school graduate', 'Current university student', 'Bachelor’s graduate', 'Master’s graduate', 'Other / unsure']} onChange={setEducationLevel} />
            <SelectFilter label="Enrollment status" value={enrollment} options={['Not currently enrolled', 'Currently at a university outside Korea', 'Currently at a Korean university', 'Unsure']} onChange={setEnrollment} />
            <div className="grid gap-1.5"><label htmlFor="pathway-country" className="text-xs font-medium text-muted-foreground">Country of study / residence</label><Input id="pathway-country" autoComplete="country-name" value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Optional" /></div>
            <div className="grid gap-1.5"><label htmlFor="pathway-subject" className="text-xs font-medium text-muted-foreground">Subject of interest</label><Input id="pathway-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. business, engineering" /></div>
            <SelectFilter label="Preferred study route" value={studyGoal} options={['Degree program', 'Korean-language training', 'Not sure']} onChange={setStudyGoal} />
            <SelectFilter label="Transfer interest" value={transferInterest} options={['Interested in transfer', 'Not interested in transfer', 'Not sure']} onChange={setTransferInterest} />
            <SelectFilter label="Korean proficiency" value={koreanLevel} options={['Beginner / no Korean yet', 'Intermediate / advanced', 'TOPIK score available', 'Not sure']} onChange={setKoreanLevel} />
            <SelectFilter label="English proficiency" value={englishLevel} options={['English test / academic evidence available', 'Limited / no English evidence', 'Not sure']} onChange={setEnglishLevel} />
            <SelectFilter label="Target intake" value={intake} options={['March 2027', 'September 2027', 'Flexible', 'Not sure']} onChange={setIntake} />
            <div className="grid gap-1.5"><label htmlFor="pathway-budget" className="text-xs font-medium text-muted-foreground">Approximate annual education budget (KRW)</label><Input id="pathway-budget" inputMode="numeric" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Optional" /></div>
          </CardContent>
        </Card>
        <section aria-live="polite" aria-labelledby="pathway-results-heading" className="mb-10">
          <div className="mb-5">
            <p className="text-sm font-semibold text-accent">Suggested next steps</p>
            <h2 id="pathway-results-heading" className="mt-1 font-heading text-2xl font-bold">Pathways to investigate</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {[
                country.trim() ? `Country: ${country.trim()}` : '',
                subject.trim() ? `Subject: ${subject.trim()}` : '',
                budget.trim() ? `Budget noted: KRW ${budget.trim()}` : '',
                `English evidence: ${englishLevel.toLowerCase()}`,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.href} className="flex flex-col">
                <CardHeader><CardTitle className="text-lg">{recommendation.title}</CardTitle></CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm leading-relaxed text-muted-foreground">{recommendation.text}</p>
                  <Button asChild variant="link" className="mt-auto justify-start px-0 pt-4"><Link to={recommendation.href}>Explore this route <ArrowRight className="h-4 w-4" /></Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="accent" className="max-w-full whitespace-normal text-center"><Link to="/book-consultation">Discuss My Options With Sanshin Global Education</Link></Button>
            <Button asChild variant="outline"><Link to="/cost-of-living">Estimate study costs</Link></Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Recommendations are educational guidance only, not a formal eligibility assessment or guarantee of admission, funding, transfer credits, or visa approval.</p>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <Card key={pathway.title} className="flex flex-col">
              <CardHeader><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><GraduationCap className="h-5 w-5" aria-hidden="true" /></div><CardTitle className="text-lg">{pathway.title}</CardTitle></CardHeader>
              <CardContent className="flex flex-1 flex-col"><p className="text-sm leading-relaxed text-muted-foreground">{pathway.text}</p><Button asChild variant="link" className="mt-auto justify-start px-0 pt-4"><Link to={pathway.href}>Explore route <ArrowRight className="h-4 w-4" /></Link></Button></CardContent>
            </Card>
          ))}
        </div>
        <section className="mt-14" aria-labelledby="pathway-comparison-heading">
          <div className="mb-5">
            <h2 id="pathway-comparison-heading" className="font-heading text-2xl font-bold">Compare common study routes</h2>
            <p className="mt-2 text-sm text-muted-foreground">These are planning prompts, not universal program rules. Check each institution’s latest materials and confirm visa questions with Korean authorities.</p>
          </div>
          <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border" role="region" aria-label="Study pathway comparison table" tabIndex={0}>
            <table className="min-w-[1120px] w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="p-3">Route</th>
                  <th scope="col" className="p-3">Typical duration</th>
                  <th scope="col" className="p-3">Academic prerequisites</th>
                  <th scope="col" className="p-3">Language considerations</th>
                  <th scope="col" className="p-3">Intake pattern</th>
                  <th scope="col" className="p-3">Visa research</th>
                  <th scope="col" className="p-3">Next step</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pathways.map((pathway) => (
                  <tr key={pathway.title} className="align-top">
                    <th scope="row" className="p-3 font-semibold">{pathway.title}</th>
                    <td className="p-3">{pathway.duration}</td>
                    <td className="p-3">{pathway.prerequisites}</td>
                    <td className="p-3">{pathway.language}</td>
                    <td className="p-3">{pathway.intake}</td>
                    <td className="p-3">{pathway.visa}</td>
                    <td className="p-3"><Link className="text-accent underline underline-offset-2" to={pathway.href}>{pathway.next}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className="mt-8 text-xs text-muted-foreground">These routes are general educational information, not an eligibility assessment or guarantee of admission, funding, or visa approval.</p>
      </div>
    </div>
  )
}
