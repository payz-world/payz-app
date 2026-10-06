import { Link, useLocation } from 'wouter';
import { ArrowDownRight, ArrowRight, Check, Compass, CreditCard, Globe2, LockKeyhole, PackageCheck, ScanSearch, WalletCards } from 'lucide-react';
import PayzLogo from '../../PayzLogo';
import PayzBrandText from '../../PayzBrandText';
import './marketing-pages.css';

const flow = [
  { title: 'Browse the catalog', body: 'Start by exploring the products and services shown in Payz. Catalog information helps you compare what is available before checkout; browsing does not create an order or reserve a product.', icon: Compass },
  { title: 'Select a product', body: 'Open the product you want and review its description, available purchase values, and any instructions shown on the product page. The product displayed at checkout is the one Payz will use for the purchase flow.', icon: ScanSearch },
  { title: 'Select a region when required', body: 'Some products are offered for a specific country or region. Choose the region where the product is intended to be used; a broad browsing view is not itself a valid fulfillment destination.', icon: Globe2 },
  { title: 'Choose an available denomination', body: 'Select one of the real purchase values listed for the product and region. Payz uses the catalog value shown to calculate the customer total, and does not create an unlisted denomination.', icon: CreditCard },
  { title: 'Choose the payment network', body: 'Select a network available for the purchase. The network is part of the payment instruction, so the transfer must be sent on the exact network displayed during checkout.', icon: Globe2 },
  { title: 'Choose a supported payment asset', body: 'Select an asset that Payz currently shows as available for the chosen network and purchase amount. A catalog entry identifies an asset, while the current availability result determines whether that exact route can be used.', icon: Check },
  { title: 'Review the purchase', body: 'Before proceeding, check the product, region, denomination, customer total, network, and payment asset. This review gives you a chance to correct the selection before Payz creates a purchase order.', icon: ScanSearch },
  { title: 'Create the purchase at checkout', body: 'Checkout is the explicit action that creates the order. Payz revalidates product eligibility and payment availability at that moment, then prepares the payment instructions if the current conditions allow the purchase to continue.', icon: ArrowRight },
  { title: 'Receive a fresh Payz payment destination', body: 'After checkout succeeds, Payz provides a destination dedicated to that purchase, together with the required network, asset, and exact amount. This destination associates the incoming payment with the specific order; it is not a reusable deposit address.', icon: ArrowDownRight },
  { title: 'Send payment from an external wallet', body: 'Use a wallet or exchange you control to send the exact requested amount on the stated network. Payz does not require you to connect the wallet to the app, and a transfer sent on a different network may not satisfy the payment instruction.', icon: WalletCards },
  { title: 'Payz detects the incoming payment', body: 'Payz monitors the payment destination for the expected transfer and updates the order when incoming activity is detected. Detection means that a transfer has been observed; it does not mean that all payment checks or settlement are complete.', icon: ScanSearch },
  { title: 'Payz confirms the payment', body: 'Payz checks the incoming transfer against the order details and waits for the required confirmation conditions. The order remains in progress until this stage is complete, so the product should not yet be presented as ready.', icon: Check },
  { title: 'Payz routes the payment', body: 'The Payz Privacy Router processes the confirmed payment before Payz begins the downstream product purchase. Routing separates the source payment context from the purchase process; it does not remove the public record created by the original network transaction.', icon: ArrowDownRight },
  { title: 'Payz settles the payment', body: 'Settlement is the stage where Payz verifies that routed value has reached the configured settlement layer and is available for the purchase. Keeping settlement distinct from payment detection gives Payz a clear checkpoint before fulfillment starts.', icon: Check },
  { title: 'Payz begins purchase fulfillment', body: 'After settlement is confirmed, the Payz Purchase Engine initiates the selected product purchase and the Payz Fulfillment Engine processes the result. Depending on the product, fulfillment may return a code, PIN, link, instructions, or another delivery format.', icon: PackageCheck },
  { title: 'The purchase becomes ready', body: 'Payz marks a purchase ready only after the required payment, settlement, purchase, and delivery checks have completed. If processing needs more time or review, the status should communicate that the purchase is still in progress.', icon: Check },
  { title: 'Access the purchase securely', body: 'When the purchase is ready, open its individual protected delivery page to view or reveal the information supplied for that order. The available actions may include copying a code, opening a link, following instructions, or downloading a PDF when one is provided.', icon: LockKeyhole },
];

