export function getSiteUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  const url = configuredUrl ? new URL(configuredUrl) : new URL(request.url)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.')
  }
  return url.origin
}
