'use client'

import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation'
import { useEffect, type ComponentProps, type ReactNode } from 'react'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string }

export function Link({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />
}

type NavLinkProps = Omit<LinkProps, 'className' | 'children'> & {
  end?: boolean
  className?: (state: { isActive: boolean }) => string
  children?: ReactNode
}

export function NavLink({ to, end, className, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  return <NextLink href={to} className={className?.({ isActive })} {...props} />
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [router, to, replace])
  return null
}

export function useNavigate() {
  const router = useRouter()
  return (to: string) => router.push(to)
}

export function useSearchParams() {
  return [useNextSearchParams()] as const
}
