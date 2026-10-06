import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Product } from 'payz-sdk';
import { SiClaude } from 'react-icons/si';
import { brandAssetUrl, getBrandArtwork } from './brand-artwork';

export function landingProductBrand(product: Product): string {
  const clean = (value: string) => value
    .replace(/\b(?:bitrefill|gift[\s-]*cards?|giftcards?|vouchers?)\b/gi, '')
    .replace(/\s+via\s+PPQ\.ai\b.*$/i, '')
    .replace(/\s*[:|–—-]\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return clean(product.brand || '') || clean(product.name) || 'Product';
}

export function hasLandingProductArtwork(product: Product): boolean {
  const artwork = getBrandArtwork(landingProductBrand(product), product.logoKey || '');
  const brand = landingProductBrand(product).toLowerCase();
  return Boolean(brand === 'claude' || artwork.Icon);
}

export default function LandingBrandMark({
  product,
  size = 'regular',
}: {
  product: Product;
  size?: 'regular' | 'large';
}) {
  const brand = landingProductBrand(product);
  const artwork = getBrandArtwork(brand, product.logoKey || '');
  const BrandIcon = brand.toLowerCase() === 'claude' ? SiClaude : artwork.Icon;
  const primaryImage = artwork.asset ? brandAssetUrl(artwork.asset) : null;
  const fallbackImage = product.image || null;
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const image = BrandIcon ? null : [primaryImage, fallbackImage].find(
    (source): source is string => Boolean(source && !failedImages.includes(source)),
  );

  useEffect(() => setFailedImages([]), [primaryImage, fallbackImage]);

  return (
    <span
      className={`landing-brand-mark landing-brand-mark-${size}`}
      style={{ '--brand-color': artwork.background, '--logo-color': artwork.color } as CSSProperties}
      role="img"
      aria-label={`${brand} logo`}
    >
      {image ? (
        <img src={image} alt="" loading={size === 'large' ? 'eager' : 'lazy'} onError={() => setFailedImages(values => [...values, image])} />
      ) : BrandIcon ? (
        <BrandIcon aria-hidden="true" />
      ) : null}
    </span>
  );
}
