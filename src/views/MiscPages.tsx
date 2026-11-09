'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { FacebookMark } from '@/components/FacebookMark'
import { Link } from '@/lib/navigation'
import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/PageHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthProvider'
import { useQuery } from '@/contexts/DataProvider'
import { useContent } from '@/contexts/SiteContentProvider'
import { useToast } from '@/contexts/ToastProvider'
import { sanitizeHtml } from '@/lib/utils'
import { sendFormEmail } from '@/lib/form-email'
import { DEFAULT_CONTACT_EMAIL, DEFAULT_CONTACT_PHONE } from '@/lib/content-defaults'
import type { Appointment } from '@/lib/types'

export function FaqPage() {
  const faqs = useQuery('faqs')
  const groups = useMemo(() => {
    const map = new Map<string, typeof faqs.items>()
    faqs.items.forEach((faq) => {
      const list = map.get(faq.category) ?? []
      list.push(faq)
      map.set(faq.category, list)
    })
    return [...map.entries()]
  }, [faqs.items])

  return (
    <div>
      <PageHeader title="Frequently asked questions" description="Admissions, scholarships, visas, and life in Korea." />
      <div className="container max-w-3xl space-y-10 py-12">
        {groups.map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-3 font-heading text-xl font-semibold">{category}</h2>
            <Accordion type="single" collapsible>
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
        <section>
          <h2 className="mb-3 font-heading text-xl font-semibold">Planning a Korea application</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="faq-intake-dates">
              <AccordionTrigger>Are application deadlines the same across Korean universities?</AccordionTrigger>
              <AccordionContent> No. Dates and application rounds vary by university, degree, and department. Check the <Link className="text-accent underline" to="/admissions/intakes">source-linked intake calendar</Link>, then verify the current notice with the institution before applying.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-language-program">
              <AccordionTrigger>Does a Korean language program guarantee university admission?</AccordionTrigger>
              <AccordionContent>No. Language training and degree admission have separate applications and requirements. Confirm the institute’s term and visa information, then review the degree program’s current academic and language criteria.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-transfer-credit">
              <AccordionTrigger>Will all of my previous university credits transfer?</AccordionTrigger>
              <AccordionContent>No. The receiving university decides transfer eligibility and credit recognition. Ask the target department what transcripts, course descriptions, authentication, and review steps it requires. See <Link className="text-accent underline" to="/admissions/transfer">transfer guidance</Link>.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-gks-status">
              <AccordionTrigger>Are GKS eligibility and deadlines the same in every country?</AccordionTrigger>
              <AccordionContent>No. Country instructions, track, participating universities, and application schedules can differ. Use the current <Link className="text-accent underline" to="/scholarships">official GKS scholarship notices</Link> and the relevant embassy or university guidance.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-visa-change">
              <AccordionTrigger>Does moving from a D-4 language program to a degree automatically change my visa?</AccordionTrigger>
              <AccordionContent>No. A change of status or a new visa process may be necessary. Confirm the procedure for your nationality and circumstances with <a className="text-accent underline" href="https://www.hikorea.go.kr/" target="_blank" rel="noreferrer">Hi Korea</a> and the responsible Korean embassy or immigration authority.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-work">
              <AccordionTrigger>Can I rely on part-time work to pay all study costs?</AccordionTrigger>
              <AccordionContent>No. Work may require prior permission and compliance with visa, school, and language conditions. Do not assume immediate or unrestricted employment; check current official immigration requirements and build a budget without guaranteed work income.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-budget">
              <AccordionTrigger>Are the tuition figures on the site exact university fees?</AccordionTrigger>
              <AccordionContent>No. The budget tool uses official national averages for degree tuition as context and asks you to enter your own living-cost assumptions. Confirm exact fees with the selected university and review the <Link className="text-accent underline" to="/study-in-korea/costs">budget assumptions</Link>.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  )
}

export function ContactPage() {
  const { toast } = useToast()
  const { get } = useContent()
  const contactEmail = get('contact.email').trim() || DEFAULT_CONTACT_EMAIL
  const contactPhone = get('contact.phone').trim() || DEFAULT_CONTACT_PHONE
  const contactAddress = get('contact.address').trim()
  const officeHours = get('contact.hours').trim()
  const verifiedEmail = contactEmail && contactEmail !== 'hello@sanshin.education' ? contactEmail : ''
  const verifiedPhone = contactPhone && !/placeholder|00-0000/i.test(contactPhone) ? contactPhone : ''
  const verifiedAddress = contactAddress && !/placeholder/i.test(contactAddress) ? contactAddress : ''
  const verifiedHours = officeHours && !/Mon–Fri 9:00–18:00 KST/.test(officeHours) ? officeHours : ''
  const facebookUrl = get('social.facebook').trim() || 'https://www.facebook.com/Sanshinglobaleducation/'
  const { register, handleSubmit, reset, formState } = useForm<{
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    intendedIntake?: string
    studyLevel?: string
    interestedUniversityOrSubject?: string
    koreanProficiency?: string
    currentUniversity?: string
    transferInterest?: string
    countryOfResidence?: string
    privacyConsent: boolean
    website: string
  }>()

  return (
    <div>
      <PageHeader title="Contact" description="Questions about studying in South Korea? Send a message or start a lead." />
      <div className="container grid gap-10 py-12 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Message the team</CardTitle></CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={handleSubmit(async (values) => {
                try {
                  await sendFormEmail('contact', {
                    Name: values.name,
                    Email: values.email,
                    Phone: values.phone ?? '',
                    Subject: values.subject,
                    Message: values.message,
                    'Intended intake': values.intendedIntake ?? '',
                    'Study level': values.studyLevel ?? '',
                    'Interested university or subject': values.interestedUniversityOrSubject ?? '',
                    'Korean proficiency': values.koreanProficiency ?? '',
                    'Current university': values.currentUniversity ?? '',
                    'Transfer interest': values.transferInterest ?? '',
                    'Country of residence': values.countryOfResidence ?? '',
                    'Privacy consent': values.privacyConsent ? 'Yes' : 'No',
                    Website: values.website,
                    'Form source': 'contact_page',
                  })
                  toast('Message sent', 'Your message was delivered. We will reply by email.')
                  reset()
                } catch (error) {
                  toast('Unable to send message', error instanceof Error ? error.message : 'Please try again.')
                }
              })}
            >
              <div className="space-y-2"><Label htmlFor="contact-name">Name</Label><Input id="contact-name" required {...register('name', { required: true })} /></div>
              <div className="space-y-2"><Label htmlFor="contact-email">Email</Label><Input id="contact-email" type="email" required {...register('email', { required: true })} /></div>
              <div className="space-y-2"><Label htmlFor="contact-phone">Phone</Label><Input id="contact-phone" {...register('phone')} /></div>
              <div className="space-y-2"><Label htmlFor="contact-subject">Subject</Label><Input id="contact-subject" required {...register('subject', { required: true })} /></div>
              <div className="space-y-2"><Label htmlFor="contact-message">Message</Label><Textarea id="contact-message" required {...register('message', { required: true })} /></div>
              <details className="rounded-lg border px-4">
                <summary className="cursor-pointer py-3 text-sm font-medium">Optional admissions details</summary>
                <div className="grid gap-4 pb-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="contact-intake">Intended intake</Label><Input id="contact-intake" placeholder="e.g. March 2027" {...register('intendedIntake')} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-study-level">Study level</Label><Input id="contact-study-level" placeholder="e.g. undergraduate, master's, language" {...register('studyLevel')} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label htmlFor="contact-university-subject">Interested university or subject</Label><Input id="contact-university-subject" {...register('interestedUniversityOrSubject')} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-korean-level">Korean language proficiency</Label><Input id="contact-korean-level" placeholder="e.g. TOPIK level or beginner" {...register('koreanProficiency')} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-current-university">Current university, if applicable</Label><Input id="contact-current-university" {...register('currentUniversity')} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-transfer-interest">Interested in transfer admission?</Label><Input id="contact-transfer-interest" placeholder="Yes, no, or exploring" {...register('transferInterest')} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-country">Country of residence</Label><Input id="contact-country" autoComplete="country-name" {...register('countryOfResidence')} /></div>
                </div>
              </details>
              <div className="sr-only" aria-hidden="true">
                <Label htmlFor="contact-website">Leave this field empty</Label>
                <Input id="contact-website" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" required {...register('privacyConsent', { required: true })} />
                <span>I agree that Sanshin Global Education may use my information to respond to this inquiry. See the <Link to="/privacy" className="text-accent underline">Privacy Policy</Link>.</span>
              </label>
              <Button type="submit" variant="accent" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Sending…' : 'Send'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Office</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              {verifiedAddress ? <p>{verifiedAddress}</p> : null}
              {verifiedEmail ? <p><a href={`mailto:${verifiedEmail}`}>{verifiedEmail}</a></p> : null}
              {verifiedPhone ? <p><a href={`tel:${verifiedPhone.replace(/[^\d+]/g, '')}`}>{verifiedPhone}</a></p> : null}
              {verifiedHours ? <p>{verifiedHours}</p> : null}
              {!verifiedAddress && !verifiedEmail && !verifiedPhone && !verifiedHours
                ? <p>Use the contact form and our team will reply by email.</p>
                : null}
            </CardContent>
          </Card>
          <img
            src="https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80"
            alt="Seoul cityscape, home to Sanshin Global Education's Korea study guidance"
            className="h-52 w-full rounded-lg object-cover"
            loading="lazy"
          />
          <p className="text-sm text-muted-foreground">For a study-plan inquiry, you can also <Link to="/book-consultation" className="text-accent underline">request a consultation</Link>.</p>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader><CardTitle>Connect With Sanshin Global Education</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">Follow our Facebook page for university admissions information, upcoming intake announcements, scholarship updates, and practical tips for studying in South Korea.</p>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <FacebookMark className="h-4 w-4" /> Follow Us on Facebook <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
      <section className="container pb-12 text-center">
        <h2 className="font-heading text-2xl font-bold">Your Korean Study Journey Starts With a Conversation.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Share your questions and goals; our team can help you identify the official requirements to review next.</p>
      </section>
    </div>
  )
}

