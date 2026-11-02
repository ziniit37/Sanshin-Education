import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const publicPaths = [
  '/',
  '/study-in-korea',
  '/universities',
  '/universities/seoul-national-university',
  '/universities/korea-university',
  '/universities/yonsei-university',
  '/universities/kaist',
  '/programs',
  '/services',
  '/scholarships',
  '/admissions',
  '/visa-guidance',
  '/student-life',
  '/cost-of-living',
  '/about',
  '/contact',
  '/resources',
  '/resources/gks-vs-university-scholarships',
  '/resources/d2-student-visa-documents',
  '/resources/language-program-or-degree',
  '/resources/korean-university-application-calendar',
  '/resources/student-budget-checklist-south-korea',
  '/resources/understanding-global-korea-scholarship',
  '/faq',
  '/privacy',
  '/terms',
]

export function GET(request: Request) {
  const siteUrl = getSiteUrl(request)
  const entries = publicPaths.map((path) => {
    const priority = path === '/' ? '1.0' : '0.7'
    const changeFrequency = path === '/' ? 'weekly' : 'monthly'
    return `<url><loc>${new URL(path, siteUrl).toString()}</loc><changefreq>${changeFrequency}</changefreq><priority>${priority}</priority></url>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
