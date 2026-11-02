import { LogOut, Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink } from '@/lib/navigation'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/lib/utils'

export function AppShell({
  links,
  children,
}: {
  links: { to: string; label: string; icon: typeof Moon }[]
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-card p-4 md:flex md:flex-col">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.split('/').length <= 2}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted',
                  isActive && 'bg-accent/10 font-medium text-accent',
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t pt-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{user?.name}</p>
          <p>{user?.role.replace('_', ' ')}</p>
        </div>
      </aside>
      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            View website
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
