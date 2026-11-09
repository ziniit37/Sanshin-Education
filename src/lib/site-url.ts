export function getSiteUrl(_request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sanshineducation.com'
  const url = new URL(configuredUrl)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.')
  }
  return url.origin
}
