import { Calendar, Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { useContent } from '@/contexts/SiteContentProvider'

export function FloatingContact() {
  const { get } = useContent()
  const [open, setOpen] = useState(false)
  const phone = get('contact.phone').replace(/\s/g, '')

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {open ? (
        <div className="mb-1 w-56 rounded-lg border bg-card p-3 shadow-lg">
          <p className="mb-2 font-heading text-sm font-semibold">Talk to a counselor</p>
          <div className="grid gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${phone}`}>
                <Phone className="h-4 w-4" /> Call
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${get('contact.email')}`}>
                <Mail className="h-4 w-4" /> Email
              </a>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link to="/book-consultation" onClick={() => setOpen(false)}>
                <Calendar className="h-4 w-4" /> Book a call
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
      <Button size="icon" variant="accent" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setOpen((v) => !v)}>
        <MessageCircle className="h-5 w-5" />
        <span className="sr-only">Contact</span>
      </Button>
    </div>
  )
}
