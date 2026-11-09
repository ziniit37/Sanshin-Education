'use client'

import { useParams } from 'next/navigation'
import { Link } from '@/lib/navigation'
import { PageHeader } from '@/components/PageHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/EmptyState'
import { useQuery } from '@/contexts/DataProvider'

export function StudyAbroadPage() {
  const countries = useQuery('countries')
  return (
    <div>
      <PageHeader kicker="Destinations" title="Study abroad in South Korea" description="Sanshin Global Education is a Korea-only consultancy. Explore the destination, then universities and programs." />
      <div className="container py-12">
        {countries.loading ? <p>Loading…</p> : null}
        <div className="grid gap-6 md:grid-cols-2">
          {countries.items.map((country) => (
            <Link key={country.id} to={`/study-abroad/${country.slug}`} className="overflow-hidden rounded-lg border bg-card">
              <img src={country.heroImage} alt="" className="h-56 w-full object-cover" />
              <div className="p-6">
                <h2 className="font-heading text-2xl font-bold">{country.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{country.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CountryDetailPage() {
  const { slug } = useParams()
  const country = useQuery('countries', { filters: { slug } }).items[0]
  const universities = useQuery('universities', { filters: country ? { countryId: country.id } : {} })
  const programs = useQuery('programs')
  const scholarships = useQuery('scholarships')
  const faqs = useQuery('faqs')

  if (!country) {
    return (
      <div className="container py-16">
        <EmptyState title="Destination not found" action={<Button asChild><Link to="/study-abroad">Back</Link></Button>} />
      </div>
    )
  }

  const uniPrograms = programs.items.filter((p) => universities.items.some((u) => u.id === p.universityId))

  return (
    <div>
      <PageHeader kicker="Study abroad" title={`Study in ${country.name}`} description={country.overview} />
      <div className="container grid gap-10 py-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <img src={country.heroImage} alt="" className="h-72 w-full rounded-lg object-cover" />
          <section>
            <h2 className="mb-4 text-2xl font-bold">Universities</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {universities.items.map((uni) => (
                <Card key={uni.id}>
                  <CardHeader><CardTitle className="text-lg">{uni.name}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{uni.city}</p>
                    <Button asChild variant="link" className="px-0"><Link to={`/universities/${uni.slug}`}>Profile</Link></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">Programs</h2>
            <ul className="space-y-2 text-sm">
              {uniPrograms.map((p) => (
                <li key={p.id}><Link className="text-accent" to={`/programs/${p.slug}`}>{p.name}</Link> · {p.degree}</li>
              ))}
            </ul>
          </section>
          <section className="grid gap-6 md:grid-cols-2">
            <Card><CardHeader><CardTitle>Intakes</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{country.intakes}</CardContent></Card>
            <Card><CardHeader><CardTitle>Tuition</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{country.tuitionRange}</CardContent></Card>
            <Card><CardHeader><CardTitle>Living costs</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{country.livingCosts}</CardContent></Card>
            <Card><CardHeader><CardTitle>Scholarships</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{scholarships.items.map((s) => <Link key={s.id} className="block text-accent" to={`/scholarships/${s.slug}`}>{s.name}</Link>)}</CardContent></Card>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">Visa overview</h2>
            <p className="text-muted-foreground">{country.visaOverview}</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">Work during study</h2>
            <p className="text-muted-foreground">{country.workDuringStudy}</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">Post-study options</h2>
            <p className="text-muted-foreground">{country.postStudy}</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">FAQs</h2>
            <Accordion type="single" collapsible>
              {faqs.items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Next step</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              <Button asChild variant="accent"><Link to="/eligibility">Eligibility assessment</Link></Button>
              <Button asChild variant="outline"><Link to="/book-consultation">Book consultation</Link></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
