import { BriefcaseBusiness, Clapperboard, Dumbbell, Gamepad2, Heart, Plane, ShoppingBag, Utensils } from 'lucide-react';
import { Link } from 'wouter';
import type { Product } from 'payz-sdk';
import LandingBrandMark, { hasLandingProductArtwork, landingProductBrand } from './LandingBrandMark';
import PayzBrandText from './PayzBrandText';

const categoryItems = [
  { id: 'shopping', title: 'Shopping', description: 'Retail, clothing, electronics, and everyday essentials.', Icon: ShoppingBag },
  { id: 'food-beverage', title: 'Food & Beverage', description: 'Restaurants, food delivery, groceries, and coffee.', Icon: Utensils },
  { id: 'entertainment', title: 'Entertainment', description: 'Streaming, music, film, and digital media.', Icon: Clapperboard },
  { id: 'gaming', title: 'Gaming', description: 'Games, platforms, credits, and subscriptions.', Icon: Gamepad2 },
  { id: 'sports', title: 'Sports', description: 'Sports services, events, and merchandise.', Icon: Dumbbell },
  { id: 'travel', title: 'Travel', description: 'Accommodation, transport, and mobility.', Icon: Plane },
  { id: 'lifestyle', title: 'Lifestyle', description: 'Personal care, fashion, and experiences.', Icon: Heart },
  { id: 'services', title: 'Services', description: 'Digital tools and everyday services.', Icon: BriefcaseBusiness },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="landing-showcase-card"
      href={`/app/product/${encodeURIComponent(product.id)}`}
      aria-label={`View ${landingProductBrand(product)} in the payz catalog`}
      data-testid={`landing-product-${product.id}`}
    >
      <LandingBrandMark product={product} size="large" />
      <span>{landingProductBrand(product)}</span>
    </Link>
  );
}

const spotlightBrands = ['Amazon', 'Netflix', 'Uber', 'Adidas', 'Claude', 'Apple', 'Steam', 'NordVPN', 'Google Play', 'Airbnb'];

function normalizedBrand(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function featuredCatalogProducts(products: Product[]) {
  const used = new Set<string>();
  const featured = spotlightBrands
    .map((brand) => {
      const target = normalizedBrand(brand);
      return products.find(product => normalizedBrand(landingProductBrand(product)) === target)
        || products.find(product => normalizedBrand(landingProductBrand(product)).startsWith(target));
    })
    .filter((product): product is Product => {
      if (!product || used.has(product.id) || !hasLandingProductArtwork(product)) return false;
      used.add(product.id);
      return true;
    });
  for (const product of products) {
    if (featured.length >= 10) break;
    if (used.has(product.id) || !hasLandingProductArtwork(product)) continue;
    used.add(product.id);
    featured.push(product);
  }
  return featured.slice(0, 10);
}

function ProductShowcase({ products, loading, error }: { products: Product[]; loading: boolean; error: boolean }) {
  const featured = featuredCatalogProducts(products);
  if (loading) {
    return <div className="landing-showcase-list landing-showcase-list-loading" aria-label="Loading payz catalog products" aria-busy="true">
      {Array.from({ length: 10 }, (_, index) => <span className="landing-showcase-skeleton" key={index} />)}
    </div>;
  }
  if (error) {
    return <p className="landing-catalog-status" role="status">
      Product examples are temporarily unavailable. <Link href="/app">Browse the <PayzBrandText text="Payz" /> catalog</Link>.
    </p>;
  }
  if (!featured.length) {
    return <p className="landing-catalog-status" role="status">
      There are no products to feature right now. <Link href="/app">Browse the <PayzBrandText text="Payz" /> catalog</Link>.
    </p>;
  }
  return <div className="landing-showcase-list" aria-label="Products available in the payz catalog">
    {featured.map(product => <ProductCard key={product.id} product={product} />)}
  </div>;
}

function CategoryCard({ item }: { item: (typeof categoryItems)[number] }) {
  const { title, description, Icon } = item;
  return (
    <Link className="landing-category-card" href={`/app?category=${encodeURIComponent(item.id)}`} data-testid={`real-category-${item.id}`}>
      <Icon className="landing-category-icon" aria-hidden="true" />
      <span className="landing-category-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
    </Link>
  );
}

export default function SectionRealWorld({ products, loading, error }: { products: Product[]; loading: boolean; error: boolean }) {
  return (
    <>
      <section className="landing-showcase-section" aria-labelledby="real-world-title">
        <div className="landing-section-inner">
          <div className="landing-showcase-heading">
          <h2 id="real-world-title">Spend Crypto on the Things You Already Use.</h2>
          <p>
            Use crypto for everyday products, services, subscriptions, and experiences—selected from the <PayzBrandText text="Payz" /> catalog.
          </p>
        </div>
          <ProductShowcase products={products} loading={loading} error={error} />
          <Link className="landing-showcase-browse" href="/app">Browse all products</Link>
        </div>
      </section>
      <section className="landing-categories-section" aria-labelledby="landing-categories-title">
        <div className="landing-section-inner">
          <div className="landing-categories-heading">
            <h2 id="landing-categories-title">Explore by category</h2>
            <p>Find products for the things you already do.</p>
          </div>
          <div className="landing-categories-grid" aria-label="Spending categories">
            {categoryItems.map(item => <CategoryCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>
    </>
  );
}
