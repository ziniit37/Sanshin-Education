import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const siteUrl = getSiteUrl(request)
  const text = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /portal/',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /reset-password',
    `Sitemap: ${new URL('/sitemap.xml', siteUrl).toString()}`,
  ].join('\n')
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
