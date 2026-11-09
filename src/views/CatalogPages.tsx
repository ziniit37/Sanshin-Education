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

const officialUniversitySites: Record<string, string> = {
  'seoul-national-university': 'https://en.snu.ac.kr/',
  'korea-university': 'https://www.korea.edu/mbshome/mbs/en/',
  'yonsei-university': 'https://www.yonsei.ac.kr/en_sc/',
  kaist: 'https://www.kaist.ac.kr/en/',
}

export function UniversitiesPage() {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('all')
  const result = useQuery('universities', { search: q, searchFields: ['name', 'city', 'overview'], filters: { city } })
  const cities = [...new Set(useQuery('universities').items.map((u) => u.city))]
  return (
    <div>
      <PageHeader kicker="Catalog" title="Korean universities" description="Search university profiles by name or city, then verify program details directly with each institution." />
      <div className="container py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Search universities" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {result.loading ? <p>Loading…</p> : null}
        {result.total === 0 && !result.loading ? <EmptyState title="No universities match" /> : null}
        <p className="mb-4 text-sm text-muted-foreground">{result.total} universities</p>
        <div className="grid gap-6 md:grid-cols-2">
          {result.items.map((uni) => (
            <Link key={uni.id} to={`/universities/${uni.slug}`} className="overflow-hidden rounded-lg border bg-card">
              <img src={uni.image} alt="" className="h-44 w-full object-cover" />
              <div className="p-5">
                <h2 className="font-heading text-xl font-semibold">{uni.name}</h2>
                <p className="text-sm text-muted-foreground">{uni.city}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function UniversityDetailPage() {
  const { slug } = useParams()
  const uni = useQuery('universities', { filters: { slug } }).items[0]
  const programs = useQuery('programs', { filters: uni ? { universityId: uni.id } : {} })
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
  const result = useQuery('programs', { search: q, searchFields: ['name', 'subject'], filters: { degree, subject } })
  const degrees = [...new Set(all.items.map((p) => p.degree))]
  const subjects = [...new Set(all.items.map((p) => p.subject))]
  const unis = useQuery('universities')
  const uniName = (id: string) => unis.items.find((u) => u.id === id)?.name ?? ''
  return (
    <div>
      <PageHeader kicker="Catalog" title="Programs in South Korea" description="Filter by degree and subject." />
      <div className="container py-10">
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <Input placeholder="Search programs" value={q} onChange={(e) => setQ(e.target.value)} />
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
        <p className="mb-4 text-sm text-muted-foreground">{result.total} programs</p>
        {result.total === 0 ? <EmptyState title="No programs match" /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="overflow-hidden rounded-lg border bg-card hover:bg-muted/40">
                <img
                  src={getProgramImage(p.subject)}
                  alt={`${p.subject} study`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <p className="text-xs text-accent">{p.degree} · {p.subject}</p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{uniName(p.universityId)} · {p.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ProgramDetailPage() {
  const { slug } = useParams()
  const program = useQuery('programs', { filters: { slug } }).items[0]
  const uni = useQuery('universities', { filters: program ? { id: program.universityId } : {} }).items[0]
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
  const result = useQuery('blogPosts', { filters: { updateType: type }, sortKey: 'publishedAt', sortDir: 'desc' })
  return (
    <div>
      <PageHeader kicker="Resources" title="Korea study updates" />
      <div className="container py-10">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="mb-6 w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All updates</SelectItem>
            {['general', 'scholarship_alert', 'visa_update', 'application_deadline', 'university_update'].map((t) => (
              <SelectItem key={t} value={t}>{labelize(t)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid gap-6 md:grid-cols-3">
          {result.items.map((post) => (
            <Link key={post.id} to={`/resources/${post.slug}`} className="overflow-hidden rounded-lg border bg-card">
              <img src={post.coverImage} alt="" className="h-40 w-full object-cover" />
              <div className="p-4">
                <StatusBadge value={post.updateType} />
                <h2 className="mt-2 font-heading font-semibold">{post.title}</h2>
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
  const post = useQuery('blogPosts', { filters: { slug } }).items[0]
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
