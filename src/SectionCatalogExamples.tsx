import { useMemo } from 'react';
import { Link } from 'wouter';
import type { Product } from 'payz-sdk';
import LandingBrandMark, { landingProductBrand } from './LandingBrandMark';
import PayzBrandText from './PayzBrandText';

const productGroups = [
  { id: 'food-beverage', title: 'Food & Beverage', category: 'food-beverage', brands: ["McDonald's", 'Auchan', 'Carrefour', 'DoorDash'] },
  { id: 'shopping', title: 'Shopping', category: 'shopping', brands: ['Amazon', 'Apple', 'Adidas', 'Target'] },
  { id: 'entertainment', title: 'Entertainment', category: 'entertainment', brands: ['Netflix', 'Rakuten TV'] },
  { id: 'gaming', title: 'Gaming', category: 'gaming', brands: ['Steam', 'Google Play', 'PlayStation Store', 'Roblox'] },
  { id: 'travel', title: 'Travel & Mobility', category: 'travel', brands: ['Uber', 'Airbnb', 'Uber Rides', 'Uber Money'] },
];

function normalizedBrand(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function ExampleCard({ product }: { product: Product }) {
  const name = landingProductBrand(product);
  return (
    <Link className="landing-example-card" href={`/app/product/${encodeURIComponent(product.id)}`} data-testid={`landing-example-${product.id}`}>
      <LandingBrandMark product={product} />
      <span>{name}</span>
    </Link>
  );
}

export default function SectionCatalogExamples({ products, loading, error }: { products: Product[]; loading: boolean; error: boolean }) {
  const groups = useMemo(() => productGroups
    .map(group => ({
      ...group,
      products: group.brands
        .map(brand => products.find(product =>
          product.categoryId === group.category &&
            normalizedBrand(landingProductBrand(product)) === normalizedBrand(brand),
        ))
        .filter((product): product is Product => Boolean(product)),
    }))
    .filter(group => group.products.length > 0), [products]);

  return (
    <section className="landing-examples-section" aria-labelledby="landing-examples-title">
      <div className="landing-section-inner landing-examples-inner">
        <h2 id="landing-examples-title">One Crypto Payment. Something You Can Actually Use.</h2>
        <p className="landing-examples-intro">
          Put crypto to work on products, services, subscriptions, and experiences in the <PayzBrandText text="Payz" /> catalog.
        </p>
        {loading ? (
          <div className="landing-examples-loading" role="status" aria-live="polite">Loading products from the <PayzBrandText text="Payz" /> catalog…</div>
        ) : error ? (
          <p className="landing-catalog-status" role="status">
            Product examples are temporarily unavailable. <Link href="/app">Browse the <PayzBrandText text="Payz" /> catalog</Link>.
          </p>
        ) : groups.length ? (
          <div
            className="landing-examples-groups"
            role="list"
            aria-label="Product categories"
            aria-describedby="landing-examples-scroll-hint"
            tabIndex={0}
          >
            {groups.map(group => (
              <article className="landing-example-group" role="listitem" key={group.id} aria-labelledby={`landing-example-group-${group.id}`}>
                <h3 id={`landing-example-group-${group.id}`}>{group.title}</h3>
                <div className="landing-example-grid">
                  {group.products.map(product => <ExampleCard key={product.id} product={product} />)}
                </div>
                <Link className="landing-example-browse" href={`/app?category=${encodeURIComponent(group.category)}`}>Browse category</Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="landing-catalog-status" role="status">
            There are no catalog products to feature right now. <Link href="/app">Browse the <PayzBrandText text="Payz" /> catalog</Link>.
          </p>
        )}
        {groups.length > 0 && <p className="landing-examples-scroll-hint" id="landing-examples-scroll-hint">Swipe or scroll horizontally to explore categories.</p>}
        <p className="landing-examples-note">Examples come from the current <PayzBrandText text="Payz" /> catalog. Product availability varies by region.</p>
      </div>
    </section>
  );
}
