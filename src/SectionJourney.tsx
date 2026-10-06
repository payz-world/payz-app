import { ArrowUpRight, Check, Coins, Search, ShieldCheck } from 'lucide-react';
import PayzBrandText from './PayzBrandText';

const journeySteps = [
  { number: '01', title: 'Choose what you need', description: 'Browse products and services available through Payz, from shopping and entertainment to travel and everyday tools.', Icon: Search },
  { number: '02', title: 'Choose how to pay', description: 'Select a supported blockchain and payment asset for your purchase.', Icon: Coins },
  { number: '03', title: 'Send crypto', description: 'Send the checkout amount from your external wallet to your dedicated Payz payment destination.', Icon: ArrowUpRight },
  { number: '04', title: 'Payz processes payment', description: 'Payz confirms and settles the payment separately from product fulfillment.', Icon: ShieldCheck },
  { number: '05', title: 'Receive your purchase', description: 'Your product, subscription, redemption details, or download is delivered through Payz.', Icon: Check },
];

function JourneyStep({ step }: { step: (typeof journeySteps)[number] }) {
  const { number, title, description, Icon } = step;
  return (
    <li className="landing-step-card" data-testid={`journey-step-${number}`}>
      <div className="landing-step-top">
        <span className="landing-step-number">{number}</span>
        <Icon className="landing-step-icon" aria-hidden="true" />
      </div>
      <h3><PayzBrandText text={title} /></h3>
      <p><PayzBrandText text={description} /></p>
    </li>
  );
}

export default function SectionJourney() {
  return (
    <section className="landing-steps-section" aria-labelledby="payz-journey-title">
      <div className="landing-section-inner">
        <div className="landing-steps-heading">
          <h2 id="payz-journey-title">From Crypto to a Real-World Purchase</h2>
          <p>Choose what you want, pay with crypto, and receive your completed purchase through <PayzBrandText text="Payz" />.</p>
        </div>
        <ol className="landing-steps-list" aria-label="Five steps from choosing a product to receiving it">
          {journeySteps.map((step) => <JourneyStep key={step.number} step={step} />)}
        </ol>
      </div>
    </section>
  );
}
