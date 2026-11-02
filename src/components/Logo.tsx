import { Link } from '@/lib/navigation'
import { useContent } from '@/contexts/SiteContentProvider'
import { cn } from '@/lib/utils'

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { get } = useContent()
  return (
    <Link to="/" className={cn('flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
          <path d="M8 21L16 8L24 21H8Z" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.2" />
          <path d="M12 21L16 14L20 21" fill="none" stroke="hsl(var(--gold))" strokeWidth="1.8" />
        </svg>
      </span>
      {compact ? null : (
        <span className="leading-tight">
          <span className="block font-heading text-sm font-bold">{get('brand.name')}</span>
          <span className="block text-[11px] text-muted-foreground">Study in Korea</span>
        </span>
      )}
    </Link>
  )
}
