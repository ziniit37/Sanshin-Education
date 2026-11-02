import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/contexts/ToastProvider'
import { useData, createRecord } from '@/contexts/DataProvider'
import { sendFormEmail } from '@/lib/form-email'
import type { Lead } from '@/lib/types'

interface LeadFields {
  name: string
  email: string
  phone: string
  nationality?: string
  educationLevel?: string
  intendedIntake?: string
  message?: string
}

export function LeadForm({
  source,
  compact = false,
  submitLabel = 'Request counseling',
}: {
  source: string
  compact?: boolean
  submitLabel?: string
}) {
  const { create } = useData()
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState } = useForm<LeadFields>()

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          await sendFormEmail('lead', {
            Name: values.name,
            Email: values.email,
            Phone: values.phone,
            Nationality: values.nationality ?? '',
            'Highest education': values.educationLevel ?? '',
            'Intended intake': values.intendedIntake ?? '',
            Message: values.message ?? '',
            'Lead source': source,
          })
          create(
            'leads',
            createRecord<Omit<Lead, 'id' | 'createdAt'>>({
              ...values,
              stage: 'new_lead',
              leadSource: source,
            }),
          )
          toast('We received your inquiry', 'A counselor will follow up about studying in South Korea.')
          reset()
        } catch (error) {
          toast('Unable to send inquiry', error instanceof Error ? error.message : 'Please try again.')
        }
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${source}-name`}>Full name</Label>
          <Input id={`${source}-name`} required {...register('name', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${source}-email`}>Email</Label>
          <Input id={`${source}-email`} type="email" required {...register('email', { required: true })} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${source}-phone`}>Phone</Label>
          <Input id={`${source}-phone`} required {...register('phone', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${source}-nat`}>Nationality</Label>
          <Input id={`${source}-nat`} {...register('nationality')} />
        </div>
      </div>
      {compact ? null : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${source}-edu`}>Highest education</Label>
            <Input id={`${source}-edu`} placeholder="High school, Bachelor's..." {...register('educationLevel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${source}-intake`}>Intended intake</Label>
            <Input id={`${source}-intake`} placeholder="Fall 2027" {...register('intendedIntake')} />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor={`${source}-msg`}>How can we help?</Label>
        <Textarea id={`${source}-msg`} rows={compact ? 3 : 4} {...register('message')} />
      </div>
      <Button type="submit" variant="accent" disabled={formState.isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
