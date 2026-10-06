import { Link } from 'wouter';
import PayzBrandText from './PayzBrandText';
import './privacy-content.css';

const flow = [
  'Your external wallet',
  'A fresh Payz payment destination',
  'Payz Privacy Router',
  'Zero-knowledge privacy infrastructure',
  'Payz Settlement Layer',
  'Payz Purchase Engine',
  'Payz Fulfillment Engine',
  'Payz Delivery Layer',
];
const pairs: [string, string][] = [
  ['The wallet that sends payment', 'The product purchase Payz fulfills'],
  ['The source payment context', 'The downstream purchase context'],
  ['Public network activity', 'Protected access to purchase details'],
];

export default function PrivacyContent() {
  return (
    <div className="pvx-page" data-testid="page-privacy">
      <header className="pvx-hero">
        <h1><PayzBrandText text="How Payz Separates Payment From Purchase" /></h1>
        <p><PayzBrandText text="Payz separates who pays from what gets purchased. A customer pays from an external wallet to a fresh Payz payment destination; Payz then routes and settles that payment before beginning the separate product purchase and fulfillment process." /></p>
      </header>

      <section className="pvx-section">
        <h2>The payment begins in your external wallet</h2>
        <p><PayzBrandText text="Customers use a wallet or exchange they already control to send the selected asset on the network shown at checkout. Payz does not ask them to connect that wallet to the app. The wallet initiates the payment, while Payz creates and manages the purchase flow that follows." /></p>
        <p><PayzBrandText text="The public network records transactions according to its own rules. Payz keeps the product selection and fulfillment process in its purchase system rather than placing those details in the payment transaction itself." /></p>
      </section>

      <section className="pvx-section">
        <h2>Each purchase receives its own payment destination</h2>
        <p><PayzBrandText text="When a customer confirms checkout, Payz creates a purchase order and prepares a dedicated payment destination for that purchase. The destination lets Payz associate an incoming payment with the correct order without asking the customer to reuse a permanent deposit address. Customers should send only the exact asset and amount shown for that checkout, on the specified network." /></p>
        <ol className="pvx-flow">
          {flow.map(f => <li key={f} className={f.includes('Router') ? 'pvx-router' : undefined}><PayzBrandText text={f} /></li>)}
        </ol>
        <div className="pvx-caption">
          <p className="pvx-strong"><PayzBrandText text="Payz receives and processes the payment before it initiates the downstream purchase." /></p>
          <p>The customer's source wallet does not directly submit the final product order. This creates separate payment and purchase contexts while preserving the public record of the source-chain transaction.</p>
        </div>
      </section>

      <section className="pvx-section">
        <h2><PayzBrandText text="Payz routes the payment before the purchase is fulfilled" /></h2>
        <p><PayzBrandText text="After the destination receives a transfer, Payz detects it and checks that the payment satisfies the order requirements. Detection is an intermediate step: Payz confirms the payment and routes it through the Payz Privacy Router before settlement. A detected transfer alone does not mean that the product has been purchased or that delivery is ready." /></p>
        <p><PayzBrandText text="The Payz Privacy Router separates the incoming payment from the downstream purchase process. Payz uses zero-knowledge technology as part of its privacy architecture to minimize unnecessary information disclosure between public wallet activity and real-world purchases. Public blockchain activity remains visible according to the network’s rules." /></p>
      </section>

      <section className="pvx-section">
        <h2>Settlement separates payment processing from fulfillment</h2>
        <p><PayzBrandText text="Settlement is the stage where Payz confirms that the routed payment has reached the configured Payz settlement layer and that the value required for the order is available for the next step. Settlement is separate from detecting the customer's original transfer, so the two events are tracked as different parts of the purchase lifecycle." /></p>
        <p><PayzBrandText text="Once settlement is confirmed, the Payz Purchase Engine can begin the product purchase. The Payz Fulfillment Engine then processes the result and prepares the product information for protected delivery. If a stage is still processing or needs review, Payz should not present the purchase as ready." /></p>
        <div className="pvx-layers">
          <div className="pvx-layer">
            <h3>Source payment context</h3>
            <ul><li>Sending wallet</li><li>Asset and network</li><li>Transaction amount</li><li>Public transaction record</li></ul>
          </div>
          <div className="pvx-layer pvx-private">
            <h3><PayzBrandText text="Payz purchase context" /></h3>
            <ul><li>Product and region</li><li>Purchase processing</li><li>Fulfillment result</li><li>Protected delivery</li></ul>
          </div>
        </div>
      </section>

      <section className="pvx-section">
        <h2><PayzBrandText text="Why zero-knowledge technology matters to Payz" /></h2>
        <p><PayzBrandText text="Payz uses zero-knowledge technology as part of its privacy architecture. It enables required payment conditions to be verified without disclosing every underlying detail, helping separate the public payment source from the real-world purchase." /></p>
        <p><PayzBrandText text="This privacy layer works alongside fresh payment destinations, Payz Privacy Routing, settlement separation, and protected delivery. Public blockchain transactions remain visible according to the network’s rules." /></p>
      </section>

      <section className="pvx-section">
        <h2>The purchase is fulfilled separately from the source wallet</h2>
        <p><PayzBrandText text="After settlement, Payz processes the selected product through the Payz Purchase Engine and Payz Fulfillment Engine. Depending on the product, the result may be a redemption code, PIN, link, instructions or another purchase artifact. These are delivery formats for a real-world product or service, not the whole definition of what Payz enables." /></p>
        <p><PayzBrandText text="Each stage has its own status. Payz keeps the customer-facing purchase details within the order and fulfillment flow, while the source wallet remains the wallet used to fund the payment." /></p>
      </section>

      <section className="pvx-section">
        <h2>Protected access keeps purchase information in the delivery flow</h2>
        <p><PayzBrandText text="When fulfillment is ready, Payz provides an individual secure purchase page. Customers can reveal the details that are available for their order, copy or open them where supported, and download a PDF when the purchase includes downloadable information. The page is protected and time-limited; it is not a permanent customer order-history feature." /></p>
        <p>Access controls are intended to keep purchase details available to the customer for the specific fulfillment flow, rather than publishing them as part of a blockchain transaction.</p>
        <div className="pvx-principles">
          <div className="pvx-principle"><h3>Use a wallet you control</h3><p>Send from an external wallet or exchange without connecting it to the <PayzBrandText text="Payz" /> app.</p></div>
          <div className="pvx-principle"><h3>Keep each checkout distinct</h3><p>A fresh <PayzBrandText text="Payz" /> payment destination is prepared for the specific purchase after checkout.</p></div>
          <div className="pvx-principle"><h3>Access fulfillment securely</h3><p>Purchase details become available through the protected delivery flow after the required processing is complete.</p></div>
        </div>
      </section>

      <section className="pvx-section">
        <h2>What remains visible on the underlying blockchain</h2>
        <p><PayzBrandText text="Public networks continue to record transactions according to their own design. Depending on the network, observers may be able to see information such as a sending address, destination address, asset, amount and transaction time. Payz does not remove or rewrite those records." /></p>
        <div className="pvx-seen"><span>Your external wallet</span><i>→</i><span>Public network payment</span><i>→</i><span>Fresh <PayzBrandText text="Payz" /> destination</span></div>
        <p><PayzBrandText text="The product selection, fulfillment result and protected delivery details are handled in the Payz purchase flow. The privacy boundary is the separation between those purchase details and the customer's source payment, not a claim that the source transaction disappears." /></p>
      </section>

      <section className="pvx-section">
        <h2><PayzBrandText text="How Payz separates the source payment from the purchase" /></h2>
        <ul className="pvx-pairs">
            {pairs.map(([a, b]) => <li key={a}><span><PayzBrandText text={a} /></span><em>and</em><span><PayzBrandText text={b} /></span></li>)}
        </ul>
        <p><PayzBrandText text="Payz separates who pays from what gets purchased by receiving the payment, routing and settling it through Payz's payment infrastructure, and beginning fulfillment only afterward. Each layer has a defined role, and the secure delivery page presents the purchase information only when it is ready." /></p>
      </section>

      <section className="pvx-section">
        <h2>The <PayzBrandText text="Payz" /> privacy boundary</h2>
        <p><PayzBrandText text="Payz uses zero-knowledge technology, fresh payment destinations, and protected delivery to separate the source payment from the real-world purchase and minimize unnecessary disclosure. Public network records remain verifiable according to the rules of the network." /></p>
      </section>

      <section className="pvx-cta">
        <h2><PayzBrandText text="Use crypto to purchase real-world products through Payz" /></h2>
        <div className="pvx-actions">
          <Link href="/app" className="pvx-btn pvx-btn-primary" data-testid="link-privacy-start">Start Spending</Link>
          <Link href="/" className="pvx-btn pvx-btn-secondary" data-testid="link-privacy-explore">Explore <PayzBrandText text="Payz" /></Link>
        </div>
      </section>
    </div>
  );
}
