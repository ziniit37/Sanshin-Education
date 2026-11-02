'use client'

import { Suspense } from 'react'
import { ResetPasswordPage } from '@/views/AuthPages'

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  )
}
