import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import '@/index.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sanshineducation.com'),
  title: {
    default: 'Sanshin Global Education | Study in South Korea',
    template: '%s | Sanshin Global Education',
  },
  description:
    'Sanshin Global Education helps international students study in South Korea — university admissions, scholarships, visas, and pre-departure support.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sanshin Global Education',
    title: 'Sanshin Global Education | Study in South Korea',
    description:
      'Explore Korean universities, programs, scholarships, and practical guidance for studying in South Korea.',
    images: [{ url: '/images/seoul-skyline.jpg', alt: 'Seoul skyline, South Korea' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanshin Global Education | Study in South Korea',
    description:
      'Explore Korean universities, programs, scholarships, and practical guidance for studying in South Korea.',
    images: ['/images/seoul-skyline.jpg'],
  },
  icons: { icon: '/favicon.svg' },
}

const themeScript = `try{if(localStorage.getItem('sanshin.theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`
const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Sanshin Global Education',
  url: 'https://www.sanshineducation.com/',
  email: 'sanjidahmed0902@gmail.com',
  telephone: '+82 10-2185-8650',
  sameAs: ['https://www.facebook.com/Sanshinglobaleducation/'],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
