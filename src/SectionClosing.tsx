import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import PayzLogo from './PayzLogo';
import PayzBrandText from './PayzBrandText';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Products', href: '/app' },
      { label: 'Rewards', href: '/app/rewards' },
      { label: 'How it works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'Documentation home', href: '/docs' },
      { label: 'API reference', href: '/docs/api' },
      { label: 'Privacy architecture', href: '/docs/privacy-model' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About payz', href: '/about' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function SectionClosing() {
  return (
    <>
      <section className="landing-cta-section" aria-labelledby="landing-final-title">
        <div className="landing-section-inner landing-cta-inner">
          <div>
            <h2 id="landing-final-title">Crypto should be useful in the real world.</h2>
            <p>
              Choose a product, pay with crypto, and receive your purchase through <PayzBrandText text="Payz" />.
            </p>
          </div>
          <div className="landing-cta-actions">
            <Link className="landing-cta-primary" href="/app">Start Spending <ArrowRight aria-hidden="true" /></Link>
            <Link className="landing-cta-secondary" href="/app/rewards">Explore Rewards</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-section-inner landing-footer-inner">
          <div className="landing-footer-brand">
            <Link href="/" className="landing-footer-mark" aria-label="payz home">
              <PayzLogo className="landing-footer-logo" />
              <span>payz</span>
            </Link>
            <p>Private payments for real-life everyday needs.</p>
          </div>
          <div className="landing-footer-groups">
            {footerGroups.map(group => (
              <div className="landing-footer-group" key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map(link => (
                    <li key={link.href}><Link href={link.href}><PayzBrandText text={link.label} /></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="landing-footer-bottom">
            <span>© {new Date().getFullYear()} <PayzBrandText text="Payz" /></span>
            <span>Products and denominations vary by region.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
