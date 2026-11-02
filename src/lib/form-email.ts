export type FormEmailType = 'lead' | 'contact' | 'eligibility' | 'appointment' | 'newsletter'

export async function sendFormEmail(type: FormEmailType, fields: Record<string, string>) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, fields }),
  })

  const result: unknown = await response.json()
  if (!response.ok) {
    const message =
      typeof result === 'object' && result !== null && 'error' in result && typeof result.error === 'string'
        ? result.error
        : 'Your message could not be delivered. Please try again.'
    throw new Error(message)
  }
}