const faq = [
  { q: 'How does Payz separate a payment from a purchase?', a: 'Payz gives each checkout a dedicated payment destination, processes the incoming payment through the Payz Privacy Router and settlement layer, and begins product fulfillment afterward. This separates who pays from what gets purchased; protected delivery then makes the fulfilled details available for the specific order.' },
  { q: 'What does zero-knowledge technology do in Payz?', a: 'Payz uses zero-knowledge technology as part of its privacy architecture to verify required payment conditions while minimizing unnecessary disclosure between public wallet activity and real-world purchases. Public blockchain transactions remain visible according to the network’s rules.' },
  { q: 'Is Payz a wallet?', a: 'No. Payz coordinates the purchase flow but does not provide wallet functionality. Customers send from an external wallet or exchange they choose, and no wallet connection to the Payz app is required.' },
  { q: 'Does checking availability start a payment?', a: 'No. The amount-specific availability check is read-only and does not create an order or payment destination. Payz prepares those details only after the customer chooses Checkout and the current product and route checks succeed.' },
  { q: 'Why might an asset appear but not be selectable?', a: 'The payment catalog lists configured networks and assets, while checkout availability is checked for the selected product amount. A catalog entry can therefore be visible even when the corresponding payment route is not currently available for that amount.' },
  { q: 'When can I access the purchase details?', a: 'The protected delivery page becomes available after Payz has confirmed the payment, completed settlement, processed the product purchase, and marked delivery ready. The page presents the information returned for that order and may offer reveal, copy, link, or download actions.' },
  { q: 'How do I return to my purchase details?', a: 'Each purchase has its own protected delivery page. Use that page to follow progress and access the product-specific redemption details when delivery is ready.' },
  { q: 'Does every purchase contain a redemption code?', a: 'No. The information depends on the product. Fulfillment may provide a redemption code, PIN, link, instructions, or another purchase artifact, and the secure page displays the format available for that order.' },
  { q: 'Where can I find help with a purchase?', a: 'Open the protected purchase page to review its payment status, delivery progress, and product-specific instructions.' },
];

function PublicHeader() {
  return <header className="public-nav">
    <Link href="/" className="public-logo-link" aria-label="payz home" data-testid="link-public-home"><PayzLogo decorative /><span className="public-logo-word">payz</span></Link>
    <nav className="public-nav-links" aria-label="Public navigation">
      <Link href="/how-it-works" data-testid="link-how-it-works-nav">How it works</Link>
      <Link href="/docs" data-testid="link-docs-nav">Developers</Link>
      <Link href="/app" className="public-nav-cta" data-testid="link-explore-nav">Explore products <ArrowRight aria-hidden="true" size={13} /></Link>
    </nav>
  </header>;
}

function PublicFooter() {
  return <footer className="public-footer">
    <div className="public-footer-inner">
      <div className="public-footer-brand"><PayzLogo decorative /><span><PayzBrandText text="Payz · Payment and purchase privacy infrastructure for real-world products" /></span></div>
      <nav className="public-footer-links" aria-label="Company pages">
        <Link href="/about" data-testid="link-about-footer">About</Link>
        <Link href="/privacy" data-testid="link-privacy-footer">Privacy</Link>
        <Link href="/terms" data-testid="link-terms-footer">Terms</Link>
        <Link href="/contact" data-testid="link-contact-footer">Contact</Link>
        <Link href="/docs" data-testid="link-docs-footer">Documentation</Link>
      </nav>
    </div>
  </footer>;
}

