import { ArrowDown, ArrowRight, CheckCircle2, PackageCheck, RefreshCw, ShieldCheck, Store, Wallet } from 'lucide-react';
import PayzBrandText from './PayzBrandText';

const paymentFlow = [
  { title: 'Your Crypto Wallet', description: 'You choose the asset and network.', Icon: Wallet },
  { title: 'Payz Payment Destination', description: 'A dedicated destination receives the payment.', Icon: Store },
  { title: 'Privacy-Preserving Routing', description: 'Payz separates payment source from purchase.', Icon: ShieldCheck },
  { title: 'Settlement', description: 'The payment is confirmed for the next stage.', Icon: RefreshCw },
  { title: 'Real-World Purchase', description: 'Payz places the selected product order.', Icon: PackageCheck },
  { title: 'Your Purchase', description: 'Your product or redemption details are delivered.', Icon: CheckCircle2 },
];

export default function SectionPaymentFlow() {
  return (
    <section className="landing-payment-section" aria-labelledby="landing-payment-title">
      <div className="landing-section-inner">
        <h2 id="landing-payment-title">From a Private Restaurant Payment to Everyday Crypto Spending</h2>
        <p className="landing-payment-intro">
          <PayzBrandText text="Payz" /> creates a privacy-preserving path from your crypto payment to the product you choose.
        </p>
        <ol className="landing-payment-flow" aria-label="How a payz payment moves to a real-world purchase">
          {paymentFlow.map(({ title, description, Icon }, index) => (
            <li className="landing-payment-step" key={title}>
              <span className="landing-payment-icon"><Icon aria-hidden="true" /></span>
              <div>
                <h3><PayzBrandText text={title} /></h3>
                <p><PayzBrandText text={description} /></p>
              </div>
              {index < paymentFlow.length - 1 && <ArrowRight className="landing-payment-arrow" aria-hidden="true" />}
              {index < paymentFlow.length - 1 && <ArrowDown className="landing-payment-down" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
