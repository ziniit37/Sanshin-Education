import { Resend } from 'resend'

const submissionSubjects = {
  lead: 'New counseling inquiry',
  contact: 'New contact message',
  eligibility: 'New eligibility assessment',
  appointment: 'New consultation request',
  newsletter: 'New newsletter subscriber',
} as const
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxBodyBytes = 10 * 1024

const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => entities[character] ?? character)

function fail(error: string, status: number) {
  return Response.json({ error }, { status })
}

export async function POST(request: Request) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL } = process.env
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !RESEND_TO_EMAIL) {
    return fail('Email is not configured yet. Please contact the site administrator.', 503)
  }

  const raw = await request.text()
  if (raw.length > maxBodyBytes) return fail('The form submission is too large.', 413)

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return fail('The form submission is invalid.', 400)
  }
  if (typeof body !== 'object' || body === null || !('type' in body) || !('fields' in body)) {
    return fail('Please check the form and try again.', 400)
  }

  const { type, fields } = body
  if (typeof type !== 'string' || !Object.hasOwn(submissionSubjects, type)) {
    return fail('Unsupported form submission.', 400)
  }
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
    return fail('Please check the form and try again.', 400)
  }

  const entries = Object.entries(fields)
  if (
    entries.length === 0 ||
    entries.length > 12 ||
    entries.some(
      ([label, value]) => !/^[\w /-]{1,50}$/.test(label) || typeof value !== 'string' || value.length > 2000,
    )
  ) {
    return fail('Please check the form and try again.', 400)
  }

  const replyTo = entries.find(([label]) => label.toLowerCase() === 'email')?.[1]
  if (typeof replyTo !== 'string' || !emailPattern.test(replyTo) || replyTo.length > 254) {
    return fail('Please enter a valid email address.', 400)
  }

  const text = entries.map(([label, value]) => `${label}: ${value || '(not provided)'}`).join('\n')
  const html = entries
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value || '(not provided)')}</p>`)
    .join('')

  try {
    const resend = new Resend(RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: RESEND_TO_EMAIL,
      replyTo,
      subject: `Sanshin website: ${submissionSubjects[type as keyof typeof submissionSubjects]}`,
      text,
      html,
    })
    if (error) {
      console.error('Resend rejected a form email:', error)
      return fail('We could not deliver your message. Please try again shortly.', 502)
    }
  } catch (error) {
    console.error('Resend form email failed:', error)
    return fail('We could not deliver your message. Please try again shortly.', 502)
  }

  return Response.json({ success: true })
}
