import { getSiteUrl } from '@/lib/site-url'
import { PROGRAM_DIRECTORY, UNIVERSITY_DIRECTORY } from '@/lib/university-directory'
import { STUDY_RESOURCES } from '@/lib/study-resources'

export const dynamic = 'force-dynamic'

const publicPaths = [
  '/',
  '/study-in-korea',
  '/study-abroad',
  '/universities',
  '/universities/seoul-national-university',
  '/universities/korea-university',
  '/universities/yonsei-university',
  '/universities/kaist',
  '/programs',
  '/services',
  '/scholarships',
  '/admissions',
  '/admissions/intakes',
  '/admissions/how-to-apply',
  '/admissions/transfer',
  '/admissions/graduate',
  '/programs/korean-language',
  '/study-pathways',
  '/visa-guide',
  '/student-life',
  '/study-in-korea/costs',
  '/eligibility',
  '/book-consultation',
  '/about',
  '/contact',
  '/success-stories',
  '/resources',
  ...UNIVERSITY_DIRECTORY.map((university) => `/universities/${university.slug}`),
  ...PROGRAM_DIRECTORY.map((program) => `/programs/${program.slug}`),
  ...STUDY_RESOURCES.map((resource) => `/resources/${resource.slug}`),
  '/faq',
  '/privacy',
  '/terms',
]

export function GET(request: Request) {
  const siteUrl = getSiteUrl(request)
  const entries = [...new Set(publicPaths)].map((path) => {
    const priority = path === '/' ? '1.0' : '0.7'
    const changeFrequency = path === '/' ? 'weekly' : 'monthly'
    return `<url><loc>${new URL(path, siteUrl).toString()}</loc><changefreq>${changeFrequency}</changefreq><priority>${priority}</priority></url>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
