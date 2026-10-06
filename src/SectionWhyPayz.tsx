import { CheckCircle2 } from 'lucide-react';
import PayzBrandText from './PayzBrandText';

export default function SectionWhyPayz() {
  return (
    <section className="landing-story-section" aria-labelledby="landing-why-title">
      <div className="landing-section-inner landing-story-layout">
        <div className="landing-story-copy">
          <h2 id="landing-why-title">Why <PayzBrandText text="Payz" /> Exists</h2>
          <h3>Everyday payments should not require unnecessary exposure of your financial activity.</h3>
          <p>
            Public blockchains make transactions verifiable, but a purchase does not need to expose
            every link between a person’s wallet history and what they buy.
          </p>
          <p>
            <PayzBrandText text="Payz" /> separates who pays from what gets purchased. Zero-knowledge technology, privacy-preserving
            routing, and settlement separation create a privacy boundary around everyday spending.
          </p>
        </div>
        <div className="landing-story-visual">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85"
            alt="A warmly lit restaurant dining room"
            loading="eager"
            fetchPriority="high"
          />
          <div className="landing-story-payment-card">
            <span className="landing-story-check"><CheckCircle2 aria-hidden="true" /></span>
            <div>
              <strong>Payment completed</strong>
              <span>The purchase moves through its own private <PayzBrandText text="Payz" /> context.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
