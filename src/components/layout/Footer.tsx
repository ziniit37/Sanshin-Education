import { Link } from '@/lib/navigation'
import { Logo } from '@/components/Logo'
import { useContent } from '@/contexts/SiteContentProvider'
import { DEFAULT_CONTACT_EMAIL, DEFAULT_CONTACT_PHONE } from '@/lib/content-defaults'

function displayContact(value: string) {
  const normalized = value.trim()
  if (
    !normalized
    || /placeholder|00-0000/i.test(normalized)
    || normalized === 'hello@sanshin.education'
    || normalized === 'Mon–Fri 9:00–18:00 KST'
  ) return ''
  return normalized
}

export function Footer() {
  const { get } = useContent()
  const email = displayContact(get('contact.email') || DEFAULT_CONTACT_EMAIL)
  const phone = displayContact(get('contact.phone') || DEFAULT_CONTACT_PHONE)
  const address = displayContact(get('contact.address'))
  const hours = displayContact(get('contact.hours'))
  const socialLinks = [
    ['Instagram', get('social.instagram')],
    ['LinkedIn', get('social.linkedin')],
    ['Facebook', get('social.facebook')],
  ].filter(([, url]) => /^https?:\/\//i.test(url))

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Logo className="[&_span]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70" />
          <p className="text-sm text-primary-foreground/70">{get('brand.tagline')}</p>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li><Link to="/study-in-korea">Study in Korea</Link></li>
            <li><Link to="/universities">Universities</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/scholarships">Scholarships</Link></li>
            <li><Link to="/student-life">Student life</Link></li>
            <li><Link to="/resources">Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            {email ? <li><a href={`mailto:${email}`}>{email}</a></li> : null}
            {phone ? <li><a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a></li> : null}
            {address ? <li>{address}</li> : null}
            {hours ? <li>{hours}</li> : null}
            {!email && !phone && !address && !hours ? <li><Link to="/contact">Use the contact form</Link></li> : null}
          </ul>
          {socialLinks.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {socialLinks.map(([label, url]) => (
                <li key={label}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {get('brand.name')}. Korea study pathway consultancy.
      </div>
    </footer>
  )
}
