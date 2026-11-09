import { Calendar, Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { useContent } from '@/contexts/SiteContentProvider'
import { DEFAULT_CONTACT_EMAIL, DEFAULT_CONTACT_PHONE } from '@/lib/content-defaults'

export function FloatingContact() {
  const { get } = useContent()
  const [open, setOpen] = useState(false)
  const savedPhone = get('contact.phone').trim() || DEFAULT_CONTACT_PHONE
  const savedEmail = get('contact.email').trim() || DEFAULT_CONTACT_EMAIL
  const phone = /placeholder|00-0000/i.test(savedPhone) ? '' : savedPhone.replace(/\s/g, '')
  const email = savedEmail === 'hello@sanshin.education' ? '' : savedEmail

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden flex-col items-end gap-2 sm:flex">
      {open ? (
        <div className="mb-1 w-56 rounded-lg border bg-card p-3 shadow-lg">
          <p className="mb-2 font-heading text-sm font-semibold">Talk to a counselor</p>
          <div className="grid gap-2">
            {phone ? (
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${phone}`}><Phone className="h-4 w-4" /> Call</a>
              </Button>
            ) : null}
            {email ? (
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${email}`}><Mail className="h-4 w-4" /> Email</a>
              </Button>
            ) : null}
            <Button asChild variant="accent" size="sm">
              <Link to="/book-consultation" onClick={() => setOpen(false)}>
                <Calendar className="h-4 w-4" /> Book a call
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
      <Button
        size="icon"
        variant="accent"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close contact options' : 'Open contact options'}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  )
}
