import Link from 'next/link'
import { ArrowUpRight, BookOpen, Compass, ShieldCheck } from 'lucide-react'

const APP_URL = process.env.NEXT_PUBLIC_APP_HOST
  ? `https://${process.env.NEXT_PUBLIC_APP_HOST}`
  : 'https://app.udyamveda.in'

const navItems = [
  { href: '/schemes', label: 'Schemes' },
  { href: '/resources', label: 'Resources' },
  { href: '/government', label: 'Government' },
  { href: '/insights', label: 'Insights' },
  { href: '/methodology', label: 'Methodology' },
]

export function BrandMark() {
  return (
    <Link href="/" className="vv-brand" aria-label="Udyam Veda home">
      <span className="vv-brand-mark" aria-hidden="true"><span>V</span></span>
      <span><strong>Udyam</strong><em>Veda</em></span>
    </Link>
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="vv-site min-h-screen">
      <header className="vv-header">
        <div className="vv-container vv-header-inner">
          <BrandMark />
          <nav className="vv-nav" aria-label="Primary navigation">
            {navItems.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <a href={`${APP_URL}/login`} className="vv-header-cta">Open the app <ArrowUpRight size={15} /></a>
        </div>
      </header>
      <main>{children}</main>
      <footer className="vv-footer">
        <div className="vv-container vv-footer-grid">
          <div>
            <BrandMark />
            <p className="vv-footer-copy">Clearer paths through India’s business ecosystem.</p>
          </div>
          <div>
            <p className="vv-footer-label">Explore</p>
            <Link href="/resources">Resource library</Link>
            <Link href="/government">Government portals</Link>
            <Link href="/insights">Market intelligence</Link>
          </div>
          <div>
            <p className="vv-footer-label">Learn</p>
            <Link href="/blogs">Blogs & guides</Link>
            <Link href="/news">News & updates</Link>
            <Link href="/methodology">Our methodology</Link>
          </div>
          <div className="vv-footer-note">
            <ShieldCheck size={18} />
            <p>Every source is dated and linked. Official authorities remain the final source for eligibility and application decisions.</p>
          </div>
        </div>
        <div className="vv-container vv-footer-bottom"><span>© 2026 Udyam Veda</span><span>Built for founders, operators, and local businesses.</span></div>
      </footer>
    </div>
  )
}

export function SectionEyebrow({ children, icon: Icon = Compass }: { children: React.ReactNode; icon?: typeof Compass }) {
  return <p className="vv-eyebrow"><Icon size={15} /> {children}</p>
}

export function ResourceTypeIcon() {
  return <span className="vv-type-icon" aria-hidden="true"><BookOpen size={16} /></span>
}
