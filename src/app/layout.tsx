import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import '@/index.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Sanshin Education | Study in South Korea',
    template: '%s | Sanshin Education',
  },
  description:
    'Sanshin Education helps international students study in South Korea — university admissions, scholarships, visas, and pre-departure support.',
  icons: { icon: '/favicon.svg' },
}

const themeScript = `try{if(localStorage.getItem('sanshin.theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
