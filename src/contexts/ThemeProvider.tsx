import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    if (localStorage.getItem('sanshin.theme') === 'dark') setTheme('dark')
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggle: () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.toggle('dark', next === 'dark')
        localStorage.setItem('sanshin.theme', next)
        setTheme(next)
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
