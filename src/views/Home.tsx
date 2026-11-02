import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { FadeUp } from '@/components/FadeUp'
import { LeadForm } from '@/components/forms/LeadForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useContent } from '@/contexts/SiteContentProvider'
import { useData, useQuery, createRecord } from '@/contexts/DataProvider'
import { useToast } from '@/contexts/ToastProvider'
import { sendFormEmail } from '@/lib/form-email'
import { getProgramImage, getScholarshipImage, getServiceImage } from '@/lib/visuals'
import type { NewsletterSubscriber } from '@/lib/types'
import { useState } from 'react'

const steps = [
  { title: 'Profile & eligibility', body: 'Share academics, budget, and intake. Destination is South Korea.' },
  { title: 'University shortlist', body: 'We match SKY, KAIST, and other Korean programs to your profile.' },
  { title: 'Applications & funding', body: 'Essays, portals, GKS and campus scholarships.' },
  { title: 'Visa & arrival', body: 'D-2 prep, housing orientation, and pre-departure.' },
]

export function HomePage() {
  const { get } = useContent()
  const { create } = useData()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const universities = useQuery('universities', { filters: { featured: true } })
  const programs = useQuery('programs', { filters: { featured: true } })
  const scholarships = useQuery('scholarships', { pageSize: 3 })
  const stories = useQuery('successStories', { pageSize: 2 })
  const posts = useQuery('blogPosts', { sortKey: 'publishedAt', sortDir: 'desc', pageSize: 3 })
  const services = useQuery('services', { pageSize: 4 })
  const country = useQuery('countries', { filters: { slug: 'south-korea' } }).items[0]

  return (
    <div>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src="/images/seoul-skyline.jpg"
          alt="Seoul skyline"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="container relative grid gap-10 py-20 md:grid-cols-2 md:py-28">
          <FadeUp>
            <p className="mb-3 text-sm font-semibold text-gold">South Korea study consultancy</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{get('home.hero_headline')}</h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">{get('home.hero_subheadline')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link to="/eligibility">Check eligibility</Link>
              </Button>
              <Button asChild variant="gold" size="lg">
                <Link to="/book-consultation">Book a consultation</Link>
              </Button>
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="rounded-lg bg-background p-6 text-foreground shadow-xl">
            <h2 className="font-heading text-lg font-semibold">Start a Korea inquiry</h2>
            <p className="mb-4 text-sm text-muted-foreground">We’ll create a CRM lead and a counselor will follow up.</p>
            <LeadForm source="home_hero" compact submitLabel="Get guidance" />
          </FadeUp>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {[
            [get('stats.students_placed'), 'Students guided'],
            [get('stats.universities'), 'Korean universities'],
            [get('stats.visa_success'), 'Visa success (placeholder)'],
            [get('stats.years'), 'Years of counseling'],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="font-heading text-3xl font-bold text-accent">{stat}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <FadeUp className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-accent">Featured universities</p>
            <h2 className="text-3xl font-bold">Study at Korea’s leading campuses</h2>
          </div>
          <Button asChild variant="link">
            <Link to="/universities">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </FadeUp>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {universities.items.map((uni) => (
            <Link key={uni.id} to={`/universities/${uni.slug}`} className="group overflow-hidden rounded-lg border bg-card">
              <img src={uni.image} alt="" className="h-36 w-full object-cover transition group-hover:scale-[1.03]" />
              <div className="p-4">
                <p className="font-heading font-semibold">{uni.name}</p>
                <p className="text-sm text-muted-foreground">{uni.city} · {uni.ranking}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <FadeUp>
            <p className="text-sm font-medium text-accent">Why South Korea</p>
            <h2 className="text-3xl font-bold">A destination built for ambitious students</h2>
            <p className="mt-4 text-muted-foreground">{get('home.korea_highlight')}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {(country ? [country.intakes, country.tuitionRange, country.workDuringStudy] : []).map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6" variant="accent">
              <Link to="/study-abroad/south-korea">Explore studying in Korea</Link>
            </Button>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.items.map((program) => (
              <Card key={program.id}>
                <img
                  src={getProgramImage(program.subject)}
                  alt={`${program.subject} study`}
                  className="h-36 w-full rounded-t-lg object-cover"
                  loading="lazy"
                />
                <CardHeader>
                  <p className="text-xs text-accent">{program.degree} · {program.subject}</p>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0">
                    <Link to={`/programs/${program.slug}`}>Program details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="mb-8 text-3xl font-bold">How we help</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <img
                src={getServiceImage(service.slug)}
                alt={`${service.name} guidance`}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
              <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.tagline}</p>
                <Button asChild variant="link" className="mt-3 px-0">
                  <Link to={`/services/${service.slug}`}>Learn more</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-bold">Scholarships</h2>
            <Button asChild variant="link"><Link to="/scholarships">All awards</Link></Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {scholarships.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img
                  src={getScholarshipImage(item.slug)}
                  alt={`${item.name} study funding`}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{item.amount}</p>
                  <Button asChild variant="link" className="mt-2 px-0">
                    <Link to={`/scholarships/${item.slug}`}>Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="mb-8 text-3xl font-bold">The Sanshin process</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-lg border bg-card p-5">
              <span className="font-heading text-sm text-gold">0{i + 1}</span>
              <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-bold">Success stories</h2>
            <Button asChild variant="link"><Link to="/success-stories">Read more</Link></Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {stories.items.map((story) => (
              <Link key={story.id} to={`/success-stories/${story.slug}`} className="overflow-hidden rounded-lg border bg-card">
                <img src={story.image} alt="" className="h-48 w-full object-cover" />
                <div className="p-5">
                  <p className="font-heading text-xl font-semibold">{story.studentName}</p>
                  <p className="text-sm text-muted-foreground">{story.university} · {story.program}</p>
                  <p className="mt-2 text-sm">{story.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold">Latest resources</h2>
          <Button asChild variant="link"><Link to="/resources">All articles</Link></Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.items.map((post) => (
            <Card key={post.id}>
              <img src={post.coverImage} alt="" className="h-40 w-full rounded-t-lg object-cover" />
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                <Button asChild variant="link" className="mt-2 px-0">
                  <Link to={`/resources/${post.slug}`}>Read</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-card py-16">
        <div className="container grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Korea intake notes in your inbox</h2>
            <p className="mt-2 text-muted-foreground">Scholarship alerts, visa updates, and deadlines — editable from admin.</p>
            <form
              className="mt-6 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault()
                setSubscribing(true)
                try {
                  await sendFormEmail('newsletter', { Email: email })
                  create(
                    'newsletterSubscribers',
                    createRecord<Omit<NewsletterSubscriber, 'id' | 'createdAt'>>({ email }),
                  )
                  toast('Subscribed', 'You will receive Korea study updates.')
                  setEmail('')
                } catch (error) {
                  toast('Unable to subscribe', error instanceof Error ? error.message : 'Please try again.')
                } finally {
                  setSubscribing(false)
                }
              }}
            >
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              <Button type="submit" variant="accent" disabled={subscribing}>
                {subscribing ? 'Sending…' : 'Subscribe'}
              </Button>
            </form>
          </div>
          <div className="rounded-lg bg-primary p-8 text-primary-foreground">
            <h3 className="font-heading text-2xl font-bold">Ready to talk through a Korea plan?</h3>
            <p className="mt-2 text-sm text-primary-foreground/75">Eligibility, shortlist, or GKS — book a session.</p>
            <Button asChild variant="gold" className="mt-6">
              <Link to="/book-consultation">Book consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
