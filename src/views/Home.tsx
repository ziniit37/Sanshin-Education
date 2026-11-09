'use client'

import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@/lib/navigation'
import { FadeUp } from '@/components/FadeUp'
import { LeadForm } from '@/components/forms/LeadForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useQuery } from '@/contexts/DataProvider'
import { useToast } from '@/contexts/ToastProvider'
import { sendFormEmail } from '@/lib/form-email'
import { getProgramImage, getScholarshipImage, getServiceImage } from '@/lib/visuals'
import { getPublicScholarship } from '@/lib/public-content'

const steps = [
  { title: 'Share your goals', body: 'Tell us about your study interests, academic background, and preferred timing.' },
  { title: 'Explore pathways', body: 'Compare language programs, degrees, and research options in South Korea.' },
  { title: 'Build a shortlist', body: 'Review universities and programs against your goals and application requirements.' },
  { title: 'Prepare materials', body: 'Organize transcripts, statements, recommendations, and language results as needed.' },
  { title: 'Apply and plan', body: 'Follow each institution’s application instructions and keep track of its deadlines.' },
  { title: 'Prepare for Korea', body: 'After an admission decision, review the current visa process and practical arrival needs.' },
]

const trustPoints = [
  ['Korea-focused', 'Information and guidance centered on higher education in South Korea.'],
  ['Personalized planning', 'Explore options that fit your goals, academic history, and timeline.'],
  ['Clear next steps', 'Understand application preparation without promises of admission or funding.'],
  ['Student-centered', 'Get practical direction for comparing study pathways and preparing for a move.'],
]

const faqs = [
  {
    question: 'How do I apply to a Korean university?',
    answer: 'Start with the program’s international admissions page. Requirements, portals, and deadlines differ by institution and intake, so confirm the current instructions directly with each university.',
  },
  {
    question: 'Can I study in Korea without speaking Korean?',
    answer: 'Some institutions offer programs taught in English, while other courses require Korean proficiency. Check the language of instruction and the requirements for your exact program; Korean is also valuable for daily life.',
  },
  {
    question: 'What scholarships are available?',
    answer: 'Options may include the Global Korea Scholarship and university-specific awards. Eligibility, coverage, selection, and deadlines vary; use current official notices as the source of truth.',
  },
  {
    question: 'What documents will I need?',
    answer: 'Common materials can include academic records, proof of graduation, language scores, a study plan, recommendations, and identity documents. The required set depends on the university and program.',
  },
  {
    question: 'How much should I budget?',
    answer: 'Budget for tuition, housing, food, transport, insurance, and one-time setup costs. Costs vary substantially by city and lifestyle; request current figures from your institution and verify any visa financial-evidence rules.',
  },
  {
    question: 'Can international students work part-time?',
    answer: 'Some international students may work after meeting immigration and university conditions and obtaining required permission. Rules can change; confirm your eligibility with Korean immigration before taking work.',
  },
]

