import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { CONTENT_DEFAULTS } from '@/lib/content-defaults'
import { useData } from '@/contexts/DataProvider'

interface SiteContentContextValue {
  get: (key: string, fallback?: string) => string
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

const defaultsMap = Object.fromEntries(CONTENT_DEFAULTS.map((item) => [item.key, item.value]))
const oldBrandName = 'Sanshin Education'
const brandName = 'Sanshin Global Education'

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { db } = useData()
  const map = useMemo(() => {
    const next = { ...defaultsMap }
    db?.siteContent.forEach((item) => {
      next[item.key] = item.value.replaceAll(oldBrandName, brandName)
    })
    return next
  }, [db])

  const value = useMemo<SiteContentContextValue>(
    () => ({
      get: (key, fallback = '') => map[key] ?? fallback,
    }),
    [map],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useContent must be used within SiteContentProvider')
  return ctx
}
