'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, ExternalLink, GraduationCap, Landmark, Wallet } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TUITION_SOURCE_URL, UNIVERSITY_DIRECTORY } from '@/lib/university-directory'

const gksUndergraduateNotice = 'https://studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4522'
const gksUniversityTrackNotice = 'https://www.studyinkorea.go.kr/en/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4527'
const studyInKoreaScholarships = 'https://www.studyinkorea.go.kr/en/plan/scholarship.do'
const studyInKoreaVisa = 'https://www.studyinkorea.go.kr/ko/plan/visaAndStay.do'
const hiKorea = 'https://www.hikorea.go.kr/'
const immigration = 'https://www.immigration.go.kr/'
const visaPortal = 'https://www.visa.go.kr/'

function OfficialLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="inline-flex items-center gap-1 text-accent underline underline-offset-2" href={href} target="_blank" rel="noreferrer">
      {children}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

function FilterSelect({
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
  const id = `guide-filter-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

const scholarshipRecords = [
  {
    name: '2027 Global Korea Scholarship — Undergraduate, Embassy Track',
    degree: "Associate / Bachelor's",
    provider: 'Government',
    funding: 'Defined by current notice',
    subject: 'Eligible departments listed in annual guideline',
    university: 'Participating universities in the current guideline',
    status: 'Published September 9, 2026; confirm country-specific application schedule',
    eligibility: 'Nationality, age, prior education, academic record, and other criteria are set by the current annual guideline and country instructions.',
    dates: 'The application guidelines were published September 9, 2026. Application deadlines are set by the relevant Korean embassy or designated process in each country.',
    countries: '',
    sources: [{ label: '2027 GKS-U guidelines', url: gksUndergraduateNotice }],
  },
  {
    name: '2027 Global Korea Scholarship — Undergraduate, University Track',
    degree: "Associate / Bachelor's",
    provider: 'Government',
    funding: 'Defined by current notice',
    subject: 'Participating departments in the University Track file',
    university: 'Participating universities in the current guideline',
    status: 'Published September 23, 2026; confirm dates with each university',
    eligibility: 'The current guideline and university-specific selection plan determine eligible applicants and procedures.',
    dates: 'The University Track notice was published September 23, 2026. Each participating university sets its own application and selection schedule.',
    countries: '',
    sources: [{ label: '2027 GKS-U University Track notice', url: gksUniversityTrackNotice }],
  },
  {
    name: 'Global Korea Scholarship — Graduate (GKS-G)',
    degree: "Master's / PhD / Research",
    provider: 'Government',
    funding: 'Defined by current notice',
    subject: 'Check the current graduate guideline',
    university: 'Participating universities listed for the relevant cycle',
    status: '2027 notice status is not verified in this guide',
    eligibility: 'Use the current GKS-G announcement and attachments; do not reuse undergraduate requirements.',
    dates: 'Check the official notice board for current publication and application dates.',
    countries: '',
    sources: [{ label: 'Official Study in Korea GKS notice board', url: studyInKoreaScholarships }],
  },
  ...UNIVERSITY_DIRECTORY.map((university) => ({
    name: `${university.name} — scholarship notices`,
    degree: 'Check the current university notice',
    provider: 'University',
    funding: 'Not specified; verify each award',
    subject: 'Varies by university and department',
    university: university.name,
    status: 'No specific award or deadline asserted',
    eligibility: university.scholarshipNote,
    dates: 'Check the current admissions and scholarship notices; there may be a separate application period.',
    countries: '',
    sources: [{ label: 'Official admissions and scholarship starting point', url: university.admissionsUrl || university.officialUrl }],
  })),
]

export function ScholarshipFinderPage() {
  const [degree, setDegree] = useState('all')
  const [provider, setProvider] = useState('all')
  const [funding, setFunding] = useState('all')
  const [subject, setSubject] = useState('all')
  const [university, setUniversity] = useState('')
  const [status, setStatus] = useState('all')
  const [nationality, setNationality] = useState('')

  const records = useMemo(() => scholarshipRecords.filter((record) => (
    (degree === 'all' || record.degree.includes(degree))
    && (provider === 'all' || record.provider === provider)
    && (funding === 'all' || record.funding === funding)
    && (subject === 'all' || record.subject.toLowerCase().includes(subject.toLowerCase()))
    && (!university.trim() || record.university.toLowerCase().includes(university.trim().toLowerCase()))
    && (status === 'all' || record.status.toLowerCase().includes(status.toLowerCase()))
  )), [degree, provider, funding, subject, university, status])

  return (
    <div>
      <PageHeader kicker="Funding research" title="Scholarships for study in Korea" description="Compare official scholarship routes and use current provider notices for eligibility, benefits, countries, and deadlines. Directory inclusion is not a funding guarantee." />
      <div className="container space-y-10 py-10">
        <section className="rounded-2xl bg-primary p-6 text-primary-foreground md:p-8">
          <div className="flex items-start gap-4">
            <GraduationCap className="mt-1 h-7 w-7 shrink-0 text-gold" aria-hidden="true" />
            <div>
              <h2 className="font-heading text-2xl font-bold">2027 GKS undergraduate notices are published</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary-foreground/80">
                Embassy Track and University Track use different application channels. Countries, participating departments, selection steps, timelines, and benefits are defined in the current files. Study in Korea describes broad benefit categories including airfare, Korean-language training, tuition, and monthly allowances; use the 2027 guideline for exact terms and eligibility. The scholarship cycle year does not necessarily mean classes start that year.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <a className="inline-flex items-center gap-1 text-sm font-medium text-gold underline underline-offset-2" href={gksUndergraduateNotice} target="_blank" rel="noreferrer">2027 GKS-U guidelines <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
                <a className="inline-flex items-center gap-1 text-sm font-medium text-gold underline underline-offset-2" href={gksUniversityTrackNotice} target="_blank" rel="noreferrer">2027 University Track notice <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
              </div>
              <p className="mt-3 text-xs text-primary-foreground/70">Last checked: November 9, 2026. Follow country and university notices for exact application dates.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="scholarship-finder-heading">
          <div className="mb-5">
            <h2 id="scholarship-finder-heading" className="font-heading text-2xl font-bold">Scholarship finder</h2>
            <p className="mt-1 text-sm text-muted-foreground">Filters show only information stated in this guide. Unverified national eligibility and award coverage are left for the official notice to decide.</p>
          </div>
          <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Degree" value={degree} onChange={setDegree} options={["Associate", "Bachelor's", "Master's", 'PhD', 'Research']} />
            <FilterSelect label="Provider" value={provider} onChange={setProvider} options={['Government', 'University']} />
            <FilterSelect label="Funding coverage" value={funding} onChange={setFunding} options={['Defined by current notice', 'Not specified; verify each award']} />
            <FilterSelect label="Subject" value={subject} onChange={setSubject} options={['Eligible departments', 'Participating departments', 'Check the current graduate guideline', 'Varies by university']} />
            <div className="grid gap-1.5"><Label htmlFor="scholarship-university">University</Label><Input id="scholarship-university" placeholder="Search named institution" value={university} onChange={(event) => setUniversity(event.target.value)} /></div>
            <div className="grid gap-1.5"><Label htmlFor="scholarship-status">Application status</Label>
              <Select value={status} onValueChange={setStatus}><SelectTrigger id="scholarship-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="published">Notice published</SelectItem><SelectItem value="not verified">Status not verified</SelectItem><SelectItem value="no specific">No specific award asserted</SelectItem></SelectContent></Select>
            </div>
            <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="scholarship-nationality">Nationality eligibility check</Label><Input id="scholarship-nationality" autoComplete="country-name" placeholder="Enter a country to check against official documents" value={nationality} onChange={(event) => setNationality(event.target.value)} /></div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {nationality.trim()
              ? `No nationality eligibility is inferred for “${nationality.trim()}”. Check the country-specific guideline and participating-university list before applying.`
              : 'Country quotas and eligibility can change by cycle; confirm them in the current official guideline.'}
          </p>
          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{records.length} matching guidance entries</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {records.map((record) => (
              <Card key={record.name} className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Landmark className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div><CardTitle className="text-lg">{record.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{record.provider} · {record.degree}</p></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p><strong>Status:</strong> {record.status}</p>
                  <p><strong>Funding:</strong> {record.funding}. Review the published benefits; no amount is promised here.</p>
                  <p><strong>Subject / institution:</strong> {record.subject} · {record.university}</p>
                  <p><strong>Eligibility:</strong> {record.eligibility}</p>
                  <p><strong>Dates:</strong> {record.dates}</p>
                  <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">Research starting point only. This entry does not describe a confirmed award or funding guarantee. Review the current official notice for detailed criteria and funding.</p>
                  {record.sources.map((source) => <OfficialLink key={source.url} href={source.url}>{source.label}</OfficialLink>)}
                </CardContent>
              </Card>
            ))}
          </div>
          {records.length === 0 ? <p className="mt-4 rounded-lg border p-4 text-sm text-muted-foreground">No entries match those filters. The current guide does not publish an award-level guarantee or a complete national eligibility database.</p> : null}
        </section>

        <section className="rounded-xl border bg-muted/40 p-6">
          <h2 className="font-heading text-xl font-bold">Explore scholarships for your study pathway</h2>
          <p className="mt-2 text-sm text-muted-foreground">Start with the exact university and degree guide, then compare the award’s eligibility, amount, continuation conditions, and application period.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="accent"><Link to="/study-pathways">Find my study pathway <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/book-consultation">Discuss my options with Sanshin</Link></Button>
          </div>
        </section>
      </div>
    </div>
  )
}

const visaCategories = [
  ['D-2-1', 'Associate degree study'],
  ['D-2-2', "Bachelor's degree study"],
  ['D-2-3', "Master's degree study"],
  ['D-2-4', 'Doctoral degree study'],
  ['D-2-5', 'Research'],
  ['D-2-6', 'Exchange study'],
  ['D-2-7', 'Work-learning linked study; confirm current eligibility'],
  ['D-4-1', 'Korean-language training'],
  ['D-4-2', 'Foreign-language training'],
]

export function StudentVisaGuidePage() {
  return (
    <div>
      <PageHeader kicker="Official-source visa overview" title="Korean student visa guide: D-2 and D-4" description="A planning overview only. The Korean embassy, consulate, or immigration authority determines the correct category and required documents for each applicant." />
      <div className="container max-w-5xl space-y-10 py-10">
        <section>
          <h2 className="mb-4 font-heading text-2xl font-bold">Common study categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visaCategories.map(([code, description]) => (
              <Card key={code}><CardHeader><CardTitle>{code}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{description}</CardContent></Card>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">D-2 generally covers degree and specified study/research activities. D-4 generally covers designated training such as Korean-language study. These labels do not determine an individual’s eligibility.</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Documents to prepare for checking</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Common categories can include a completed visa form, passport and photo, admission or enrollment papers, education records, proof of financial ability, and institution registration information.</p>
              <p>Family relationship evidence, tuberculosis screening, translations, authentication, and supplementary forms may apply in some cases or countries. The checklist is not universal; follow the responsible mission’s latest instructions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Moving from D-4 to D-2</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Language study does not automatically convert into degree status. A change of status or new visa may be necessary when progressing to degree study.</p>
              <p>The correct procedure depends on nationality, current status, timing, and current immigration rules. Confirm before paying deposits or changing your study plan.</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Student employment</CardTitle></CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              <p>Part-time employment may require prior immigration permission, school confirmation, qualifying language ability, and compliance with status-specific limits. Some D-4 language trainees may face a six-month eligibility condition; verify the rule that applies to your case with official immigration guidance.</p>
              <p className="mt-3 font-medium text-foreground">Do not assume work is unrestricted or available immediately, and do not rely on it to cover all study costs.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>After arrival</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Depending on length of stay and status, you may need foreigner registration, address reporting, health-insurance enrollment, university orientation, and timely extensions.</p>
              <p>Keep your enrollment and contact information current and follow the requirements for your exact status.</p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-xl border bg-muted/40 p-6">
          <h2 className="font-heading text-xl font-bold">Confirm current procedures with official authorities</h2>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <OfficialLink href={studyInKoreaVisa}>Study in Korea: visa and stay</OfficialLink>
            <OfficialLink href={visaPortal}>Korea Visa Portal</OfficialLink>
            <OfficialLink href={hiKorea}>Hi Korea immigration services</OfficialLink>
            <OfficialLink href={immigration}>Korea Immigration Service</OfficialLink>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Reviewed November 9, 2026. Immigration rules and embassy checklists change; verify before applying or working.</p>
          <Button asChild variant="accent" className="mt-5"><Link to="/book-consultation">Discuss your preparation <ArrowRight className="h-4 w-4" /></Link></Button>
        </section>
      </div>
    </div>
  )
}

const formatKRW = (amount: number) => new Intl.NumberFormat('en-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
}).format(amount)

const tuitionAverages = {
  undergraduate: { national: 6_820_244, public: 4_265_842, private: 7_625_336 },
  graduate: { national: 4_216_103, public: 2_481_808, private: 4_434_681 },
} as const

export function StudyBudgetPage() {
  const [city, setCity] = useState('Seoul')
  const [studyType, setStudyType] = useState('undergraduate')
  const [institution, setInstitution] = useState('national')
  const [terms, setTerms] = useState('2')
  const [accommodation, setAccommodation] = useState('dormitory')
  const [housingMonthly, setHousingMonthly] = useState('0')
  const [foodMonthly, setFoodMonthly] = useState('0')
  const [transportMonthly, setTransportMonthly] = useState('0')
  const [insuranceMonthly, setInsuranceMonthly] = useState('0')
  const [oneTime, setOneTime] = useState('0')
  const [languageFee, setLanguageFee] = useState('0')
  const [scholarshipScenario, setScholarshipScenario] = useState('0')

  const termCount = Math.max(1, Math.min(8, Number(terms) || 1))
  const housing = Math.max(0, Number(housingMonthly) || 0)
  const food = Math.max(0, Number(foodMonthly) || 0)
  const transport = Math.max(0, Number(transportMonthly) || 0)
  const insurance = Math.max(0, Number(insuranceMonthly) || 0)
  const setupCosts = Math.max(0, Number(oneTime) || 0)
  const scholarshipRate = Number(scholarshipScenario) || 0
  const tuitionAnnual = studyType === 'language' ? null : tuitionAverages[studyType as 'undergraduate' | 'graduate'][institution as 'national' | 'public' | 'private']
  const tuitionEstimate = studyType === 'language'
    ? Math.max(0, Number(languageFee) || 0) * termCount
    : (tuitionAnnual ?? 0) * termCount / 2
  const tuitionAfterScenario = tuitionEstimate * (1 - scholarshipRate / 100)
  const livingMonths = termCount * 4
  const livingEstimate = (housing + food + transport + insurance) * livingMonths
  const estimateTotal = tuitionAfterScenario + livingEstimate + setupCosts

  return (
    <div>
      <PageHeader kicker="Planning tool · KRW" title="Tuition and student budget in South Korea" description="Build an illustrative scenario from official tuition averages and your own cost assumptions. University fees, rent, insurance, visa costs, and living expenses vary." />
      <div className="container grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-accent" aria-hidden="true" /> Your study scenario</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5"><Label htmlFor="budget-city">City</Label><Select value={city} onValueChange={setCity}><SelectTrigger id="budget-city"><SelectValue /></SelectTrigger><SelectContent>{['Seoul', 'Busan', 'Daejeon', 'Daegu', 'Suwon', 'Other'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select><p className="text-xs text-muted-foreground">City selection labels the scenario; no unsupported city price adjustment is applied.</p></div>
              <div className="grid gap-1.5"><Label htmlFor="budget-study-type">Study type</Label><Select value={studyType} onValueChange={setStudyType}><SelectTrigger id="budget-study-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="undergraduate">Undergraduate degree</SelectItem><SelectItem value="graduate">Graduate degree</SelectItem><SelectItem value="language">Korean-language course</SelectItem></SelectContent></Select></div>
              {studyType !== 'language' ? <div className="grid gap-1.5"><Label htmlFor="budget-institution-type">Institution type</Label><Select value={institution} onValueChange={setInstitution}><SelectTrigger id="budget-institution-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="national">National average</SelectItem><SelectItem value="public">National / public average</SelectItem><SelectItem value="private">Private average</SelectItem></SelectContent></Select></div> : null}
              <div className="grid gap-1.5"><Label htmlFor="budget-terms">Number of terms (semesters)</Label><Input id="budget-terms" type="number" min="1" max="8" value={terms} onChange={(event) => setTerms(event.target.value)} /></div>
              <div className="grid gap-1.5"><Label htmlFor="budget-accommodation-type">Accommodation type</Label><Select value={accommodation} onValueChange={setAccommodation}><SelectTrigger id="budget-accommodation-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dormitory">University dormitory</SelectItem><SelectItem value="off-campus">Off-campus rent</SelectItem><SelectItem value="family">Staying with family</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              <div className="grid gap-1.5"><Label htmlFor="budget-scholarship">Illustrative tuition reduction</Label><Select value={scholarshipScenario} onValueChange={setScholarshipScenario}><SelectTrigger id="budget-scholarship"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">0% assumed</SelectItem><SelectItem value="25">25% scenario</SelectItem><SelectItem value="50">50% scenario</SelectItem><SelectItem value="75">75% scenario</SelectItem><SelectItem value="100">100% scenario</SelectItem></SelectContent></Select><p className="text-xs text-muted-foreground">Scenario only; no scholarship is promised.</p></div>
              {studyType === 'language' ? <div className="grid gap-1.5"><Label htmlFor="language-fee">Quoted language tuition per term (KRW)</Label><Input id="language-fee" type="number" min="0" value={languageFee} onChange={(event) => setLanguageFee(event.target.value)} /></div> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Your monthly and one-time cost assumptions (KRW)</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5"><Label htmlFor="budget-housing">Monthly housing / {accommodation}</Label><Input id="budget-housing" type="number" min="0" value={housingMonthly} onChange={(event) => setHousingMonthly(event.target.value)} /></div>
              <div className="grid gap-1.5"><Label htmlFor="budget-food">Monthly food</Label><Input id="budget-food" type="number" min="0" value={foodMonthly} onChange={(event) => setFoodMonthly(event.target.value)} /></div>
              <div className="grid gap-1.5"><Label htmlFor="budget-transport">Monthly transportation</Label><Input id="budget-transport" type="number" min="0" value={transportMonthly} onChange={(event) => setTransportMonthly(event.target.value)} /></div>
              <div className="grid gap-1.5"><Label htmlFor="budget-insurance">Monthly insurance / other living costs</Label><Input id="budget-insurance" type="number" min="0" value={insuranceMonthly} onChange={(event) => setInsuranceMonthly(event.target.value)} /></div>
              <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="budget-onetime">One-time application, deposits, documents, visa, flights, and emergency reserve</Label><Input id="budget-onetime" type="number" min="0" value={oneTime} onChange={(event) => setOneTime(event.target.value)} /></div>
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-5">
          <Card className="border-accent/40">
            <CardHeader><CardTitle>Illustrative estimate · {city}</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3"><span>Tuition before scenario</span><strong>{formatKRW(tuitionEstimate)}</strong></div>
              <div className="flex items-center justify-between gap-3"><span>Tuition after assumed {scholarshipRate}% reduction</span><strong>{formatKRW(tuitionAfterScenario)}</strong></div>
              <div className="flex items-center justify-between gap-3"><span>Entered monthly living costs × {livingMonths} months</span><strong>{formatKRW(livingEstimate)}</strong></div>
              <div className="flex items-center justify-between gap-3"><span>Entered one-time costs</span><strong>{formatKRW(setupCosts)}</strong></div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between gap-3 font-semibold"><span>Subtotal from entered assumptions</span><span>{formatKRW(estimateTotal)}</span></div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Assumptions: two terms per academic year; four months per term for the monthly living-cost calculation. Empty or zero cost fields are not estimated and will make the subtotal incomplete.</p>
              </div>
              {studyType === 'language' ? <p className="text-xs text-muted-foreground">Language tuition is only included when you enter a quoted per-term fee.</p> : null}
              <p className="text-xs text-muted-foreground">Tuition figures are annual government-published averages for degree programs, divided by two for a term estimate. The actual institution fee may differ.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Official tuition reference</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Undergraduate averages: KRW 6,820,244 national; KRW 4,265,842 national/public; KRW 7,625,336 private. Graduate averages: KRW 4,216,103 national; KRW 2,481,808 national/public; KRW 4,434,681 private.</p>
              <OfficialLink href={TUITION_SOURCE_URL}>Study in Korea: published study expenses</OfficialLink>
              <p>Source checked November 9, 2026. Amounts shown are rounded from the official published figures and are not an offer or a specific university’s fees.</p>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">Do not assume part-time work can cover tuition or living expenses. Confirm scholarship conditions, visa financial evidence, and current fees with the university and official authorities.</p>
          <Button asChild variant="accent" className="w-full"><Link to="/book-consultation">Discuss my budget <ArrowRight className="h-4 w-4" /></Link></Button>
        </aside>
      </div>
    </div>
  )
}