export function LegalPage({ type: typeOverride }: { type?: 'privacy' | 'terms' } = {}) {
  const { type } = useParams()
  const { get } = useContent()
  const legalType = typeOverride ?? type
  const key = legalType === 'terms' ? 'legal.terms' : 'legal.privacy'
  const title = legalType === 'terms' ? 'Terms of service' : 'Privacy policy'
  return (
    <div>
      <PageHeader title={title} />
      <div
        className="container prose max-w-3xl py-12 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(get(key)) }}
      />
    </div>
  )
}

export function PrivacyPage() {
  return <LegalPage type="privacy" />
}

export function TermsPage() {
  return <LegalPage type="terms" />
}

export function NotFoundPage() {
  return (
    <div className="container py-24 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">That link does not exist on the Sanshin Global Education site.</p>
      <Button asChild className="mt-6" variant="accent"><Link to="/">Back home</Link></Button>
    </div>
  )
}

export function EligibilityPage() {
  const [step, setStep] = useState(0)
  const { toast } = useToast()
  const { register, handleSubmit, watch, reset, formState } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nationality: '',
      educationLevel: '',
      gpa: '',
      englishScore: '',
      budgetRange: '',
      intendedIntake: '',
      destination: 'South Korea',
      privacyConsent: false,
      website: '',
    },
  })
  const steps = ['Profile', 'Academics', 'Plans']
  const values = watch()

  return (
    <div>
      <PageHeader kicker={`Step ${step + 1} of 3`} title="Eligibility assessment" description="Destination is fixed to South Korea." />
      <div className="container max-w-xl py-12">
        <p className="mb-6 text-sm text-muted-foreground">{steps[step]}</p>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(async (data) => {
            if (step < 2) {
              setStep((s) => s + 1)
              return
            }
            try {
              await sendFormEmail('eligibility', {
                Name: data.name,
                Email: data.email,
                Phone: data.phone,
                Nationality: data.nationality,
                'Highest education': data.educationLevel,
                'Intended intake': data.intendedIntake,
                'GPA / percentage': data.gpa,
                'English score': data.englishScore,
                'Annual budget (KRW)': data.budgetRange,
                Destination: data.destination,
                'Privacy consent': data.privacyConsent ? 'Yes' : 'No',
                Website: data.website,
                'Form source': 'eligibility_assessment',
              })
              toast('Assessment submitted', 'Your assessment was delivered. Our team will follow up by email.')
              setStep(0)
              reset()
            } catch (error) {
              toast('Unable to submit assessment', error instanceof Error ? error.message : 'Please try again.')
            }
          })}
        >
          {step === 0 ? (
            <>
              <div className="space-y-2"><Label>Name</Label><Input required {...register('name', { required: true })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" required {...register('email', { required: true })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input required {...register('phone', { required: true })} /></div>
              <div className="space-y-2"><Label>Nationality</Label><Input required {...register('nationality', { required: true })} /></div>
            </>
          ) : null}
          {step === 1 ? (
            <>
              <div className="space-y-2"><Label>Highest education</Label><Input required {...register('educationLevel', { required: true })} /></div>
              <div className="space-y-2"><Label>GPA / percentage</Label><Input required {...register('gpa', { required: true })} /></div>
              <div className="space-y-2"><Label>English score</Label><Input placeholder="IELTS / TOEFL / Duolingo" required {...register('englishScore', { required: true })} /></div>
            </>
          ) : null}
          {step === 2 ? (
            <>
              <div className="space-y-2"><Label>Destination</Label><Input readOnly value={values.destination} {...register('destination')} /></div>
              <div className="space-y-2"><Label>Intended intake</Label><Input required {...register('intendedIntake', { required: true })} /></div>
              <div className="space-y-2"><Label>Annual budget (KRW)</Label><Input required {...register('budgetRange', { required: true })} /></div>
              <div className="sr-only" aria-hidden="true">
                <Label htmlFor="eligibility-website">Leave this field empty</Label>
                <Input id="eligibility-website" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" required {...register('privacyConsent', { required: true })} />
                <span>I agree that Sanshin Global Education may use my information to assess and respond to this inquiry. See the <Link to="/privacy" className="text-accent underline">Privacy Policy</Link>.</span>
              </label>
            </>
          ) : null}
          <div className="flex gap-2">
            {step > 0 ? <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button> : null}
            <Button type="submit" variant="accent" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Sending…' : step === 2 ? 'Submit assessment' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function BookConsultationPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      type: 'online' as Appointment['type'],
      scheduledAt: '',
      notes: '',
      privacyConsent: false,
      website: '',
    },
  })
  const type = watch('type')

  return (
    <div>
      <PageHeader title="Request a consultation" description="Share a preferred time and our team will contact you to confirm. Submitting this form does not reserve a time." />
      <div className="container max-w-xl py-12">
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              await sendFormEmail('appointment', {
                Name: values.name,
                Email: values.email,
                Phone: values.phone,
                Format: values.type,
                'Preferred time': values.scheduledAt,
                Notes: values.notes,
                'Privacy consent': values.privacyConsent ? 'Yes' : 'No',
                Website: values.website,
                'Form source': 'book_consultation',
              })
            } catch (error) {
              toast('Unable to request consultation', error instanceof Error ? error.message : 'Please try again.')
              return
            }
            toast('Consultation requested', 'Your request was delivered. We will contact you by email to confirm a time.')
            reset({
              name: '',
              email: '',
              phone: '',
              type: 'online',
              scheduledAt: '',
              notes: '',
              privacyConsent: false,
              website: '',
            })
          })}
        >
          <div className="space-y-2"><Label>Name</Label><Input required {...register('name', { required: true })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" required {...register('email', { required: true })} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input {...register('phone')} /></div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={type} onValueChange={(v) => setValue('type', v as Appointment['type'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="in_person">In person</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Preferred time</Label><Input type="datetime-local" required {...register('scheduledAt', { required: true })} /></div>
          <div className="space-y-2"><Label>Notes</Label><Textarea {...register('notes')} /></div>
          <div className="sr-only" aria-hidden="true">
            <Label htmlFor="appointment-website">Leave this field empty</Label>
            <Input id="appointment-website" tabIndex={-1} autoComplete="off" {...register('website')} />
          </div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" required {...register('privacyConsent', { required: true })} />
            <span>I agree that Sanshin Global Education may use my information to respond to this request. See the <Link to="/privacy" className="text-accent underline">Privacy Policy</Link>.</span>
          </label>
          <Button type="submit" variant="accent" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Sending…' : 'Request appointment'}
          </Button>
        </form>
      </div>
    </div>
  )
}
