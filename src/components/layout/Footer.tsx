import { Link } from '@/lib/navigation'
import { Logo } from '@/components/Logo'
import { useContent } from '@/contexts/SiteContentProvider'

export function Footer() {
  const { get } = useContent()
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
            <li><Link to="/study-abroad/south-korea">South Korea</Link></li>
            <li><Link to="/universities">Universities</Link></li>
            <li><Link to="/scholarships">Scholarships</Link></li>
            <li><Link to="/success-stories">Success stories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/legal/privacy">Privacy</Link></li>
            <li><Link to="/legal/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li>{get('contact.email')}</li>
            <li>{get('contact.phone')}</li>
            <li>{get('contact.address')}</li>
            <li>{get('contact.hours')}</li>
          </ul>
          <div className="mt-3 flex gap-3 text-sm">
            <a href={get('social.instagram')}>Instagram</a>
            <a href={get('social.linkedin')}>LinkedIn</a>
            <a href={get('social.facebook')}>Facebook</a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {get('brand.name')}. Korea study pathway consultancy.
      </div>
    </footer>
  )
}
