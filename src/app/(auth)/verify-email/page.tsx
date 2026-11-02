'use client'

import { Suspense } from 'react'
import { VerifyEmailPage } from '@/views/AuthPages'

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  )
}
