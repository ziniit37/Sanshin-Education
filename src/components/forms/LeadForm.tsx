'use client'

import { useForm } from 'react-hook-form'
import { Link } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/contexts/ToastProvider'
import { sendFormEmail } from '@/lib/form-email'

interface LeadFields {
  name: string
  email: string
  phone: string
  countryOfResidence: string
  studyLevel: string
  preferredIntake: string
  privacyConsent: boolean
  website: string
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="text-sm text-destructive" role="alert">{message}</p> : null
}

const selectClassName =
  'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function LeadForm({
  source,
  compact = false,
  submitLabel = 'Get my study plan',
}: {
  source: string
  compact?: boolean
  submitLabel?: string
}) {
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState } = useForm<LeadFields>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      countryOfResidence: '',
      studyLevel: '',
      preferredIntake: '',
      privacyConsent: false,
      website: '',
    },
  })

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        try {
          await sendFormEmail('lead', {
            Name: values.name,
            Email: values.email,
            Phone: values.phone,
            'Country of residence': values.countryOfResidence,
            'Study level': values.studyLevel,
            'Preferred intake': values.preferredIntake,
            'Privacy consent': values.privacyConsent ? 'Yes' : 'No',
            Website: values.website,
            'Form source': source,
          })
          toast('Inquiry received', 'Your message was delivered. Our team will follow up by email.')
          reset()
        } catch (error) {
          toast('Unable to send inquiry', error instanceof Error ? error.message : 'Please try again.')
        }
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${source}-name`}>Full name <span aria-hidden="true">*</span></Label>
          <Input
            id={`${source}-name`}
            autoComplete="name"
            aria-invalid={Boolean(formState.errors.name)}
            aria-describedby={formState.errors.name ? `${source}-name-error` : undefined}
            {...register('name', { required: 'Enter your name.' })}
          />
          <FieldError id={`${source}-name-error`} message={formState.errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${source}-email`}>Email address <span aria-hidden="true">*</span></Label>
          <Input
            id={`${source}-email`}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(formState.errors.email)}
            aria-describedby={formState.errors.email ? `${source}-email-error` : undefined}
            {...register('email', {
              required: 'Enter your email address.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
            })}
          />
          <FieldError id={`${source}-email-error`} message={formState.errors.email?.message} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${source}-phone`}>WhatsApp / phone <span className="text-muted-foreground">(optional)</span></Label>
          <Input id={`${source}-phone`} type="tel" autoComplete="tel" {...register('phone')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${source}-country`}>Country of residence <span aria-hidden="true">*</span></Label>
          <Input
            id={`${source}-country`}
            autoComplete="country-name"
            aria-invalid={Boolean(formState.errors.countryOfResidence)}
            aria-describedby={formState.errors.countryOfResidence ? `${source}-country-error` : undefined}
            {...register('countryOfResidence', { required: 'Enter your country of residence.' })}
          />
          <FieldError id={`${source}-country-error`} message={formState.errors.countryOfResidence?.message} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${source}-level`}>Interested study level <span aria-hidden="true">*</span></Label>
          <select
            id={`${source}-level`}
            className={selectClassName}
            aria-invalid={Boolean(formState.errors.studyLevel)}
            aria-describedby={formState.errors.studyLevel ? `${source}-level-error` : undefined}
            {...register('studyLevel', { required: 'Choose a study level.' })}
          >
            <option value="">Choose a level</option>
            <option value="Korean Language Program">Korean Language Program</option>
            <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
            <option value="Master's Degree">Master&apos;s Degree</option>
            <option value="PhD">PhD</option>
            <option value="Not Sure Yet">Not Sure Yet</option>
          </select>
          <FieldError id={`${source}-level-error`} message={formState.errors.studyLevel?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${source}-intake`}>Preferred intake <span aria-hidden="true">*</span></Label>
          <select
            id={`${source}-intake`}
            className={selectClassName}
            aria-invalid={Boolean(formState.errors.preferredIntake)}
            aria-describedby={formState.errors.preferredIntake ? `${source}-intake-error` : undefined}
            {...register('preferredIntake', { required: 'Choose an intake preference.' })}
          >
            <option value="">Choose an intake</option>
            <option value="Spring">Spring</option>
            <option value="Fall">Fall</option>
            <option value="Flexible / Not Sure">Flexible / Not Sure</option>
          </select>
          <FieldError id={`${source}-intake-error`} message={formState.errors.preferredIntake?.message} />
        </div>
      </div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <Label htmlFor={`${source}-website`}>Leave this field empty</Label>
        <Input
          id={`${source}-website`}
          className="h-px w-px p-0"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>
      <div className="space-y-1">
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-input accent-accent"
            aria-invalid={Boolean(formState.errors.privacyConsent)}
            aria-describedby={formState.errors.privacyConsent ? `${source}-consent-error` : undefined}
            {...register('privacyConsent', { required: 'Please agree before sending your inquiry.' })}
          />
          <span>
            I agree that Sanshin Global Education may use my information to respond to this inquiry. See the{' '}
            <Link to="/privacy" className="text-accent underline underline-offset-2">Privacy Policy</Link>.
            {' '}<span aria-hidden="true">*</span>
          </span>
        </label>
        <FieldError id={`${source}-consent-error`} message={formState.errors.privacyConsent?.message} />
      </div>
      <Button type="submit" variant="accent" disabled={formState.isSubmitting} className={compact ? 'w-full' : undefined}>
        {formState.isSubmitting ? 'Sending…' : submitLabel}
      </Button>
      <p className="text-xs text-muted-foreground">Fields marked * are required. We only use these details to respond to your inquiry.</p>
    </form>
  )
}
