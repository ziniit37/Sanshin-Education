import type { ReactNode } from 'react'
import { Logo } from '@/components/Logo'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden bg-primary p-10 text-primary-foreground md:flex md:flex-col">
        <Logo className="[&_span]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70" />
        <div className="mt-auto max-w-md">
          <p className="font-heading text-3xl font-bold">A clearer path to Korean universities.</p>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Track applications, documents, and counseling in one student portal — South Korea only.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
