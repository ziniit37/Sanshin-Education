import { Badge } from '@/components/ui/badge'
import { labelize } from '@/lib/utils'

const warning = new Set(['closing_soon', 'pending', 'under_review', 'revision_required', 'contacted'])
const success = new Set(['open', 'approved', 'confirmed', 'completed', 'enrolled', 'offer_received'])
const danger = new Set(['closed', 'cancelled', 'lost_inactive'])

export function StatusBadge({ value }: { value: string }) {
  const variant = warning.has(value) ? 'warning' : success.has(value) ? 'success' : danger.has(value) ? 'destructive' : 'secondary'
  return <Badge variant={variant}>{labelize(value)}</Badge>
}
