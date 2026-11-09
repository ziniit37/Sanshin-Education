'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContent } from '@/contexts/SiteContentProvider'
import { useQuery } from '@/contexts/DataProvider'
import { getProgramImage, getScholarshipImage, getServiceImage } from '@/lib/visuals'
import { labelize } from '@/lib/utils'
import { getPublicScholarship, getPublicUniversitySummary } from '@/lib/public-content'
import { PROGRAM_DIRECTORY, TUITION_SOURCE_URL, UNIVERSITY_DIRECTORY, type UniversityDirectoryEntry } from '@/lib/university-directory'
import { getStudyResource, STUDY_RESOURCES } from '@/lib/study-resources'

const officialUniversitySites: Record<string, string> = {
  'seoul-national-university': 'https://en.snu.ac.kr/',
  'korea-university': 'https://www.korea.edu/mbshome/mbs/en/',
  'yonsei-university': 'https://www.yonsei.ac.kr/en_sc/',
  kaist: 'https://www.kaist.ac.kr/en/',
}

export function UniversitiesPage() {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('all')
  const stored = useQuery('universities')
  const knownSlugs = new Set(UNIVERSITY_DIRECTORY.map((university) => university.slug))
  const customEntries: UniversityDirectoryEntry[] = stored.items
    .filter((university) => !knownSlugs.has(university.slug))
    .map((university) => ({
      name: university.name,
      slug: university.slug,
      city: university.city,
      institutionType: 'Not specified',
      officialUrl: '',
      admissionsUrl: '',
      pathways: [],
      pathwayNote: 'Check the institution’s official website for current degree and international applicant options.',
      languageNote: 'Language of instruction and evidence requirements vary by program.',
      transferNote: 'Confirm transfer admission availability and credit rules with the institution.',
      scholarshipNote: 'Review current official scholarship notices; funding is not guaranteed.',
      tuitionSourceUrl: TUITION_SOURCE_URL,
      image: university.image,
    }))
  const entries = [...UNIVERSITY_DIRECTORY, ...customEntries]
  const query = q.trim().toLowerCase()
  const items = entries.filter((university) => (
    (city === 'all' || university.city === city)
    && (!query || `${university.name} ${university.city} ${university.institutionType} ${university.pathways.join(' ')}`.toLowerCase().includes(query))
  ))
  const cities = [...new Set(entries.map((university) => university.city))].sort()
  return (
    <div>
      <PageHeader kicker="University directory" title="Explore Korean universities" description="Compare institution locations and official admissions starting points. Program availability, language, transfers, scholarships, and deadlines must be confirmed in each current university guide." />
      <div className="container py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input aria-label="Search universities" placeholder="Search universities, city, or study level" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {stored.loading ? <p>Loading saved university entries…</p> : null}
        {items.length === 0 ? <EmptyState title="No universities match" /> : null}
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">{items.length} universities</p>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((uni) => (
            <Link key={uni.slug} to={`/universities/${uni.slug}`} className="group overflow-hidden rounded-lg border bg-card transition hover:-translate-y-0.5 hover:shadow-md">
              {uni.image ? <img src={uni.image} alt={`${uni.name} campus`} className="h-44 w-full object-cover" loading="lazy" /> : (
                <div className="flex h-44 items-end bg-gradient-to-br from-primary/10 via-accent/10 to-muted p-5">
                  <span className="font-heading text-3xl font-bold text-foreground/80">{uni.name}</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-heading text-xl font-semibold group-hover:text-accent">{uni.name}</h2>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs">{uni.institutionType}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{uni.city}</p>
                <p className="mt-3 text-sm text-muted-foreground">{uni.pathwayNote}</p>
                <span className="mt-4 inline-block text-sm font-medium text-accent">View profile and official links →</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Directory inclusion does not imply a partnership or endorsement. General tuition averages are not institution-specific fees.</p>
      </div>
    </div>
  )
}

export function UniversityDetailPage() {
  const { slug } = useParams()
  const directoryEntry = UNIVERSITY_DIRECTORY.find((university) => university.slug === slug)
  const uni = useQuery('universities', { filters: { slug } }).items[0]
  const programs = useQuery('programs', { filters: uni ? { universityId: uni.id } : {} })
  if (directoryEntry) {
    const listedPrograms = PROGRAM_DIRECTORY.filter((program) => program.universitySlug === directoryEntry.slug)
    return (
      <div>
        <PageHeader kicker={`${directoryEntry.city} · ${directoryEntry.institutionType}`} title={directoryEntry.name} description={directoryEntry.pathwayNote} />
        <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            {directoryEntry.image ? <img src={directoryEntry.image} alt={`${directoryEntry.name} campus`} className="h-72 w-full rounded-lg object-cover" /> : null}
            <section>
              <h2 className="font-heading text-xl font-semibold">Study pathways</h2>
              {directoryEntry.pathways.length ? <ul className="mt-3 flex flex-wrap gap-2">{directoryEntry.pathways.map((pathway) => <li key={pathway} className="rounded-full border px-3 py-1 text-sm">{pathway}</li>)}</ul> : <p className="mt-2 text-muted-foreground">Check the official university site for current study options.</p>}
              <p className="mt-3 text-sm text-muted-foreground">{directoryEntry.pathwayNote}</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-semibold">Language and admission route</h2>
              <p className="mt-2 text-muted-foreground">{directoryEntry.languageNote}</p>
              <p className="mt-2 text-muted-foreground">{directoryEntry.transferNote}</p>
              <p className="mt-2 text-muted-foreground">Freshman, graduate, exchange, and transfer routes vary by program and cycle. Check the current official admissions guide.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-semibold">Programs to investigate</h2>
              {listedPrograms.length ? (
                <ul className="mt-3 space-y-3">
                  {listedPrograms.map((program) => (
                    <li key={program.slug} className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">{program.degree} · {program.subject}</p>
                      <h3 className="mt-1 font-semibold">{program.name}</h3>
                      <a href={program.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-accent underline underline-offset-2">
                        Check official academic information <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-2 text-muted-foreground">This profile does not list unverified program names. Browse the university’s current academic catalog and international admissions guide.</p>}
            </section>
            <section>
              <h2 className="font-heading text-xl font-semibold">Scholarships and tuition</h2>
              <p className="mt-2 text-muted-foreground">{directoryEntry.scholarshipNote}</p>
              <p className="mt-2 text-sm text-muted-foreground">The government’s published national tuition averages are for planning only; they are not this institution’s fee schedule.</p>
              <a href={directoryEntry.tuitionSourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-accent underline underline-offset-2">
                Official university admissions / fee information <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <span className="mx-2 text-muted-foreground">·</span>
              <a href={TUITION_SOURCE_URL} target="_blank" rel="noreferrer" className="text-sm text-accent underline underline-offset-2">Official national tuition averages</a>
            </section>
            <p className="text-xs text-muted-foreground">Profile reviewed {directoryEntry.reviewedOn}. Always check the linked current guide before applying; details can change.</p>
          </div>
          <Card className="h-fit">
            <CardHeader><CardTitle>Official links</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <a href={directoryEntry.officialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-accent underline underline-offset-2">
                University website <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a href={directoryEntry.admissionsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-accent underline underline-offset-2">
                International admissions <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <Link className="block text-accent underline underline-offset-2" to="/admissions/intakes">Browse verified intake dates</Link>
              <Link className="block text-accent underline underline-offset-2" to="/admissions/transfer">Read transfer guidance</Link>
              <Button asChild variant="accent" className="w-full"><Link to="/book-consultation">Discuss this university</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  if (!uni) return <div className="container py-16"><EmptyState title="University not found" /></div>
  const officialSite = officialUniversitySites[uni.slug]
  const summary = getPublicUniversitySummary(uni)
  return (
    <div>
      <PageHeader kicker={uni.city} title={uni.name} description={summary} />
      <div className="container grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <img src={uni.image} alt={`${uni.name} campus`} className="h-72 w-full rounded-lg object-cover" />
          <p className="text-muted-foreground">{summary}</p>
          <section><h2 className="font-heading text-xl font-semibold">Admissions</h2><p className="mt-2 text-muted-foreground">Eligibility, language evidence, application materials, and selection vary by program and admissions cycle. Follow the current official international admissions guide.</p></section>
          <section><h2 className="font-heading text-xl font-semibold">Campus and programs</h2><p className="mt-2 text-muted-foreground">Review the university’s official site for campus information, current program availability, and application details.</p></section>
          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold">Programs</h2>
            {programs.items.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="mb-2 block rounded-lg border p-4 hover:bg-muted">{p.name} · {p.degree}</Link>
            ))}
          </section>
        </div>
        <Card>
          <CardHeader><CardTitle>At a glance</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Program availability, eligibility, fees, and deadlines vary. Confirm current information with the university’s official admissions office.</p>
            {officialSite ? (
              <a href={officialSite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent underline underline-offset-2">
                Official university website <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            <Button asChild variant="accent" className="w-full"><Link to="/book-consultation">Discuss this university</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ProgramsPage() {
  const [q, setQ] = useState('')
  const [degree, setDegree] = useState('all')
  const [subject, setSubject] = useState('all')
  const all = useQuery('programs')
  const unis = useQuery('universities')
  const storedSlugs = new Set(all.items.map((program) => program.slug))
  const staticPrograms = PROGRAM_DIRECTORY.filter((program) => !storedSlugs.has(program.slug))
  const entries = [
    ...all.items.map((program) => {
      const directoryProgram = PROGRAM_DIRECTORY.find((entry) => entry.slug === program.slug)
      const university = unis.items.find((item) => item.id === program.universityId)
      return {
        slug: program.slug,
        name: directoryProgram?.name ?? program.name,
        degree: directoryProgram?.degree ?? program.degree,
        subject: directoryProgram?.subject ?? program.subject,
        university: university?.name ?? 'University',
        universitySlug: directoryProgram?.universitySlug ?? university?.slug,
        officialUrl: directoryProgram?.officialUrl,
      }
    }),
    ...staticPrograms.map((program) => ({
      ...program,
      university: UNIVERSITY_DIRECTORY.find((university) => university.slug === program.universitySlug)?.name ?? '',
    })),
  ]
  const query = q.trim().toLowerCase()
  const items = entries.filter((program) => (
    (degree === 'all' || program.degree === degree)
    && (subject === 'all' || program.subject === subject)
    && (!query || `${program.name} ${program.subject} ${program.university}`.toLowerCase().includes(query))
  ))
  const degrees = [...new Set(entries.map((program) => program.degree))].sort()
  const subjects = [...new Set(entries.map((program) => program.subject))].sort()
  return (
    <div>
      <PageHeader kicker="Program directory" title="Explore study areas in South Korea" description="Browse a small set of academic program examples with official university links. This is not a complete catalog; check the current program page for international eligibility, language, intake, tuition, and requirements." />
      <div className="container py-10">
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <Input aria-label="Search programs" placeholder="Search programs, subjects, or universities" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={degree} onValueChange={setDegree}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All degrees</SelectItem>
              {degrees.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">{items.length} program examples</p>
        {items.length === 0 ? <EmptyState title="No programs match" /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.slug} className="overflow-hidden rounded-lg border bg-card">
                <img
                  src={getProgramImage(p.subject)}
                  alt={`${p.subject} study`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <p className="text-xs text-accent">{p.degree} · {p.subject}</p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.university}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {p.universitySlug ? <Link className="text-sm font-medium text-accent underline underline-offset-2" to={`/universities/${p.universitySlug}`}>University profile</Link> : null}
                    {p.officialUrl || UNIVERSITY_DIRECTORY.find((university) => university.slug === p.universitySlug)?.admissionsUrl ? (
                      <a className="inline-flex items-center gap-1 text-sm font-medium text-accent underline underline-offset-2" href={p.officialUrl ?? UNIVERSITY_DIRECTORY.find((university) => university.slug === p.universitySlug)?.admissionsUrl} target="_blank" rel="noreferrer">
                        Official program information <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs text-muted-foreground">Program names are examples, not guarantees of current international admission or course availability. Confirm every detail with the official university source.</p>
      </div>
    </div>
  )
}

export function ProgramDetailPage() {
  const { slug } = useParams()
  const directoryProgram = PROGRAM_DIRECTORY.find((program) => program.slug === slug)
  const program = useQuery('programs', { filters: { slug } }).items[0]
  const uni = useQuery('universities', { filters: program ? { id: program.universityId } : {} }).items[0]
  if (directoryProgram) {
    const directoryUniversity = UNIVERSITY_DIRECTORY.find((university) => university.slug === directoryProgram.universitySlug)
    return (
      <div>
        <PageHeader kicker={`${directoryProgram.degree} · ${directoryProgram.subject}`} title={directoryProgram.name} description={directoryUniversity?.name} />
        <div className="container max-w-3xl space-y-6 py-12">
          <p className="text-muted-foreground">This directory entry points to an academic area listed by the institution. Confirm the current program title, degree level, international admission eligibility, instruction language, requirements, tuition, and intake in the university’s latest official information.</p>
          <a href={directoryProgram.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent underline underline-offset-2">
            Check official academic information <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          {directoryUniversity ? <p><Link className="text-accent underline underline-offset-2" to={`/universities/${directoryUniversity.slug}`}>View {directoryUniversity.name} profile</Link></p> : null}
          <Button asChild variant="accent"><Link to="/book-consultation">Discuss your study options</Link></Button>
        </div>
      </div>
    )
  }
  if (!program) return <div className="container py-16"><EmptyState title="Program not found" /></div>
  return (
    <div>
      <PageHeader kicker={program.degree} title={program.name} description={uni?.name} />
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <img
            src={getProgramImage(program.subject)}
            alt={`${program.subject} study`}
            className="h-72 w-full rounded-lg object-cover"
          />
          <p><strong>Duration:</strong> {program.duration}</p>
          <p><strong>Tuition:</strong> {program.tuition}</p>
          <p><strong>Deadlines:</strong> {program.deadlines}</p>
          <p><strong>Intake:</strong> {program.intake}</p>
          <section><h2 className="font-heading text-xl">Requirements</h2><p className="mt-2 text-muted-foreground">{program.requirements}</p></section>
          <section><h2 className="font-heading text-xl">Career outcomes</h2><p className="mt-2 text-muted-foreground">{program.careerOutcomes}</p></section>
        </div>
        <Card>
          <CardHeader><CardTitle>University</CardTitle></CardHeader>
          <CardContent>
            {uni ? <Link className="text-accent" to={`/universities/${uni.slug}`}>{uni.name}</Link> : null}
            <Button asChild variant="accent" className="mt-4 w-full"><Link to="/eligibility">Check eligibility</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ScholarshipsPage() {
  const result = useQuery('scholarships', { sortKey: 'name' })
  return (
    <div>
      <PageHeader kicker="Funding" title="Scholarships for Korea" description="Explore government and institution-based funding categories. Availability, eligibility, benefits, and deadlines change by cycle." />
      <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((record) => {
          const s = getPublicScholarship(record)
          return (
          <Link key={s.id} to={`/scholarships/${s.slug}`} className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
            <img
              src={getScholarshipImage(s.slug)}
              alt={`${s.name} funding`}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col justify-between gap-3 p-5">
              <div>
                <h2 className="font-heading text-lg font-semibold">{s.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.overview}</p>
              </div>
              <span className="text-sm font-medium text-accent">View category overview</span>
            </div>
          </Link>
          )
        })}
      </div>
    </div>
  )
}

export function ScholarshipDetailPage() {
  const { slug } = useParams()
  const scholarship = useQuery('scholarships', { filters: { slug } }).items[0]
  if (!scholarship) return <div className="container py-16"><EmptyState title="Scholarship not found" /></div>
  const item = getPublicScholarship(scholarship)
  return (
    <div>
      <PageHeader kicker="Scholarship information" title={item.name} description={item.overview} />
      <div className="container max-w-3xl space-y-6 py-12">
        <img
          src={getScholarshipImage(item.slug)}
          alt={`${item.name} funding`}
          className="h-72 w-full rounded-lg object-cover"
        />
        <section><h2 className="font-heading text-xl">Eligibility</h2><p className="mt-2 text-muted-foreground">{item.eligibility}</p></section>
        <section><h2 className="font-heading text-xl">Coverage</h2><p className="mt-2 text-muted-foreground">{item.coverage}</p></section>
        <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">Scholarship terms and deadlines change. Check the current official notice before applying; listing an award here does not imply a university partnership or a guaranteed result.</p>
        {item.slug === 'global-korea-scholarship' ? (
          <a href="https://www.studyinkorea.go.kr/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent underline underline-offset-2">
            Official Study in Korea scholarship information <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        <Button asChild variant="accent"><Link to="/book-consultation">Talk to a counselor</Link></Button>
      </div>
    </div>
  )
}

export function ServicesPage() {
  const result = useQuery('services')
  return (
    <div>
      <PageHeader kicker="How we work" title="Services" description="Korea admissions support from shortlist to arrival." />
      <div className="container grid gap-6 py-12 md:grid-cols-2">
        {result.items.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <img
              src={getServiceImage(s.slug)}
              alt={`${s.name} guidance`}
              className="h-52 w-full object-cover"
              loading="lazy"
            />
            <CardHeader><CardTitle>{s.name}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{s.tagline}</p>
              <Button asChild variant="link" className="px-0 mt-3"><Link to={`/services/${s.slug}`}>View service</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ServiceDetailPage() {
  const { slug } = useParams()
  const item = useQuery('services', { filters: { slug } }).items[0]
  if (!item) return <div className="container py-16"><EmptyState title="Service not found" /></div>
  return (
    <div>
      <PageHeader kicker="Service" title={item.name} description={item.tagline} />
      <div className="container max-w-3xl space-y-8 py-12">
        <img
          src={getServiceImage(item.slug)}
          alt={`${item.name} guidance`}
          className="h-72 w-full rounded-lg object-cover"
        />
        <p>{item.description}</p>
        <section><h2 className="font-heading text-xl">Who it’s for</h2><p className="mt-2 text-muted-foreground">{item.whoItsFor}</p></section>
        <section><h2 className="font-heading text-xl">What’s included</h2><p className="mt-2 text-muted-foreground">{item.included}</p></section>
        <section><h2 className="font-heading text-xl">Process</h2><p className="mt-2 text-muted-foreground">{item.process}</p></section>
        <section><h2 className="font-heading text-xl">FAQs</h2><p className="mt-2 text-muted-foreground">{item.faqs}</p></section>
        <Button asChild variant="accent"><Link to="/book-consultation">Book this service</Link></Button>
      </div>
    </div>
  )
}

export function SuccessStoriesPage() {
  return (
    <div>
      <PageHeader kicker="Student experience" title="Stories from students" description="We only publish student stories with their permission." />
      <div className="container max-w-3xl py-12">
        <Card>
          <CardHeader><CardTitle>Our approach to student stories</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>We do not publish invented testimonials or use stock photography to represent students. This page will feature first-hand experiences only when students have reviewed and approved them for publication.</p>
            <Button asChild variant="accent"><Link to="/book-consultation">Discuss your study plans</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function SuccessStoryDetailPage() {
  return <div className="container py-16"><EmptyState title="Story not found" action={<Button asChild><Link to="/success-stories">Read about our approach</Link></Button>} /></div>
}

export function ResourcesPage() {
  const [type, setType] = useState('all')
  const result = useQuery('blogPosts', { sortKey: 'publishedAt', sortDir: 'desc' })
  const articles = STUDY_RESOURCES.filter((article) => type === 'all' || article.category === type)
  const categories = [...new Set(STUDY_RESOURCES.map((article) => article.category))]
  const customPosts = result.items.filter((post) => !getStudyResource(post.slug))
  return (
    <div>
      <PageHeader kicker="Research-based guides" title="Korea study resource center" description="Practical guidance for university admissions, language study, transfers, scholarships, visas, documents, and student budgeting. Check official sources for current rules and deadlines." />
      <div className="container py-10">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="mb-6 w-full sm:w-72" aria-label="Filter resources by topic"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">{articles.length + customPosts.length} guides and updates</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} to={`/resources/${article.slug}`} className="group rounded-lg border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">{article.category} · Reviewed {article.reviewedOn}</span>
              <h2 className="mt-2 font-heading text-lg font-semibold group-hover:text-accent">{article.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
              <span className="mt-4 inline-block text-sm font-medium text-accent">Read guide →</span>
            </Link>
          ))}
          {customPosts.map((post) => (
            <Link key={post.id} to={`/resources/${post.slug}`} className="overflow-hidden rounded-lg border bg-card">
              <img src={post.coverImage} alt="" className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <StatusBadge value={post.updateType} />
                <h2 className="mt-2 font-heading font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ResourceDetailPage() {
  const { slug } = useParams()
  const article = getStudyResource(typeof slug === 'string' ? slug : '')
  const post = useQuery('blogPosts', { filters: { slug } }).items[0]
  if (article) {
    const related = article.related
      .map((relatedSlug) => getStudyResource(relatedSlug))
      .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource))
    return (
      <div>
        <PageHeader kicker={`${article.category} · Reviewed ${article.reviewedOn}`} title={article.title} description={article.excerpt} />
        <article className="container max-w-3xl py-10">
          <div className="space-y-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading text-xl font-bold">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 leading-relaxed text-muted-foreground">{paragraph}</p>)}
                {section.bullets ? <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              </section>
            ))}
            <section>
              <h2 className="font-heading text-xl font-bold">Official sources</h2>
              <ul className="mt-3 space-y-2">
                {article.sources.map((source) => (
                  <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent underline underline-offset-2">{source.label}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a></li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Reviewed {article.reviewedOn}. Requirements and official notices can change; confirm current information with the institution or government authority.</p>
            </section>
            <section className="rounded-xl border bg-muted/40 p-5">
              <h2 className="font-heading text-xl font-bold">Related guides</h2>
              <ul className="mt-3 space-y-2">{related.map((resource) => <li key={resource.slug}><Link className="text-accent underline underline-offset-2" to={`/resources/${resource.slug}`}>{resource.title}</Link></li>)}</ul>
              <Button asChild variant="accent" className="mt-5"><Link to="/book-consultation">Discuss your study plans</Link></Button>
            </section>
          </div>
        </article>
      </div>
    )
  }
  if (!post) return <div className="container py-16"><EmptyState title="Article not found" /></div>
  return (
    <div>
      <PageHeader kicker={labelize(post.updateType)} title={post.title} description={post.excerpt} />
      <div className="container max-w-3xl py-12">
        <img src={post.coverImage} alt="" className="mb-6 h-72 w-full rounded-lg object-cover" />
        <div className="space-y-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </div>
  )
}

export function AboutPage() {
  const team = useQuery('teamMembers', { sortKey: 'order' }).items
    .filter((member) => !['team_1', 'team_2', 'team_3'].includes(member.id))
  return <AboutBody team={team} />
}

function AboutBody({ team }: { team: { id: string; name: string; role: string; bio: string; image: string }[] }) {
  const { get } = useContent()
  const savedStory = get('about.story')
  const story = savedStory.includes('was founded to make Korean higher education accessible')
    ? 'Sanshin Global Education focuses on helping international students understand study options in South Korea. Students should confirm current requirements with each institution and relevant authority.'
    : savedStory
  return (
    <div>
      <PageHeader title="About Sanshin Global Education" description={get('brand.tagline')} />
      <div className="container max-w-4xl space-y-10 py-12">
        <section className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Our story</h2>
            <p className="mt-3 text-muted-foreground">{story}</p>
          </div>
          <img
            src="/images/yonsei.jpg"
            alt="Yonsei University campus in Seoul"
            className="h-64 w-full rounded-lg object-cover"
            loading="lazy"
          />
        </section>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Mission</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{get('about.mission')}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{get('about.vision')}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Values</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{get('about.values')}</CardContent>
          </Card>
        </div>
        {team.length > 0 ? (
          <section>
            <h2 className="mb-6 text-2xl font-bold">Team</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {team.map((m) => (
                <Card key={m.id}>
                  <img src={m.image} alt="" className="h-48 w-full object-cover" />
                  <CardHeader>
                    <CardTitle className="text-lg">{m.name}</CardTitle>
                    <p className="text-sm text-accent">{m.role}</p>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{m.bio}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
