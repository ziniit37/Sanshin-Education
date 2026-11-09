import { Resend } from 'resend'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxBodyBytes = 2 * 1024
const rateLimitWindowMs = 15 * 60 * 1000
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function fail(error: string, status: number) {
  return Response.json({ error }, { status })
}

function checkRateLimit(key: string, maxRequests: number, now: number) {
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
  return entry.count > maxRequests ? Math.ceil((entry.resetAt - now) / 1000) : 0
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin) {
    return fail('The reset request could not be verified.', 403)
  }

  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > maxBodyBytes) {
    return fail('The reset request is too large.', 413)
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return fail('The reset request is invalid.', 400)
  }
  if (typeof body !== 'object' || body === null || !('email' in body) || !('token' in body)) {
    return fail('The reset request is invalid.', 400)
  }

  const { email, token } = body
  if (
    typeof email !== 'string'
    || email.length > 254
    || !emailPattern.test(email)
    || typeof token !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)
  ) {
    return fail('The reset request is invalid.', 400)
  }

  const now = Date.now()
  const ip = request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown'
  const ipRetryAfter = checkRateLimit(`ip:${ip}`, 5, now)
  const emailRetryAfter = checkRateLimit(`email:${email.toLowerCase()}`, 3, now)
  const retryAfter = Math.max(ipRetryAfter, emailRetryAfter)
  if (retryAfter > 0) {
    return Response.json(
      { error: 'Too many reset emails requested. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return fail('Password reset email is not configured. Please contact the site administrator.', 503)
  }

  const resetUrl = new URL(`/reset-password?token=${encodeURIComponent(token)}`, request.url).toString()
  const escapedResetUrl = resetUrl.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character] ?? character
  })
  try {
    const resend = new Resend(RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: 'Reset your Sanshin Education password',
      text: `Use this link to reset your password. It expires in 30 minutes:\n\n${resetUrl}\n\nIf you did not request a password reset, you can ignore this email.`,
      html: `<p>Use the link below to reset your password. It expires in 30 minutes.</p><p><a href="${escapedResetUrl}">Reset your password</a></p><p>If you did not request a password reset, you can ignore this email.</p>`,
    })
    if (error) {
      console.error('Resend rejected a password reset email:', error)
      return fail('We could not send your reset email. Please try again shortly.', 502)
    }
  } catch (error) {
    console.error('Resend password reset email failed:', error)
    return fail('We could not send your reset email. Please try again shortly.', 502)
  }

  return Response.json({ success: true })
}