export function HomePage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const universities = useQuery('universities', { filters: { featured: true } })
  const programs = useQuery('programs', { filters: { featured: true }, pageSize: 4 })
  const scholarships = useQuery('scholarships', { pageSize: 3 })
  const posts = useQuery('blogPosts', { sortKey: 'publishedAt', sortDir: 'desc', pageSize: 3 })
  const services = useQuery('services', { pageSize: 4 })

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <Image
          src="/images/seoul-skyline.jpg"
          alt="Seoul skyline at dusk"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/65" />
        <div className="container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <FadeUp>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gold">Your Korea study journey</p>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Your Future Starts in South Korea.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
              Discover universities, explore scholarships, and take the next step toward studying in South Korea with
              personalized guidance from Sanshin Global Education.
            </p>
            <p className="mt-5 max-w-lg text-sm text-primary-foreground/75">
              Get help comparing study options and understanding the application process—without promises of admission,
              scholarship awards, or visa approval.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/universities">Explore universities <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-primary/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="#journey">How it works</Link>
              </Button>
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="rounded-2xl border border-white/60 bg-background p-5 text-foreground shadow-2xl sm:p-7">
            <h2 className="font-heading text-2xl font-bold">Plan your study journey</h2>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-muted-foreground">
              Tell us a little about your goals. Our team will review your inquiry and help you explore your options.
            </p>
            <LeadForm source="home_hero" compact submitLabel="Get my study plan" />
          </FadeUp>
        </div>
      </section>

      <section aria-label="Our approach" className="border-b bg-card">
        <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(([title, body]) => (
            <div key={title} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h2 className="font-heading font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <FadeUp className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">Find your next step</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Explore universities in South Korea</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Compare institutions and follow their official admissions links for current requirements and deadlines.
            </p>
          </div>
          <Button asChild variant="link" className="shrink-0">
            <Link to="/universities">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </FadeUp>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {universities.items.slice(0, 4).map((uni) => (
            <Link
              key={uni.id}
              to={`/universities/${uni.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={uni.image}
                  alt={`${uni.name} campus`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold">{uni.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{uni.city}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Directory listings are for information only and do not imply a university partnership or endorsement.
        </p>
      </section>

      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <FadeUp>
            <p className="text-sm font-semibold text-accent">Study in Korea</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Why choose South Korea for your education?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              South Korea offers a range of universities and study pathways, from Korean-language programs to
              undergraduate, graduate, and research degrees. Students can explore subjects across technology,
              business, arts, and the humanities while experiencing life in Korean cities.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                'Compare programs taught in Korean and English.',
                'Research university and government scholarship opportunities.',
                'Plan for language learning, housing, transport, and daily life.',
                'Check institution-specific admissions requirements before applying.',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7" variant="accent">
              <Link to="/study-in-korea">Discover study pathways <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.items.map((program) => (
              <Card key={program.id} className="overflow-hidden rounded-2xl">
                <div className="relative h-36">
                  <Image
                    src={getProgramImage(program.subject)}
                    alt={`${program.subject} study`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <p className="text-xs font-medium text-accent">{program.degree} · {program.subject}</p>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0">
                    <Link to={`/programs/${program.slug}`}>Explore program <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">Guidance for each step</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">How we can help</h2>
          </div>
          <Button asChild variant="link"><Link to="/services">Explore services <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service) => (
            <Card key={service.id} className="overflow-hidden rounded-2xl transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-36">
                <Image
                  src={getServiceImage(service.slug)}
                  alt={`${service.name} guidance`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <CardHeader><CardTitle className="text-lg">{service.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.tagline}</p>
                <Button asChild variant="link" className="mt-3 px-0">
                  <Link to={`/services/${service.slug}`}>Learn more <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card py-16 md:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-accent">Funding your studies</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Explore scholarship opportunities</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">Requirements and availability vary. Always confirm current terms with the official provider.</p>
            </div>
            <Button asChild variant="link"><Link to="/scholarships">All scholarships <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {scholarships.items.map((scholarship) => {
              const item = getPublicScholarship(scholarship)
              return (
              <Card key={item.id} className="overflow-hidden rounded-2xl">
                <div className="relative h-40">
                  <Image
                    src={getScholarshipImage(item.slug)}
                    alt={`${item.name} scholarship information`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader><CardTitle className="text-lg">{item.name}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.overview}</p>
                  <Button asChild variant="link" className="mt-2 px-0">
                    <Link to={`/scholarships/${item.slug}`}>Review details <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="journey" className="container scroll-mt-24 py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">A practical roadmap</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Your journey to studying in Korea</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className="font-heading text-sm font-bold text-accent">0{index + 1}</span>
              <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Admission and visa decisions are made by universities and the relevant government authorities.
        </p>
      </section>

      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-accent">Life beyond the classroom</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Prepare for everyday life in Korea</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From finding student housing to learning local transport and building Korean language confidence,
              practical preparation can make a new city feel more manageable.
            </p>
            <Button asChild variant="accent" className="mt-6">
              <Link to="/student-life">Explore student life <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { src: '/images/yonsei.jpg', alt: 'University campus in South Korea', title: 'Campus life' },
              { src: '/images/seoul-skyline.jpg', alt: 'Seoul city skyline', title: 'Cities and transport' },
              { src: '/images/kaist.jpg', alt: 'University grounds in Daejeon', title: 'Study communities' },
            ].map((item) => (
              <div key={item.title} className="overflow-hidden rounded-2xl border bg-card">
                <div className="relative h-44">
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <p className="p-3 text-sm font-semibold">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">Helpful reading</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Resources for your study journey</h2>
          </div>
          <Button asChild variant="link"><Link to="/resources">All resources <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.items.map((post) => (
            <Card key={post.id} className="overflow-hidden rounded-2xl">
              <div className="relative h-40">
                <Image
                  src={post.coverImage}
                  alt={`Illustration for ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader><CardTitle className="text-lg">{post.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <Button asChild variant="link" className="mt-2 px-0">
                  <Link to={`/resources/${post.slug}`}>Read article <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card py-16 md:py-20">
        <div className="container max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-accent">Common questions</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Before you apply</h2>
          </div>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 text-center">
            <Button asChild variant="link"><Link to="/faq">Visit all FAQs <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <Image src="/images/yonsei.jpg" alt="Korean university campus" fill sizes="100vw" className="absolute inset-0 -z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/65" />
        <div className="container flex flex-col items-start py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">Take the next step</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-5xl">Ready to begin your journey to Korea?</h2>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            Your study goals deserve a clear plan. Connect with Sanshin Global Education and explore your next steps.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-7">
            <Link to="/book-consultation">Speak with an advisor <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-card py-12">
        <div className="container grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Request Korea study updates</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask our team about scholarship, application, and student-life updates. This form sends a request; it does not add you to an automated mailing list.
            </p>
          </div>
          <form
            className="grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault()
              if (!consent) {
                toast('Please confirm your consent', 'Agree to receive email updates before subscribing.')
                return
              }
              setSubscribing(true)
              try {
                await sendFormEmail('newsletter', {
                  Email: email,
                  'Privacy consent': 'Yes',
                  Website: website,
                  'Form source': 'home_newsletter',
                })
                toast('Subscription request received', 'Your email was delivered to our team.')
                setEmail('')
                setConsent(false)
              } catch (error) {
                toast('Unable to subscribe', error instanceof Error ? error.message : 'Please try again.')
              } finally {
                setSubscribing(false)
              }
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" aria-label="Email address" />
              <Button type="submit" variant="accent" disabled={subscribing} className="shrink-0">
                {subscribing ? 'Sending…' : 'Subscribe'}
              </Button>
            </div>
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="newsletter-website">Leave this field empty</label>
              <input
                id="newsletter-website"
                className="h-px w-px"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-accent" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
              <span>I agree that Sanshin Global Education may use my information to respond to this request. See the <Link to="/privacy" className="text-accent underline">Privacy Policy</Link>.</span>
            </label>
          </form>
        </div>
      </section>
    </div>
  )
}
