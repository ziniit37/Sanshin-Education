import { Resend } from 'resend'

const submissionSubjects = {
  lead: 'New counseling inquiry',
  contact: 'New contact message',
  eligibility: 'New eligibility assessment',
  appointment: 'New consultation request',
  newsletter: 'New newsletter subscriber',
} as const

const allowedFields: Record<keyof typeof submissionSubjects, readonly string[]> = {
  lead: [
    'Name', 'Email', 'Phone', 'Country of residence', 'Study level', 'Preferred intake',
    'Privacy consent', 'Website', 'Form source',
  ],
  contact: [
    'Name', 'Email', 'Phone', 'Subject', 'Message', 'Intended intake', 'Study level',
    'Interested university or subject', 'Korean proficiency', 'Current university',
    'Transfer interest', 'Country of residence', 'Privacy consent', 'Website', 'Form source',
  ],
  eligibility: [
    'Name', 'Email', 'Phone', 'Nationality', 'Highest education', 'Intended intake',
    'GPA / percentage', 'English score', 'Annual budget (KRW)', 'Destination', 'Privacy consent',
    'Website', 'Form source',
  ],
  appointment: [
    'Name', 'Email', 'Phone', 'Format', 'Preferred time', 'Notes', 'Privacy consent', 'Website', 'Form source',
  ],
  newsletter: ['Email', 'Privacy consent', 'Website', 'Form source'],
}

const requiredFields: Record<keyof typeof submissionSubjects, readonly string[]> = {
  lead: ['Name', 'Email', 'Country of residence', 'Study level', 'Preferred intake', 'Privacy consent', 'Form source'],
  contact: ['Name', 'Email', 'Subject', 'Message', 'Privacy consent', 'Form source'],
  eligibility: ['Name', 'Email', 'Highest education', 'GPA / percentage', 'Annual budget (KRW)', 'Privacy consent', 'Form source'],
  appointment: ['Name', 'Email', 'Preferred time', 'Privacy consent', 'Form source'],
  newsletter: ['Email', 'Privacy consent', 'Form source'],
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxBodyBytes = 10 * 1024
const rateLimitWindowMs = 15 * 60 * 1000
const rateLimitMax = 5
const rateLimits = new Map<string, { count: number; resetAt: number }>()

const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => entities[character] ?? character)

function fail(error: string, status: number) {
  return Response.json({ error }, { status })
}

function isSubmissionType(type: unknown): type is keyof typeof submissionSubjects {
  return typeof type === 'string' && Object.hasOwn(submissionSubjects, type)
}

function getClientKey(request: Request) {
  return request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown'
}

function checkRateLimit(key: string, now: number) {
  for (const [entryKey, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(entryKey)
  }
  if (rateLimits.size >= 10_000 && !rateLimits.has(key)) {
    const oldestKey = rateLimits.keys().next().value
    if (oldestKey) rateLimits.delete(oldestKey)
  }

  const entry = rateLimits.get(key)
  if (!entry || entry.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + rateLimitWindowMs })
    return 0
  }
  entry.count += 1
  return entry.count > rateLimitMax ? Math.ceil((entry.resetAt - now) / 1000) : 0
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin) {
    let submittedOrigin: URL
    try {
      submittedOrigin = new URL(origin)
    } catch {
      return fail('The form submission could not be verified.', 403)
    }
    if (submittedOrigin.origin !== new URL(request.url).origin) {
      return fail('The form submission could not be verified.', 403)
    }
  }

  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > maxBodyBytes) return fail('The form submission is too large.', 413)

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
  if (!isSubmissionType(type)) return fail('Unsupported form submission.', 400)
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
    return fail('Please check the form and try again.', 400)
  }

  const entries = Object.entries(fields)
  if (
    entries.length === 0
    || entries.length > allowedFields[type].length
    || entries.some(
      ([label, value]) => !allowedFields[type].includes(label)
        || typeof value !== 'string'
        || value.length > 2000,
    )
  ) {
    return fail('Please check the form and try again.', 400)
  }

  const values: Record<string, string> = {}
  for (const [label, value] of entries) {
    if (typeof value !== 'string') return fail('Please check the form and try again.', 400)
    values[label] = value.trim()
  }
  if (values.Website) return fail('The form submission could not be verified.', 400)
  if (requiredFields[type].some((field) => !values[field])) {
    return fail('Please complete all required fields.', 400)
  }
  if (values['Privacy consent'] !== 'Yes') {
    return fail('Please agree to the privacy notice before submitting.', 400)
  }

  const replyTo = values.Email
  if (!emailPattern.test(replyTo) || replyTo.length > 254) {
    return fail('Please enter a valid email address.', 400)
  }
  if (values['Form source'].length > 100) return fail('Please check the form and try again.', 400)

  const retryAfter = checkRateLimit(getClientKey(request), Date.now())
  if (retryAfter > 0) {
    return Response.json(
      { error: 'Too many requests. Please wait a little before trying again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, RESEND_APPOINTMENT_TO_EMAIL } = process.env
  const recipient = type === 'appointment' ? RESEND_APPOINTMENT_TO_EMAIL : RESEND_TO_EMAIL
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !recipient) {
    return fail('Email is not configured yet. Please contact the site administrator.', 503)
  }

  const text = entries.map(([label]) => `${label}: ${values[label] || '(not provided)'}`).join('\n')
  const html = entries
    .map(([label]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(values[label] || '(not provided)')}</p>`)
    .join('')

  try {
    const resend = new Resend(RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: recipient,
      replyTo,
      subject: `Sanshin website: ${submissionSubjects[type]} (${values['Form source']})`,
      text,
      html,
    })
    if (error) {
      console.error(
        `Resend rejected a form email (${error.name}, ${error.statusCode}): ${error.message}`,
      )
      return fail('We could not deliver your message. Please try again shortly.', 502)
    }
  } catch (error) {
    console.error(
      'Resend form email failed:',
      error instanceof Error ? { name: error.name, message: error.message } : String(error),
    )
    return fail('We could not deliver your message. Please try again shortly.', 502)
  }

  return Response.json({ success: true })
}
