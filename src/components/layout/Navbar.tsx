import { Menu, Moon, Sun } from 'lucide-react'
import { Link, NavLink } from '@/lib/navigation'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthProvider'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/lib/utils'

const links = [
  { to: '/study-in-korea', label: 'Study in Korea' },
  { to: '/universities', label: 'Universities' },
  { to: '/programs', label: 'Programs' },
  { to: '/services', label: 'Services' },
  { to: '/scholarships', label: 'Scholarships' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
]

function NavItems({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onClick}
          className={({ isActive }) =>
            cn(
              'text-sm font-medium transition-colors hover:text-accent',
              isActive ? 'text-accent' : 'text-foreground/80',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

export function Navbar() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-4 xl:flex">
          <NavItems />
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button asChild variant="outline" size="sm">
              <Link to={user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/portal'}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden 2xl:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link to="/book-consultation">Book a Consultation</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-4 pt-12">
              <NavItems />
              <Button asChild variant="accent">
                <Link to="/book-consultation">Book a Consultation</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
