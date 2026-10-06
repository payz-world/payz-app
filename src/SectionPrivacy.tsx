import { KeyRound, Layers3, PackageCheck, Wallet } from 'lucide-react';
import PayzBrandText from './PayzBrandText';

const privacyFeatures = [
  {
    title: 'Fresh Payment Destinations',
    description: 'Each checkout receives a dedicated payment destination, separate from the purchase itself.',
    Icon: Wallet,
  },
  {
    title: 'Privacy-Preserving Routing',
    description: 'Payz routes payment through a privacy boundary between the public wallet and the purchase.',
    Icon: KeyRound,
  },
  {
    title: 'Settlement Separation',
    description: 'Payment settlement and product fulfillment remain distinct stages of the flow.',
    Icon: Layers3,
  },
  {
    title: 'Minimal Information',
    description: 'Each stage receives the information it needs to complete its part of the purchase.',
    Icon: PackageCheck,
  },
];

export default function SectionPrivacy() {
  return (
    <section className="landing-zk-section" aria-labelledby="landing-zk-title">
      <div className="landing-section-inner landing-zk-layout">
        <div className="landing-zk-copy">
          <h2 id="landing-zk-title">Why Zero-Knowledge Technology Matters for Spending</h2>
          <p>
            Zero-knowledge technology lets <PayzBrandText text="Payz" /> verify that a payment meets checkout requirements
            without revealing every detail behind that proof.
          </p>
          <p>
            <PayzBrandText text="Payz" /> uses ZK as part of its privacy architecture. It separates who pays from what gets
            purchased through privacy-preserving payment routing and settlement.
          </p>
        </div>
        <div className="landing-zk-features">
          {privacyFeatures.map(({ title, description, Icon }) => (
            <article className="landing-zk-feature" key={title}>
              <Icon aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p><PayzBrandText text={description} /></p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