export function HowItWorksPage() {
  return <div className="payz-public-page" data-testid="page-how-it-works">
    <PublicHeader />
    <main>
      <section className="how-hero">
        <div className="how-hero-inner">
          <h1><PayzBrandText text="How Payz Separates Your Payment From the Purchase You Make" /></h1>
          <p><PayzBrandText text="Payz helps customers use cryptocurrency to obtain real-world products and services without connecting a wallet to the app. The payment begins in an external wallet, reaches a fresh Payz payment destination, passes through Payz routing and settlement, and is followed by a separate purchase and fulfillment process. This page explains each stage and what customers should expect before sending funds." /></p>
        </div>
      </section>
      <div className="how-content">
        <section className="how-intro-row" aria-label="A note about how payz works">
          <h2>From an external wallet to protected purchase delivery</h2>
          <p><PayzBrandText text="Payz is a purchase and payment flow rather than a wallet. You choose a product, region, denomination, network, and supported asset, then review the total before checkout. A read-only availability check can report whether a route appears usable, but it does not create an order or destination. Only the explicit Checkout action performs fresh validation and, if successful, creates the purchase and its dedicated Payz payment destination. Payz detects and confirms the incoming payment, routes and settles it, then begins fulfillment. The source wallet does not directly submit the final product order." /></p>
        </section>
        <section className="flow-section" aria-labelledby="flow-title">
          <div className="flow-heading">
            <h2 id="flow-title"><PayzBrandText text="The complete Payz purchase journey, from browsing to delivery" /></h2>
            <p><PayzBrandText text="Each step has a distinct purpose. Browsing and availability checks do not reserve a product; a detected transfer is not the same as confirmed payment; and confirmed payment does not mean that fulfillment is already ready. Payz keeps these states separate so the customer can see what has happened and what remains before the purchase can be accessed." /></p>
          </div>
          <div className="flow-grid">
            {flow.map((step, index) => {
              const Icon = step.icon;
              return <article className="flow-step" key={step.title} data-testid={`card-flow-step-${index + 1}`}>
                <div className="flow-step-top"><span className="flow-number">{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /></div>
                <h3><PayzBrandText text={step.title} /></h3><p><PayzBrandText text={step.body} /></p>
              </article>;
            })}
          </div>
        </section>
        <section className="privacy-band" aria-labelledby="privacy-band-title">
          <h2 id="privacy-band-title"><PayzBrandText text="Payz separates who pays from what gets purchased" /></h2>
          <div>
            <p><PayzBrandText text="For each checkout, Payz prepares a fresh payment destination and handles the incoming payment through the Payz Privacy Router and settlement layer before starting product fulfillment. Payz uses zero-knowledge technology as part of its privacy architecture to minimize unnecessary disclosure between payment processing and the downstream purchase context. Customers receive fulfilled information through an individual protected delivery flow after the purchase is ready." /></p>
            <p><PayzBrandText text="Public networks record transactions according to their own rules. Payz’s privacy model creates a boundary between payment and purchase while protecting access to fulfillment details and minimizing unnecessary disclosure." /></p>
          </div>
        </section>
        <section className="faq-section" aria-labelledby="faq-title">
          <h2 id="faq-title">Questions, plainly answered</h2>
          <div className="faq-grid">
            {faq.map(item => <article className="faq-item" key={item.q} data-testid={`faq-${item.q.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
              <h3><PayzBrandText text={item.q} /></h3><p><PayzBrandText text={item.a} /></p>
            </article>)}
          </div>
        </section>
      </div>
    </main>
    <PublicFooter />
  </div>;
}

type PublicInfoKey = 'about' | 'privacy' | 'terms' | 'contact';
type InfoSection = { title: string; body: string };
type InfoPage = { title: string; lead: string; sections: InfoSection[] };
const infoContent: Record<PublicInfoKey, InfoPage> = {
  about: {
    title: 'How Payz Turns a Crypto Payment Into a Real-World Purchase',
    lead: 'Payz is a payment and purchase platform for using cryptocurrency to obtain real-world products and services. Customers browse the Payz catalog, select a product and payment option, send funds from an external wallet to a fresh Payz payment destination, and receive the fulfilled purchase through a protected delivery flow.',
    sections: [
      { title: 'Payz coordinates the purchase rather than acting as a wallet', body: 'Customers use an external wallet or exchange they already control and do not need to connect it to the Payz app. Payz manages the product selection, payment instructions, order state, settlement checks, purchase processing, and delivery access needed to complete the purchase.' },
      { title: 'A fresh destination begins each checkout', body: 'After a customer reviews the selection and chooses Checkout, Payz revalidates the product and the selected payment route. When checkout succeeds, Payz provides a payment destination dedicated to that purchase, together with the asset, network, and exact amount required. Browsing or checking availability does not create that destination.' },
      { title: 'Payment and purchase move through separate stages', body: 'Payz detects and confirms the incoming payment, routes it through the Payz Privacy Router, and verifies settlement before starting product fulfillment. The Payz Purchase Engine and Payz Fulfillment Engine then process the selected product. This structure separates the source wallet payment from the downstream purchase context.' },
      { title: 'Zero-knowledge infrastructure supports information separation', body: 'Payz uses zero-knowledge infrastructure to verify required conditions while minimizing unnecessary information disclosure between payment processing and purchase fulfillment. These techniques support the separation between payment and purchase stages; public blockchain transactions remain visible according to their network rules.' },
      { title: 'Product information comes from the Payz catalog', body: 'The storefront presents product and regional information, actual denominations, artwork, and availability from the catalog data available to Payz. A product can require a specific region, and a payment asset shown in the catalog is not automatically available for every product amount.' },
      { title: 'Protected delivery completes the experience', body: 'After settlement and fulfillment are complete, Payz makes the information returned for the purchase available through an individual protected page. Depending on the product, the page may provide a code, PIN, link, instructions, or a downloadable file. Access is associated with the specific purchase rather than a permanent customer order-history screen.' },
    ],
  },
  privacy: {
    title: 'How Payz Separates Payment From Purchase',
    lead: 'Payz separates who pays from what gets purchased. A customer sends cryptocurrency from an external wallet to a fresh Payz payment destination. Payz routes and settles the payment, initiates a separate real-world purchase, and protects access to the resulting delivery information.',
    sections: [
      { title: 'The payment begins with your external wallet', body: 'You send the selected cryptocurrency from a wallet or exchange you control, using the network and amount shown by Payz. Payz does not require you to connect that wallet to the app. The public network records the transaction according to its own rules, while the product choice and fulfillment information are managed in the Payz purchase flow.' },
      { title: 'Each purchase receives its own payment destination', body: 'When you explicitly check out, Payz creates the purchase order and prepares a dedicated payment destination for it. This lets Payz associate an incoming transfer with the intended purchase without asking customers to reuse a permanent deposit address. The destination marks the first boundary between the source wallet payment and the Payz purchase context.' },
      { title: 'Payz routes the payment before fulfillment', body: 'After the destination receives a transfer, Payz detects and confirms the payment against the order. The Payz Privacy Router processes the confirmed payment before Payz starts the downstream product purchase. Availability checks remain read-only; only checkout creates a purchase and its payment destination.' },
      { title: 'Zero-knowledge technology strengthens the privacy boundary', body: 'Payz uses zero-knowledge infrastructure as part of its privacy architecture to minimize unnecessary information disclosure between payment and purchase contexts. These techniques verify required conditions without exposing every underlying detail behind that verification, strengthening the separation between stages while public network activity remains visible.' },
      { title: 'Settlement separates payment processing from fulfillment', body: 'Settlement is the stage where Payz confirms that routed value has reached the configured Payz settlement layer and is available for the purchase. It is different from detecting the source transfer: detection reports incoming activity, confirmation checks the payment against the order, and settlement verifies the value required before fulfillment begins.' },
      { title: 'The purchase is fulfilled separately from the source wallet', body: 'After settlement, the Payz Purchase Engine initiates the selected product purchase and the Payz Fulfillment Engine processes the result. The customer’s original wallet does not directly submit the final product order. Fulfillment may provide a code, PIN, link, instructions, or another product-specific artifact.' },
      { title: 'Purchase information is delivered through protected access', body: 'When a purchase is ready, Payz provides an individual secure page for its fulfillment details. Depending on the product, customers may reveal information, copy a code, open a redemption link, follow instructions, or download a PDF. Access is protected and time-limited, and it is not a permanent customer order-history feature.' },
      { title: 'Some transaction details remain visible on the underlying blockchain', body: 'Public networks continue to record transactions according to their design. Observers may be able to see information such as the source and destination addresses, asset, amount, and transaction time. Payz does not remove or rewrite those records; the privacy boundary concerns the separation of payment and purchase contexts and the protection of delivery details.' },
      { title: 'How Payz protects privacy', body: 'Payz uses zero-knowledge infrastructure, fresh payment destinations, privacy-preserving routing and protected delivery to separate payment from purchase and minimize unnecessary disclosure around everyday purchases. Public network records remain verifiable according to their own rules.' },
    ],
  },
  terms: {
    title: 'How Product, Payment, and Fulfillment Conditions Are Handled',
    lead: 'Review how product selection, payment, settlement, and delivery work before completing a Payz purchase.',
    sections: [
      { title: 'Product selection and availability', body: 'Products, regions, and denominations shown in Payz depend on the current catalog. Payment availability is checked for the selected product amount, network, and asset; a catalog entry alone does not guarantee that checkout can proceed. Payz repeats the relevant checks when the customer explicitly chooses Checkout.' },
      { title: 'Payment, settlement, and purchase status', body: 'A transfer reported as detected is not necessarily confirmed, and payment confirmation is separate from settlement. Payz begins fulfillment after the required settlement checks are complete. Customers should follow the status and payment instructions shown for their specific order and should not send funds to a destination that Payz has not issued for that checkout.' },
      { title: 'Delivery formats and access', body: 'The information supplied after fulfillment depends on the product and may include a redemption code, PIN, link, instructions, or a downloadable file. Each purchase has its own protected delivery page with the information and actions for that product.' },
    ],
  },
  contact: {
    title: 'Help With Your Payz Purchase',
    lead: 'Use the protected purchase page to review payment status, delivery progress, and the instructions for receiving your product.',
    sections: [
      { title: 'Follow a purchase', body: 'Each purchase has its own protected page. Check its payment and delivery status there, then follow the product-specific steps to reveal, copy, open, download, or redeem the delivered item.' },
      { title: 'Understand payment progress', body: 'Payment detection, confirmation, settlement, and fulfillment are separate stages. Follow the latest status shown for the purchase and use only the payment instructions created for that checkout.' },
      { title: 'Keep delivery details private', body: 'Codes, PINs, private links, and purchase files can carry value. Store them securely and share them only with the service that needs them to redeem the product.' },
    ],
  },
};

export function PublicInfoPage() {
  const [location] = useLocation();
  const routeKey = location.replace(/\/+$/, '').split('/').pop() as PublicInfoKey;
  const key: PublicInfoKey = routeKey in infoContent ? routeKey : 'about';
  const content = infoContent[key];
  return <div className="payz-public-page" data-testid={`page-public-${key}`}>
    <PublicHeader />
    <main className="public-info-wrap">
      <article className="public-info-panel">
       <h1><PayzBrandText text={content.title} /></h1>
       <p className="public-info-lede"><PayzBrandText text={content.lead} /></p>
        {content.sections.map((section, index) => <section className="public-info-section" key={section.title} data-testid={`section-public-${key}-${index}`}>
          <h2><PayzBrandText text={section.title} /></h2><p><PayzBrandText text={section.body} /></p>
        </section>)}
      </article>
    </main>
    <PublicFooter />
  </div>;
}
