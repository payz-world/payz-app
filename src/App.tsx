import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, BadgeCheck, BriefcaseBusiness, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download,
  Compass, Dumbbell, Gift, Globe2, Heart, House, Info, LockKeyhole, Menu, PackageOpen,
  Search, Settings as SettingsIcon, ShieldCheck, ShoppingBag, Smartphone,
  Utensils, Plane, Gamepad2, Clapperboard, MoreHorizontal,
  Ticket, X, Clock3, RefreshCw, ImageOff,
} from 'lucide-react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Switch, useLocation, useParams, useSearch } from 'wouter';
import { createGuestSession, getCheckPaymentAvailabilityQueryKey, getGetCatalogHomeQueryKey, getListCategoriesQueryKey, getListProductsQueryKey, getListRegionsQueryKey, issuePurchaseAccessLink, useCheckPaymentAvailability, useGetCatalogHome, useGetOrder, useGetProduct, useListCategories, useListPaymentNetworks, useListProducts, useListRegions, useCreateOrder } from 'payz-sdk';
import type { Order, Product, Region } from 'payz-sdk';
import { useCallback } from 'react';
import { brandAssetUrl, getBrandArtwork } from './brand-artwork';
import { DocumentationSite, DOC_ROUTES } from 'payz-docs';
import { HowItWorksPage, PublicInfoPage } from './pages/payz-public/MarketingPages';
import SectionRealWorld from './SectionRealWorld';
import SectionWhyPayz from './SectionWhyPayz';
import SectionJourney from './SectionJourney';
import SectionPrivacy from './SectionPrivacy';
import SectionCatalogExamples from './SectionCatalogExamples';
import SectionClosing from './SectionClosing';
import SectionVitalik from './SectionVitalik';
import SectionPaymentFlow from './SectionPaymentFlow';
import { GLOBAL_REGION, catalogRegionParams, isPayzCatalogRegion, isPayzCountry, payzRegions } from './supported-regions';
import './service-package-options.css';
import { CUSTOMER_CATEGORIES, customerCategoryName } from './customer-navigation';
import PrivacyContent from './PrivacyContent';
import PurchaseDeliveryPage from './PurchaseDeliveryPage';
import PayzLogo from './PayzLogo';
import PayzBrandText from './PayzBrandText';
import payzHeroImage from './assets/payz-hero.png';
import './landing-narrative.css';
import './landing-after-hero.css';

const queryClient = new QueryClient();
const navMain = [{ label: 'Explore', href: '/app', Icon: Compass }, { label: 'Rewards', href: '/app/rewards', Icon: Gift }];
const categoryIconById: Record<string, typeof ShoppingBag> = {
  shopping: ShoppingBag,
  'food-beverage': Utensils,
  entertainment: Clapperboard,
  gaming: Gamepad2,
  sports: Dumbbell,
  travel: Plane,
  lifestyle: Heart,
  services: BriefcaseBusiness,
};
const categoryIconFor = (id: string) => categoryIconById[id] || MoreHorizontal;
type InstallPromptEvent = Event & { prompt?: () => Promise<void>; userChoice?: Promise<{ outcome: string }> };
type InstallContextValue = { prompt: InstallPromptEvent | null; canInstall: boolean; promptInstall: () => Promise<void> };
const InstallContext = createContext<InstallContextValue>({ prompt: null, canInstall: false, promptInstall: async () => {} });
const ClearCatalogSearchContext = createContext<(() => void) | null>(null);
const storedRegion = () => {
  const queryRegion = window.location.pathname.replace(/\/$/, '').endsWith('/app')
    ? new URLSearchParams(window.location.search).get('region') : null;
  const saved = queryRegion || localStorage.getItem('payz-region') || '';
  return isPayzCatalogRegion(saved) ? saved : 'US';
};
const money = (amount: number, currency = 'USD', symbol?: string) => {
  if (symbol !== undefined) return `${symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
};
const roundMoney = (amount: number, currency: string) => {
  let digits = 2;
  try {
    digits = new Intl.NumberFormat(undefined, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {}
  const scale = 10 ** digits;
  return Math.round((amount + Number.EPSILON) * scale) / scale;
};
const customerPrice = (basePrice: number, currency: string) => {
  const markup = roundMoney(basePrice * 0.1, currency);
  return roundMoney(basePrice + markup, currency);
};
const cleanCatalogText = (value: string) =>
  value
    .replace(/\b(?:bitrefill|gift[\s-]*cards?|giftcards?|vouchers?)\b/gi, '')
    .replace(/\s*[:|–—-]\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
function customerBrand(product: { brand?: string; name: string }) {
  return cleanCatalogText(product.brand || '') || cleanCatalogText(product.name) || 'Product';
}
function customerProductName(product: { brand?: string; name: string }) {
  const name = cleanCatalogText(product.name);
  return name && name.toLowerCase() !== customerBrand(product).toLowerCase() ? name : '';
}
function customerProductDescription(description: string) {
  return /\b(?:bitrefill|gift[\s-]*cards?|giftcards?|vouchers?)\b/i.test(description) ? '' : description;
}
const retryWhileCatalogLoads = (failureCount: number, error: unknown) =>
  (error as { data?: { code?: string } })?.data?.code === 'CATALOG_SYNCING' && failureCount < 90;
const catalogRetryDelay = 10_000;

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catalogParams = catalogRegionParams(GLOBAL_REGION);
  const catalogQ = useGetCatalogHome(catalogParams, {
    query: {
      queryKey: getGetCatalogHomeQueryKey(catalogParams),
      retry: retryWhileCatalogLoads,
      retryDelay: catalogRetryDelay,
    },
  });
  const landingProducts = useMemo(() => {
    const candidates = [
      ...(catalogQ.data?.globalTop ?? []),
      ...(catalogQ.data?.regionalTop ?? []),
      ...(catalogQ.data?.categorySections.flatMap(section => section.products) ?? []),
    ];
    const unique = new Map<string, Product>();
    for (const product of candidates) {
      if (!product.available || product.isPreview || product.availableRegions.length === 0) continue;
      if (!unique.has(product.id)) unique.set(product.id, product);
    }
    return [...unique.values()];
  }, [catalogQ.data]);
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 8);
    updateScroll(); window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);
  const navigation = [{ label: 'Explore', href: '/' }, { label: 'Rewards', href: '/rewards' }, { label: 'How It Works', href: '/how-it-works' }, { label: 'Privacy', href: '/privacy' }];
  const categories = [
    { label: 'Shopping', Icon: ShoppingBag },
    { label: 'Food & Beverage', Icon: Utensils },
    { label: 'Entertainment', Icon: Clapperboard },
    { label: 'Gaming', Icon: Gamepad2 },
    { label: 'Sports', Icon: Dumbbell },
    { label: 'Travel', Icon: Plane },
    { label: 'Lifestyle', Icon: Heart },
    { label: 'Services', Icon: BriefcaseBusiness },
  ];
  return (
    <main className="site-shell">
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="wordmark" href="#hero" aria-label="payz home"><PayzLogo decorative /><span className="payz-header-name">payz</span></a>
          <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(({ label, href }) => <Link key={label} href={href}>{label}</Link>)}</nav>
          <div className="mobile-controls">
            <button className="mobile-menu-button" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)} data-testid="button-toggle-menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
          {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(({ label, href }) => <Link key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
        </div>
      </header>
      <section className="hero" id="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title"><span>Private payments for real-life </span><span className="accent-word" id="privacy">everyday needs.</span></h1>
          <p className="hero-description">Spend crypto on real-world products, services, apps, and everyday essentials without unnecessarily linking your purchases to public wallet activity.</p>
          <div className="hero-actions"><Link className="cta cta-primary" href="/app" data-testid="link-start-spending">Start Spending <ArrowRight size={15} strokeWidth={1.8} /></Link><Link className="cta cta-secondary" href="/app/rewards" data-testid="link-explore-rewards">Explore Rewards</Link></div>
          <div className="category-area" id="categories"><div className="category-list" aria-label="Spending categories">{categories.map(({ label, Icon }) => <div className="category-item" key={label}><Icon /><span>{label}</span></div>)}</div></div>
          <p className="micro-copy">Choose what you need. Send crypto. Receive your purchase.</p>
        </div>
          <div className="hero-visual" onContextMenu={e => e.preventDefault()}>
            <img
              className="hero-art"
              src={payzHeroImage}
              alt="A preview of the payz spending interface and supported payment assets"
              draggable={false}
              onDragStart={e => e.preventDefault()}
            />
          </div>
      </section>
      <div className="landing-after-hero">
        <SectionRealWorld products={landingProducts} loading={catalogQ.isLoading} error={catalogQ.isError} />
        <SectionWhyPayz />
        <SectionVitalik />
        <SectionPaymentFlow />
        <SectionPrivacy />
        <SectionJourney />
        <SectionCatalogExamples products={landingProducts} loading={catalogQ.isLoading} error={catalogQ.isError} />
        <SectionClosing />
      </div>
    </main>
  );
}

function ProductMark({ product, large = false }: { product: Product | Order['product']; large?: boolean }) {
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const brand = customerBrand(product);
  const providerImage = 'image' in product && typeof product.image === 'string' ? product.image : null;
  const logoKey = 'logoKey' in product && typeof product.logoKey === 'string' ? product.logoKey : '';
  const artwork = getBrandArtwork(brand, logoKey);
  const BrandIcon = artwork.Icon;
  const image = [artwork.asset ? brandAssetUrl(artwork.asset) : null, BrandIcon ? null : providerImage]
    .find((source): source is string => Boolean(source && !failedImages.includes(source)));
  return <div className={`product-mark${large ? ' product-mark-large' : ''}`} style={{ '--brand-color': artwork.background, '--logo-color': artwork.color } as React.CSSProperties} role="img" aria-label={`${brand} logo`}>
    {image ? <img src={image} alt="" loading={large ? 'eager' : 'lazy'} onError={() => setFailedImages(values => [...values, image])} /> : BrandIcon ? <BrandIcon aria-hidden="true" /> : <ImageOff aria-label="Original brand artwork unavailable" className="brand-artwork-unavailable" />}
  </div>;
}

function paymentAssetUrl(asset: string | null | undefined): string | null {
  if (!asset) return null;
  return `${import.meta.env.BASE_URL}${asset.replace(/^\/+/, '')}`;
}

function AssetLogo({ ticker, logoUrl, size = 'regular' }: { ticker: string; logoUrl?: string | null; size?: 'regular' | 'large' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [logoUrl]);
  const src = paymentAssetUrl(logoUrl);
  return <span className={`payz-asset-logo payz-asset-logo-${size}`} role="img" aria-label={`${ticker} asset`}>
    {src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} /> : <ImageOff aria-hidden="true" />}
  </span>;
}

function NetworkLogo({ name, logoUrl, size = 'regular' }: { name: string; logoUrl?: string | null; size?: 'regular' | 'large' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [logoUrl]);
  const src = paymentAssetUrl(logoUrl);
  const logoScaleClass = name.toLowerCase().includes('solana')
    ? ' payz-network-logo-solana'
    : '';
  return <span className={`payz-network-logo payz-network-logo-${size}${logoScaleClass}`} role="img" aria-label={`${name} network`}>
    {src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} /> : <ImageOff aria-hidden="true" />}
  </span>;
}

type PaymentPickerOption = {
  id: string;
  label: string;
  ticker?: string;
  logoUrl?: string | null;
  enabled: boolean;
  statusLabel?: string;
};

function PaymentOptionPicker({
  id,
  label,
  kind,
  value,
  options,
  placeholder,
  disabled,
  testId,
  onSelect,
}: {
  id: string;
  label: string;
  kind: "network" | "asset";
  value: string;
  options: PaymentPickerOption[];
  placeholder: string;
  disabled: boolean;
  testId: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.id === value);

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const optionLogo = (option: PaymentPickerOption) =>
    kind === "network"
      ? <NetworkLogo name={option.label} logoUrl={option.logoUrl} size="large" />
      : <AssetLogo ticker={option.ticker ?? option.label} logoUrl={option.logoUrl} size="large" />;

  return (
    <div className="payment-picker" ref={pickerRef}>
      <span className="payment-picker-label" id={`${id}-label`}>{label}</span>
      <button
        type="button"
        className="payment-picker-trigger"
        data-testid={testId}
        aria-label={`${label}: ${selectedOption?.label ?? placeholder}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        {selectedOption && optionLogo(selectedOption)}
        <span className="payment-picker-copy">
          <span className="payment-picker-main">
            {selectedOption
              ? selectedOption.ticker
                ? `${selectedOption.ticker} · ${selectedOption.label}`
                : selectedOption.label
              : placeholder}
          </span>
          {selectedOption?.statusLabel && <span className="payment-picker-status">{selectedOption.statusLabel}</span>}
        </span>
        <ChevronDown className="payment-picker-chevron" aria-hidden="true" />
      </button>
      {open && options.length > 0 && (
        <div
          className="payment-picker-menu"
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option) => (
            <button
              type="button"
              className="payment-picker-option"
              key={option.id}
              role="option"
              aria-selected={option.id === value}
              disabled={!option.enabled}
              onClick={() => {
                onSelect(option.id);
                setOpen(false);
              }}
            >
              {optionLogo(option)}
              <span className="payment-picker-copy">
                <span className="payment-picker-main">
                  {option.ticker ? `${option.ticker} · ${option.label}` : option.label}
                </span>
                {option.statusLabel && <span className="payment-picker-status">{option.statusLabel}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AppFrame({ children, region, regions, onRegionChange, search, setSearch }: { children: React.ReactNode; region: string; regions: Region[]; onRegionChange: (v: string) => void; search?: string; setSearch?: (v: string) => void }) {
  const [path] = useLocation();
  const clearCatalogSearch = useContext(ClearCatalogSearchContext);
  const query = useSearch();
  const activeCategory = path === '/app' ? new URLSearchParams(query).get('category') : null;
  const install = useContext(InstallContext);
  const regionsQuery = useListRegions({
        query: { queryKey: getListRegionsQueryKey(), retry: retryWhileCatalogLoads, retryDelay: catalogRetryDelay },
  });
  const regionName = region === GLOBAL_REGION ? 'Global' : regions.find(r => r.code === region)?.name || region;
  const shellCategories = CUSTOMER_CATEGORIES;
  return <div className="product-app">
    <aside className="app-sidebar">
      <Link href="/app" className="app-wordmark" aria-label="payz home"><PayzLogo decorative /><span className="payz-header-name">payz</span></Link>
      <nav className="side-primary">{navMain.map(({ label, href, Icon }) => <Link href={href} key={href} className={`side-link${path === href ? ' active' : ''}`} data-testid={`nav-${label.toLowerCase()}`}><Icon />{label}</Link>)}</nav>
      <div className="side-divider" />
      <div className="side-label">Categories</div>
      <nav className="side-categories"><Link href="/app?category=all" onClick={() => clearCatalogSearch?.()} className={`side-link${path === '/app' && (activeCategory === 'all' || (!activeCategory && region === GLOBAL_REGION)) ? ' active' : ''}`} data-testid="category-nav-all"><PackageOpen />All</Link>{shellCategories.map(category => { const Icon = categoryIconFor(category.id); return <Link href={`/app?category=${encodeURIComponent(category.id)}`} onClick={() => clearCatalogSearch?.()} className={`side-link${activeCategory === category.id ? ' active' : ''}`} aria-current={activeCategory === category.id ? 'page' : undefined} key={category.id} data-testid={`category-nav-${category.id}`}><Icon />{category.name}</Link>; })}</nav>
      <div className="side-bottom"><Link href="/app/privacy" className={`side-link${path === '/app/privacy' ? ' active' : ''}`} data-testid="nav-privacy"><ShieldCheck />Privacy</Link><Link href="/app/settings" className={`side-link${path === '/app/settings' ? ' active' : ''}`} data-testid="nav-settings"><SettingsIcon />Settings</Link>{install.canInstall && (install.prompt ? <button type="button" className="install-prompt" onClick={() => void install.promptInstall()} data-testid="button-install-payz"><span className="install-icon"><Smartphone /></span><span><b>Install payz</b><small>Add payz to your computer for a faster app experience.</small></span><ChevronRight /></button> : <Link href="/app/settings#install" className="install-prompt" data-testid="button-install-payz"><span className="install-icon"><Smartphone /></span><span><b>Install payz</b><small>Add payz to your home screen.</small></span><ChevronRight /></Link>)}</div>
    </aside>
    <div className="app-main">
      <header className="app-mobile-head">
        <Link href="/app" className="app-wordmark" aria-label="payz home"><PayzLogo decorative /><span className="payz-header-name">payz</span></Link>
        <label className="region-select"><Globe2 /><select value={region} onChange={e => onRegionChange(e.target.value)} aria-label="Region" data-testid="select-region-mobile"><option value={GLOBAL_REGION}>Global</option>{regions.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select><ChevronDown /></label>
      </header>
      <header className="app-topbar">
        <div className="top-search"><Search /><input aria-label="Search products, brands, and services" placeholder="Search products, brands, and services..." value={search ?? ''} onChange={e => setSearch?.(e.target.value)} data-testid="input-product-search" /><kbd>⌘ K</kbd></div>
        <div className="top-actions"><label className="region-select"><Globe2 /><select value={region} onChange={e => onRegionChange(e.target.value)} aria-label="Region" data-testid="select-region"><option value={GLOBAL_REGION}>Global</option>{regions.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select><ChevronDown /></label><Link href="/app/rewards" className="top-link" data-testid="top-rewards"><Gift />Rewards</Link><Link href="/app/settings" aria-label="Settings" className="profile-button" data-testid="top-settings"><SettingsIcon /></Link></div>
      </header>
      <main className="app-content">{regionsQuery.isError && <div className="app-system-notice" role="status" data-testid="error-regions"><Info /> Available regions couldn't be verified. The selected region is {regionName}; checkout remains unavailable until live catalog data responds.</div>}{children}</main>
    </div>
      <nav className="mobile-bottom-nav" aria-label="Primary navigation">{[...navMain, { label: 'More', href: '/app/more', Icon: MoreHorizontal }].map(({ label, href, Icon }) => <Link href={href} key={href} className={`mobile-tab${path === href ? ' active' : ''}`} data-testid={`mobile-nav-${label.toLowerCase()}`}><Icon /><span>{label}</span></Link>)}</nav>
  </div>;
}

function ProductTile({ product, region }: { product: Product; region: string }) {
  const regionQuery = region === GLOBAL_REGION ? '' : `?region=${encodeURIComponent(region)}`;
  const priceLabel = product.startingPrice !== null && product.currency
    ? `From ${money(customerPrice(product.startingPrice, product.currency), product.currency)}`
    : product.currency || 'View offer';
  return <Link href={`/app/product/${encodeURIComponent(product.id)}${regionQuery}`} className="product-tile" data-testid={`card-product-${product.id}`}>
    <ProductMark product={product} /><div className="tile-info"><div><b>{customerBrand(product)}</b><small>{customerCategoryName(product.categoryId, product.categoryName)}</small><small>{priceLabel}</small></div><span className="tile-arrow"><ArrowRight /></span></div>
  </Link>;
}

function Explore({ region, regions, onRegionChange, search, setSearch }: { region: string; regions: Region[]; onRegionChange: (v: string) => void; search: string; setSearch: (v: string) => void }) {
  const [, setLocation] = useLocation();
  const query = useSearch();
  const category = new URLSearchParams(query).get('category') || '';
  const [currency, setCurrency] = useState('');
  const [page, setPage] = useState(1);
  const trimmedSearch = search.trim();
  const browsingCategory = category === 'all' ? '' : category;
  const isDefaultExplore = !trimmedSearch && !browsingCategory;
  const homeParams = catalogRegionParams(region);
  const homeQ = useGetCatalogHome(homeParams, {
    query: { queryKey: getGetCatalogHomeQueryKey(homeParams), enabled: isDefaultExplore, retry: retryWhileCatalogLoads, retryDelay: catalogRetryDelay },
  });
  const categoryParams = catalogRegionParams(region);
  const categoriesQ = useListCategories(categoryParams, {
    query: { queryKey: getListCategoriesQueryKey(categoryParams), retry: retryWhileCatalogLoads, retryDelay: catalogRetryDelay },
  });
  const listParams = {
      ...catalogRegionParams(region),
      ...(browsingCategory ? { category: browsingCategory } : {}),
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
      ...(currency ? { currency } : {}),
      page,
      pageSize: 20,
  };
  const productsQ = useListProducts(listParams, {
    query: {
      queryKey: getListProductsQueryKey(listParams),
      enabled: !isDefaultExplore,
      retry: retryWhileCatalogLoads,
      retryDelay: catalogRetryDelay,
    },
  });
  const categories = CUSTOMER_CATEGORIES;
  const response = productsQ.data;
  const products = response?.products || [];
  const home = homeQ.data;
  const regionCurrency = regions.find(item => item.code === region)?.currency;
  const currencies = [...new Set([
    ...(region === GLOBAL_REGION ? regions.map(item => item.currency) : [regionCurrency]),
    ...products.map(product => product.currency),
  ])].filter((code): code is string => Boolean(code)).sort();
  const chooseCategory = (nextCategory: string) => {
    setPage(1);
    setSearch('');
    setCurrency('');
    setLocation(`/app${nextCategory ? `?category=${encodeURIComponent(nextCategory)}` : ''}`);
  };
  useEffect(() => { setPage(1); }, [region, category, trimmedSearch, currency]);
  useEffect(() => { setCurrency(''); }, [region, category]);
  const regionName = region === GLOBAL_REGION ? 'Global' : regions.find(r => r.code === region)?.name || region;
  const sectionError = isDefaultExplore ? homeQ.isError : productsQ.isError;
  const sectionLoading = isDefaultExplore ? homeQ.isLoading : productsQ.isLoading;
  const retryCatalog = () => { if (isDefaultExplore) void homeQ.refetch(); else void productsQ.refetch(); };
  const visibleSections = [
    ...(home?.globalTop.length ? [{ key: 'global', name: 'Featured', products: home.globalTop }] : []),
    ...(home?.regionalTop.length ? [{ key: 'regional', name: `Selected in ${regionName}`, products: home.regionalTop }] : []),
    ...(home ? CUSTOMER_CATEGORIES.map(category => ({
      key: category.id, categoryId: category.id, name: category.name,
      products: home.categorySections.find(section => section.categoryId === category.id)?.products || [],
    })) : []),
  ];
  return <AppFrame region={region} regions={regions} onRegionChange={value => { setPage(1); onRegionChange(value); }} search={search} setSearch={value => { setPage(1); setSearch(value); }}>
    <div className="catalog-hero"><div><h1>What do you want to buy?</h1><p>Spend crypto on real-world products, services, apps, and everyday essentials.</p></div><span className="hero-globe" aria-hidden="true"><Globe2 /></span></div>
    <div className="category-shortcuts"><button className={`shortcut${category === 'all' || (!category && region === GLOBAL_REGION) ? ' selected' : ''}`} aria-pressed={category === 'all' || (!category && region === GLOBAL_REGION)} onClick={() => chooseCategory('all')} data-testid="filter-category-all"><PackageOpen /><span>All</span></button>{categories.map(item => { const Icon = categoryIconFor(item.id); return <button key={item.id} className={`shortcut${category === item.id ? ' selected' : ''}`} aria-pressed={category === item.id} onClick={() => chooseCategory(category === item.id ? 'all' : item.id)} data-testid={`filter-category-${item.id}`}><Icon /><span>{item.name}</span></button>; })}</div>
    {categoriesQ.isError && <div className="app-system-notice" role="status" data-testid="error-categories"><Info /> Category filters are temporarily unavailable.</div>}
    {sectionLoading ? <div className="product-grid">{Array.from({ length: 8 }, (_, i) => <div className="tile-skeleton" key={i}><div /><span /><span /></div>)}</div> : sectionError ? <StatePanel icon={<RefreshCw />} title="Live catalog is unavailable" body={`We couldn't verify products in ${regionName}. No sample products are shown.`} action={<button className="button-secondary" onClick={retryCatalog} data-testid="button-retry-catalog">Try again</button>} /> : isDefaultExplore ? <>
      {visibleSections.map(section => <section className="catalog-section" key={section.key}>
        <div className="section-heading"><div><h2>{section.name}</h2></div>
          {'categoryId' in section ? <button className="catalog-view-all" onClick={() => chooseCategory(section.categoryId)} data-testid={`view-all-${section.categoryId}`}>View all <ArrowRight /></button> : <span className="region-caption"><Globe2 />{regionName}</span>}
        </div>
        {section.products.length ? <div className="product-grid featured-grid">{section.products.map(product => <ProductTile key={`${section.key}-${product.id}`} product={product} region={region} />)}</div> : <div className="app-system-notice" role="status"><Info />No products are currently available in this category.</div>}
      </section>)}
      {!visibleSections.length && <StatePanel icon={<PackageOpen />} title="No products available yet" body="There are no live products to show for this region right now." />}
    </> : <section className="catalog-section">
      <div className="section-heading"><div><h2>{trimmedSearch ? `Results for “${trimmedSearch}”` : !browsingCategory ? 'All products' : categories.find(item => item.id === category)?.name || 'Browse category'}</h2></div></div>
      <div className="category-pills catalog-live-filters"><label>Currency<select value={currency} onChange={event => { setCurrency(event.target.value); setPage(1); }} aria-label="Filter by currency" data-testid="select-catalog-currency"><option value="">All currencies</option>{currencies.map(code => <option key={code} value={code}>{code}</option>)}</select></label></div>
      {products.length ? <div className="product-grid">{products.map(product => <ProductTile key={product.id} product={product} region={region} />)}</div> : <StatePanel icon={<PackageOpen />} title="Nothing to show yet" body={trimmedSearch ? 'Try a different search or clear your search.' : 'No live products match this category right now.'} action={(trimmedSearch || category || currency) ? <button className="button-secondary" onClick={() => { setSearch(''); chooseCategory(''); setCurrency(''); }} data-testid="button-clear-catalog-filters">Clear filters</button> : undefined} />}
      {!!response && response.totalPages > 1 && <div className="catalog-pagination" aria-label="Catalog pages"><button className="button-secondary" disabled={page <= 1} onClick={() => setPage(value => Math.max(1, value - 1))} data-testid="button-catalog-previous"><ChevronLeft />Previous</button><span>Page {response.page} of {response.totalPages}</span><button className="button-secondary" disabled={page >= response.totalPages} onClick={() => setPage(value => Math.min(response.totalPages, value + 1))} data-testid="button-catalog-next">Next<ChevronRight /></button></div>}
    </section>}
  </AppFrame>;
}

function StatePanel({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
  return <div className="state-panel" data-testid="state-panel"><span className="state-icon">{icon}</span><h2>{title}</h2><p>{body}</p>{action}</div>;
}

function ProductPage({ region, regions, onRegionChange }: { region: string; regions: Region[]; onRegionChange: (v: string) => void }) {
  const params = useParams<{ productId: string }>();
  const [selected, setSelected] = useState<number | null>(null);
  const [amountSelectionConfirmed, setAmountSelectionConfirmed] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const queryRegion = new URLSearchParams(window.location.search).get('region');
    if (queryRegion && isPayzCountry(queryRegion)) return queryRegion;
    return isPayzCountry(region) ? region : '';
  });
  const [networkId, setNetworkId] = useState('');
  const [assetId, setAssetId] = useState('');
  useEffect(() => {
    const url = new URL(window.location.href);
    if (isPayzCountry(selectedRegion)) url.searchParams.set('region', selectedRegion);
    else url.searchParams.delete('region');
    window.history.replaceState(window.history.state, '', url);
  }, [selectedRegion]);
  const [error, setError] = useState('');
  const idempotencyKeyRef = useRef<string | null>(null);
  const [, navigate] = useLocation();
  const productId = params.productId || '';
  const summaryQ = useGetProduct(
    { productId },
    {
      query: {
        queryKey: ['/api/catalog/product', { productId }],
        retry: retryWhileCatalogLoads,
        retryDelay: catalogRetryDelay,
      },
    },
  );
  const summary = summaryQ.data;
  const availableRegions = payzRegions(summary?.availableRegions || []);
  const availableRegionCodes = availableRegions.map(item => item.code).join('|');
  useEffect(() => {
    if (!summary) return;
    const supported = availableRegions.map(item => item.code);
    if (selectedRegion && !supported.includes(selectedRegion)) {
      setSelectedRegion('');
      return;
    }
    if (!selectedRegion) {
      const preferred = supported.includes(region)
        ? region
        : supported.length === 1 ? supported[0] : '';
      if (preferred) setSelectedRegion(preferred);
    }
  }, [summary?.id, availableRegionCodes, region, selectedRegion]);
  const variantQ = useGetProduct(
    { productId, ...(selectedRegion ? { region: selectedRegion } : {}) },
    {
      query: {
        queryKey: ['/api/catalog/product', { productId, region: selectedRegion }],
        enabled: Boolean(summary && selectedRegion),
        retry: retryWhileCatalogLoads,
        retryDelay: catalogRetryDelay,
      },
    },
  );
  const product = selectedRegion ? variantQ.data : summary;
  const create = useCreateOrder();
  const networksQ = useListPaymentNetworks({
    query: {
      queryKey: ['/api/payments/networks'],
      staleTime: 30000,
    },
  });
  const selectedNetwork =
    networksQ.data?.find(item => item.id === networkId) ??
    networksQ.data?.find(item => item.enabled) ??
    networksQ.data?.[0] ??
    null;
  const networkAssets = (selectedNetwork?.assets ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const selectedAsset = networkAssets.find(asset => asset.id === assetId) ?? null;
  const availabilityParams = {
      productId: product?.variantId ?? '',
      region: selectedRegion,
      denomination: selected ?? 0,
  };
  const availabilityQ = useCheckPaymentAvailability(
    availabilityParams,
    {
      query: {
        queryKey: getCheckPaymentAvailabilityQueryKey(availabilityParams),
        enabled: Boolean(
          amountSelectionConfirmed &&
          product?.variantId &&
          selectedRegion &&
          selected !== null,
        ),
        staleTime: 45000,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  );
  const checkedDenomination = availabilityQ.data?.denomination;
  const availabilityMatchesSelection = Boolean(
    amountSelectionConfirmed &&
    !availabilityQ.isError &&
    availabilityQ.data?.productId === product?.variantId &&
    availabilityQ.data?.region === selectedRegion &&
    selected !== null &&
    checkedDenomination !== undefined &&
    Math.round(checkedDenomination * 100) === Math.round(selected * 100),
  );
  const availabilityByRoute = new Map(
    (availabilityMatchesSelection ? availabilityQ.data?.routes ?? [] : [])
      .map(route => [`${route.networkId}:${route.assetId}`, route.status] as const),
  );
  const selectedRouteAvailability = selectedNetwork && selectedAsset
    ? availabilityByRoute.get(`${selectedNetwork.id}:${selectedAsset.id}`)
    : undefined;
  useEffect(() => {
    if (!product?.variantId) {
      setSelected(null);
      setAmountSelectionConfirmed(false);
      setNetworkId('');
      setAssetId('');
      return;
    }
    setSelected(product.denominations.length === 1 ? product.denominations[0] : null);
    setAmountSelectionConfirmed(false);
    setNetworkId('');
    setAssetId('');
  }, [product?.variantId]);
  useEffect(() => {
    const options = networksQ.data ?? [];
    if (!options.some(item => item.id === networkId && item.enabled)) {
      setNetworkId(options.find(item => item.enabled)?.id ?? options[0]?.id ?? '');
    }
  }, [networksQ.data, networkId]);
  useEffect(() => {
    if (!networkAssets.some(asset => asset.id === assetId && asset.enabled)) {
      setAssetId(networkAssets.find(asset => asset.enabled)?.id ?? networkAssets[0]?.id ?? '');
    }
  }, [networkAssets, assetId]);
  useEffect(() => {
    idempotencyKeyRef.current = null;
  }, [product?.variantId, selectedRegion, selected, networkId, assetId]);
  const canAttemptCheckout = Boolean(
    selectedNetwork?.enabled &&
      selectedAsset?.enabled &&
      selectedRouteAvailability === 'available',
  );
  const productAmount = selected ?? 0;
  const priceCurrency = product?.currency || 'USD';
  const markupAmount = roundMoney(productAmount * 0.1, priceCurrency);
  const customerTotal = roundMoney(productAmount + markupAmount, priceCurrency);
  const createPaymentOrder = () => {
    if (!product?.variantId || selected === null || !selectedNetwork?.enabled || !selectedAsset?.enabled || selectedRouteAvailability !== 'available') return;
    setError('');
    const idempotencyKey = idempotencyKeyRef.current ?? window.crypto.randomUUID();
    idempotencyKeyRef.current = idempotencyKey;
    create.mutate({ data: { productId: product.variantId, region: selectedRegion, denomination: selected, networkId: selectedNetwork.id, assetId: selectedAsset.id, idempotencyKey } }, {
      onSuccess: order => {
        idempotencyKeyRef.current = null;
        navigate(`/app/order/${encodeURIComponent(order.orderId)}`);
      },
      onError: (err: unknown) => {
        const payload = (err as { data?: { code?: string; error?: string } })?.data;
        if (['PAYMENT_ROUTE_UNAVAILABLE', 'PAYMENT_ASSET_UNAVAILABLE', 'CHECKOUT_DEPENDENCY_UNAVAILABLE', 'PRODUCT_UNAVAILABLE', 'INVALID_PAYMENT_ASSET'].includes(payload?.code ?? '')) {
          idempotencyKeyRef.current = null;
        }
        if (payload?.code === 'PAYMENT_ROUTE_UNAVAILABLE' || payload?.code === 'PAYMENT_ASSET_UNAVAILABLE') {
          void availabilityQ.refetch();
        }
        setError(payload?.error || (payload?.code === 'PAYMENT_ROUTE_UNAVAILABLE'
          ? 'The selected payment route could not be validated. No payment details were issued.'
          : payload?.code === 'PAYMENT_ASSET_UNAVAILABLE'
            ? 'This asset has no valid payment mapping. No payment details were issued.'
            : 'We could not create payment details. No payment was taken.'));
      },
    });
  };
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelected(null);
    setAmountSelectionConfirmed(false);
    onRegionChange(value);
  };
  if (summaryQ.isLoading) return <AppFrame region={region} regions={regions} onRegionChange={onRegionChange}><div className="detail-skeleton"><div /><div /><div /></div></AppFrame>;
  if (summaryQ.isError || !summary) return <AppFrame region={region} regions={regions} onRegionChange={onRegionChange}><StatePanel icon={<PackageOpen />} title="Product unavailable" body="This product isn't in the current live catalog." action={<Link className="button-secondary" href="/app">Back to explore</Link>} /></AppFrame>;
  if (selectedRegion && variantQ.isError) return <AppFrame region={region} regions={regions} onRegionChange={handleRegionChange}><StatePanel icon={<PackageOpen />} title="Regional offer unavailable" body="Choose another region where this product is currently available." action={<button className="button-secondary" onClick={() => setSelectedRegion('')}>Choose a region</button>} /></AppFrame>;
  const regionInfo = availableRegions.find(item => item.code === selectedRegion);
  const range = product?.range;
  const rangeInputMin = range?.min ?? 0;
  const setRangeAmount = (value: string) => {
    const amount = Number(value);
    if (!range || !Number.isFinite(amount) || amount < rangeInputMin || amount > range.max) {
      setSelected(null);
      setAmountSelectionConfirmed(false);
      return;
    }
    const steps = (amount - range.min) / range.step;
    if (Math.abs(steps - Math.round(steps)) > 0.0001) {
      setSelected(null);
      setAmountSelectionConfirmed(false);
      return;
    }
    setSelected(Math.round(amount * 100) / 100);
    setAmountSelectionConfirmed(true);
  };
  const availabilityErrorCode = (availabilityQ.error as { data?: { code?: string } } | null)?.data?.code ?? '';
  const routeAvailabilityMessage = selected === null
    ? null
    : !amountSelectionConfirmed
      ? 'Select the amount to check its current payment availability.'
    : availabilityQ.isError
      ? availabilityErrorCode === 'PRODUCT_UNAVAILABLE'
        ? 'This amount is not available in the current catalog. Choose an available amount.'
        : 'Route availability could not be checked. Retry or choose another amount.'
      : selectedRouteAvailability === 'coming_soon'
        ? 'This route is coming soon for this amount. Try another asset or amount.'
        : selectedRouteAvailability === 'temporarily_unavailable'
          ? 'Route availability is temporarily unavailable. Try again shortly or choose another asset.'
          : selectedRouteAvailability === 'disabled'
            ? <>This asset is disabled in <PayzBrandText text="Payz" /> configuration.</>
            : selectedRouteAvailability === 'available'
              ? 'This route is available for this amount and will be checked again at Checkout.'
              : availabilityQ.isFetching
                ? 'Checking payment availability for this amount…'
                : null;
  const showPricePicker = Boolean(product?.variantId && product.available);
  const networkPickerOptions: PaymentPickerOption[] = (networksQ.data ?? []).map((item) => ({
    id: item.id,
    label: item.name,
    logoUrl: item.logoUrl,
    enabled: item.enabled,
  }));
  const assetPickerOptions: PaymentPickerOption[] = networkAssets.map((asset) => {
    const status = availabilityByRoute.get(`${selectedNetwork?.id ?? ''}:${asset.id}`);
    const statusLabel = status === 'available'
      ? 'Available'
      : status === 'coming_soon'
        ? 'Coming Soon'
        : status === 'temporarily_unavailable'
          ? 'Temporarily Unavailable'
          : status === 'disabled' || !asset.enabled
            ? 'Disabled'
            : amountSelectionConfirmed && availabilityQ.isFetching
              ? 'Checking…'
              : !asset.configured
                ? 'Coming Soon'
                : undefined;
    return {
      id: asset.id,
      label: asset.name,
      ticker: asset.ticker,
      logoUrl: asset.logoUrl,
      enabled: asset.enabled,
      statusLabel,
    };
  });
  return <AppFrame region={selectedRegion || region} regions={regions} onRegionChange={handleRegionChange}><div className="breadcrumb"><Link href="/app"><ChevronLeft />Explore</Link><span>/</span>{customerCategoryName(summary.categoryId, summary.categoryName)}</div><div className="product-detail">
    <section className="detail-main"><ProductMark product={summary} large /><div className="detail-heading"><h1>{customerBrand(summary)}</h1>{customerProductName(product ?? summary) && <p>{customerProductName(product ?? summary)}</p>}</div><div className="detail-description"><h2>About this product</h2><p>{customerProductDescription(summary.description) || 'Product details are provided by the live catalog.'}</p></div>
      {availableRegions.length > 1 ? <div className="region-detail"><label htmlFor="product-region">Choose region</label><select id="product-region" value={selectedRegion} onChange={event => handleRegionChange(event.target.value)} data-testid="select-product-region"><option value="">Choose a region</option>{availableRegions.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div> : availableRegions.length === 1 ? <div className="region-detail"><span>Available region</span><strong><Globe2 />{availableRegions[0].name}</strong></div> : <div className="honest-note"><Info />This product is not currently available in any region.</div>}
      {selectedRegion && variantQ.isLoading && <div className="honest-note"><Clock3 />Loading the current offer for {regionInfo?.name || selectedRegion}…</div>}
      {showPricePicker && product && <div className="amount-section"><h2>{Object.keys(product.denominationLabels || {}).length ? 'Select package' : 'Select amount'}{product.currency ? ` · ${product.currency}` : ''}</h2>{product.denominations.length > 0 && <div className="amount-options">{product.denominations.map(amount => <button key={amount} className={selected === amount ? 'chosen' : ''} onClick={() => { setSelected(amount); setAmountSelectionConfirmed(true); setError(''); }} data-testid={`amount-${amount}`}>{product.denominationLabels?.[String(amount)] && <span className="package-label">{product.denominationLabels[String(amount)]}</span>}{money(amount, product.currency || 'USD')}</button>)}</div>}{range && <label className="range-amount">Custom amount<input type="number" min={rangeInputMin} max={range.max} step={range.step} value={selected !== null && !product.denominations.includes(selected) ? selected : ''} onChange={event => setRangeAmount(event.target.value)} placeholder={`${rangeInputMin}–${range.max}`} data-testid="input-range-amount" /></label>}{!product.denominations.length && !range && <p>No eligible amounts are currently available.</p>}</div>}
      {selectedRegion && product?.variantId && !product.available && <div className="honest-note"><Info />This regional offer is currently unavailable.</div>}
      {showPricePicker && product && <><div className="purchase-options">
        <PaymentOptionPicker
          id="payment-network"
          label="Network"
          kind="network"
          value={selectedNetwork?.id ?? ''}
          options={networkPickerOptions}
          placeholder={networksQ.isLoading ? 'Loading networks…' : networksQ.isError ? 'Networks unavailable' : 'No networks available'}
          disabled={!networksQ.data?.length}
          testId="select-payment-network"
          onSelect={(value) => { setNetworkId(value); setAssetId(''); }}
        />
        <PaymentOptionPicker
          id="payment-asset"
          label="Asset"
          kind="asset"
          value={selectedAsset?.id ?? ''}
          options={assetPickerOptions}
          placeholder={networksQ.isLoading ? 'Loading assets…' : networksQ.isError ? 'Networks unavailable' : selectedNetwork ? 'No assets available' : 'No network available'}
          disabled={!networkAssets.length}
          testId="select-payment-asset"
          onSelect={setAssetId}
        />
      </div>
        {selectedNetwork && <div className="payz-selected-route" data-testid="selected-payment-route">
          <NetworkLogo name={selectedNetwork.name} logoUrl={selectedNetwork.logoUrl} size="large" />
          <span className="route-network-name">{selectedNetwork.name}</span>
          {selectedAsset && <><span className="route-separator" aria-hidden="true">/</span><AssetLogo ticker={selectedAsset.ticker} logoUrl={selectedAsset.logoUrl} size="large" /><span className="route-asset-name">{selectedAsset.ticker}</span></>}
        </div>}
        <div className="quote-summary" aria-live="polite" data-testid="quote-summary">
          {selected === null ? <span>Choose an amount to see your total.</span> : <>
            <div><span>{customerProductName(product) || customerBrand(product)}</span><strong>{money(productAmount, priceCurrency)}</strong></div>
            <div><span>payz</span><strong>{money(markupAmount, priceCurrency)}</strong></div>
            <div className="quote-total"><span>Total</span><strong>{money(customerTotal, priceCurrency)}</strong></div>
            <small>Route availability is checked for this amount. The payment amount is recalculated at Checkout.</small>
          </>}
        </div>
        {routeAvailabilityMessage && <p className={selectedRouteAvailability === 'coming_soon' || selectedRouteAvailability === 'temporarily_unavailable' || availabilityQ.isError ? 'payment-route-unavailable' : 'payment-rail-note'} role="status">{routeAvailabilityMessage}</p>}
        {error && <div className="checkout-error" role="alert" data-testid="error-checkout"><Info /><span>{error}</span></div>}
        <button className="button-primary continue-button" disabled={!product?.variantId || selected === null || !canAttemptCheckout || create.isPending} onClick={createPaymentOrder} data-testid="button-continue">{create.isPending ? 'Creating payment details…' : 'Checkout'}{canAttemptCheckout && !create.isPending && <ArrowRight />}</button>
          {selectedAsset?.enabled && <p className="payment-rail-note"><LockKeyhole />No wallet connection is required. Route availability is checked for the selected amount and revalidated at Checkout.</p>}
      </>}
    </section>
    <aside className="detail-aside"><h2>Product details</h2><dl><div><dt>Brand</dt><dd>{summary.brand}</dd></div><div><dt>Category</dt><dd>{customerCategoryName(summary.categoryId, summary.categoryName)}</dd></div><div><dt>Product</dt><dd>{summary.name}</dd></div><div><dt>Delivery</dt><dd>Digital delivery</dd></div><div><dt>Region</dt><dd>{regionInfo?.name || 'Choose a region'}</dd></div><div><dt>Usage</dt><dd>See product terms</dd></div></dl></aside>
   </div>
   </AppFrame>;
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { waiting: 'Waiting for payment', detected: 'Payment detected', confirming: 'Confirming payment', waiting_payment: 'Waiting for payment', payment_detected: 'Payment detected', payment_confirming: 'Confirming', payment_confirmed: 'Payment confirmed', confirmed: 'Payment confirmed', processing_purchase: 'Processing', processing: 'Processing', purchase_ready: 'Purchase ready', ready: 'Purchase ready', completed: 'Completed', failed: 'Failed', manual_review: 'Manual review', refund_required: 'Refund required', expired: 'Expired' };
  return <span className={`status-badge status-${status}`} data-testid={`status-${status}`}>{labels[status] || 'In progress'}</span>;
}

function OrderDetail({ region, regions, onRegionChange }: { region: string; regions: Region[]; onRegionChange: (v: string) => void }) {
  const params = useParams<{ orderId: string }>();
  const id = params.orderId || '';
  const query = useGetOrder(id, { query: { queryKey: ['/api/orders', id], refetchInterval: 12000, enabled: !!id } });
  const order = query.data;
  return <AppFrame region={region} regions={regions} onRegionChange={onRegionChange}><div className="breadcrumb"><Link href="/app" data-testid="link-back-explore"><ChevronLeft />Explore</Link></div>
    {query.isLoading ? <div className="timeline-skeleton"><div /><div /><div /></div> : query.isError || !order ? <StatePanel icon={<ShieldCheck />} title="Purchase unavailable" body="This purchase link may be invalid, expired, or unavailable in your current secure session." action={<Link className="button-secondary" href="/app">Return to Explore</Link>} /> : <OrderDetails order={order} />}
  </AppFrame>;
}

function OrderDetails({ order }: { order: Order }) {
  const [, navigate] = useLocation();
  const timeline = order.events || [];
  const [openingPurchase, setOpeningPurchase] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const paymentPending =
    ['waiting', 'detected', 'confirming'].includes(order.paymentStatus) &&
    ['waiting_payment', 'payment_detected', 'payment_confirming'].includes(order.orderStatus);
  const paymentInstructionReady = paymentPending && Boolean(order.payment.address);
  const purchaseReady = order.fulfillmentStatus === 'ready';
  const openPurchase = async () => {
    setOpeningPurchase(true);
    setAccessError(false);
    try {
      const access = await issuePurchaseAccessLink(order.orderId, { cache: 'no-store' });
      navigate(`/purchase/${encodeURIComponent(access.purchaseToken)}`);
    } catch {
      setAccessError(true);
      setOpeningPurchase(false);
    }
  };
  return <div className="order-detail"><div className="page-heading"><h1>{customerBrand(order.product)}</h1><p>{customerProductName(order.product)}</p><p><PayzBrandText text="Payz separates who pays from what gets purchased. No account or wallet connection is required, and Payz does not provide a permanent purchase-history screen." /></p></div><div className="order-summary"><div><span>Purchase total</span><strong>{money(order.fiatAmount, order.fiatCurrency)}</strong></div><div><span>Payment status</span><StatusBadge status={order.paymentStatus} /></div><div><span>Delivery status</span><StatusBadge status={order.fulfillmentStatus} /></div></div>
      <div className="order-panels"><section className="order-panel"><h2>Timeline</h2>{timeline.length ? <ol className="timeline-list">{timeline.map((event, i) => <li key={`${event.createdAt}-${i}`}><span className="timeline-dot" /><div><b>{event.title}</b><p>{event.description}</p><time>{new Date(event.createdAt).toLocaleString()}</time></div></li>)}</ol> : <div className="honest-note"><Clock3 />No status events have been reported yet.</div>}</section><section className="order-panel"><h2>{paymentInstructionReady ? 'Complete your payment' : 'Payment'}</h2>
        {paymentInstructionReady ? <div className="payment-instructions">
            <p>No wallet connection is required. Send only the exact amount, asset, and network shown for this purchase.</p>
           <div className="order-payment-route">
             <div><NetworkLogo name={order.payment.network} logoUrl={order.payment.networkLogoUrl} size="large" /><span><small>Network</small><strong>{order.payment.network}</strong></span></div>
             <div><AssetLogo ticker={order.payment.asset} logoUrl={order.payment.assetLogoUrl} size="large" /><span><small>Asset</small><strong>{order.payment.asset}</strong></span></div>
           </div>
          <dl>
            <div><dt>Total</dt><dd>{money(order.fiatAmount, order.fiatCurrency)}</dd></div>
            <div><dt>Send exactly</dt><dd className="payment-exact-amount">{order.payment.amount} {order.payment.asset}</dd></div>
          </dl>
          {order.payment.address && <div className="payment-address"><span>Payment address</span><code>{order.payment.address}</code><button className="button-secondary" type="button" onClick={() => void navigator.clipboard?.writeText(order.payment.address || '')}>Copy address</button></div>}
          {order.payment.memo && <div className="payment-memo"><span>Memo</span><code>{order.payment.memo}</code><button className="button-secondary" type="button" onClick={() => void navigator.clipboard?.writeText(order.payment.memo || '')}>Copy memo</button></div>}
          {order.payment.rateMode === 'floating' && order.payment.estimatedUsdcAmount && <div className="honest-note"><Info />Floating-rate estimate: about {order.payment.estimatedUsdcAmount} USDC on Ethereum. Actual output may vary; the exact amount to send is shown above.</div>}
          <div className="payment-waiting"><Clock3 /><span>{order.paymentStatus === 'detected' ? 'Payment detected' : order.paymentStatus === 'confirming' ? 'Confirming payment…' : 'Waiting for payment…'}</span></div>
         </div> : <><div className="order-payment-route">
           <div><NetworkLogo name={order.payment.network} logoUrl={order.payment.networkLogoUrl} size="large" /><span><small>Network</small><strong>{order.payment.network}</strong></span></div>
           <div><AssetLogo ticker={order.payment.asset} logoUrl={order.payment.assetLogoUrl} size="large" /><span><small>Asset</small><strong>{order.payment.asset}</strong></span></div>
          </div><dl><div><dt>Payment status</dt><dd><StatusBadge status={order.paymentStatus} /></dd></div><div><dt>Amount</dt><dd>{order.payment.amount} {order.payment.asset}</dd></div><div><dt>Network</dt><dd>{order.payment.network}</dd></div></dl></>}
         {paymentPending && !paymentInstructionReady && <div className="payment-destination-state" role="status">No customer payment destination is available. Do not send funds.</div>}
         {purchaseReady && <div className="delivery-actions">
           <button className="button-primary" type="button" onClick={() => void openPurchase()} disabled={openingPurchase} data-testid="button-reveal-code">{openingPurchase ? 'Opening secure purchase…' : 'View purchase'}</button>
         </div>}
         {accessError && <div className="honest-note" role="status"><Info />This secure purchase is unavailable or has already been closed.</div>}
      </section></div>
   </div>;
}

function RewardsPage({ region, regions, onRegionChange }: { region: string; regions: Region[]; onRegionChange: (v: string) => void }) {
  return <AppFrame region={region} regions={regions} onRegionChange={onRegionChange}><div className="page-heading"><h1><PayzBrandText text="Payz" /> Rewards</h1><p><PayzBrandText text="Payz rewards are intended to track rewards based on" /> PAYZ holdings. The rewards experience is not available yet.</p></div>
    <StatePanel icon={<Gift />} title="Coming soon" body="PAYZ-holdings rewards tracking will appear here when the program is available." />
  </AppFrame>;
}

function SimplePage({ type, region, regions, onRegionChange, setRegion }: { type: 'privacy' | 'settings' | 'more'; region: string; regions: Region[]; onRegionChange: (v: string) => void; setRegion: (v: string) => void }) {
  const install = useContext(InstallContext);
  if (type === 'privacy') return <AppFrame region={region} regions={regions} onRegionChange={onRegionChange}><PrivacyContent /></AppFrame>;
  const titles = { settings: 'Settings', more: 'More from payz' };
  return <AppFrame region={region} regions={regions} onRegionChange={onRegionChange}><div className="page-heading"><h1>{titles[type]}</h1></div>
    <div className="settings-layout"><section className="settings-card"><div className="setting-icon"><Globe2 /></div><div><h2>Region</h2><p>Choose the market used to filter available products and pricing.</p><select value={region} onChange={e => setRegion(e.target.value)} data-testid="settings-region"><option value={GLOBAL_REGION}>Global</option>{regions.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div></section>
      {install.canInstall && <section className="settings-card" id="install"><div className="setting-icon"><Smartphone /></div><div><h2>Install payz</h2><p>Keep the app close by for a faster experience.</p>{install.prompt ? <button className="button-secondary" onClick={() => void install.promptInstall()} data-testid="button-install-from-settings">Install app</button> : <p className="install-hint">In Safari, choose Share, then Add to Home Screen.</p>}</div></section>}
      {type === 'more' && <div className="more-links">{[{ label: 'Explore catalog', href: '/app', Icon: Compass }, { label: 'Rewards', href: '/app/rewards', Icon: Gift }, { label: 'Privacy', href: '/app/privacy', Icon: ShieldCheck }, { label: 'Settings', href: '/app/settings', Icon: SettingsIcon }].map(({ label, href, Icon }) => <Link key={href} href={href}><Icon /><span>{label}</span><ChevronRight /></Link>)}</div>}
    </div>
  </AppFrame>;
}

function AppRoutes() {
  const [region, setRegion] = useState(storedRegion);
  const [search, setSearch] = useState('');
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [iosSafariAvailable, setIosSafariAvailable] = useState(false);
  const regionQuery = useListRegions({
    query: { queryKey: getListRegionsQueryKey(), retry: retryWhileCatalogLoads, retryDelay: catalogRetryDelay },
  });
  const regions = useMemo(() => payzRegions(regionQuery.data || []), [regionQuery.data]);
  const changeRegion = useCallback((value: string) => {
    if (!isPayzCatalogRegion(value)) return;
    setRegion(value);
    const url = new URL(window.location.href);
    if (url.pathname.replace(/\/$/, '').endsWith('/app') && url.searchParams.has('region')) {
      url.searchParams.set('region', value);
      window.history.replaceState(window.history.state, '', url);
    }
  }, []);
  useEffect(() => { localStorage.setItem('payz-region', region); }, [region]);
  useEffect(() => {
    const supported = regions.some(item => item.code === region);
    if (region !== GLOBAL_REGION && regions.length > 0 && !supported) changeRegion(regions[0].code);
  }, [changeRegion, region, regionQuery.isError, regions]);
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const userAgent = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) &&
      /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent);
    setIosSafariAvailable(isIOSSafari && !isStandalone);
    const listen = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', listen);
    return () => window.removeEventListener('beforeinstallprompt', listen);
  }, []);
  const promptInstall = useCallback(async () => {
    if (installPrompt?.prompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    }
  }, [installPrompt]);
  const installContext = useMemo(() => ({
    prompt: installPrompt,
    canInstall: Boolean(installPrompt) || iosSafariAvailable,
    promptInstall,
  }), [installPrompt, iosSafariAvailable, promptInstall]);
  return <ClearCatalogSearchContext.Provider value={() => setSearch('')}><InstallContext.Provider value={installContext}><Switch>
    <Route path="/" component={Landing} />
    <Route path="/app">{() => <Explore region={region} regions={regions} onRegionChange={changeRegion} search={search} setSearch={setSearch} />}</Route>
    <Route path="/app/product/:productId">{() => <ProductPage region={region} regions={regions} onRegionChange={changeRegion} />}</Route>
    <Route path="/app/orders"><Redirect to="/app" /></Route>
    <Route path="/app/order/:orderId">{() => <OrderDetail region={region} regions={regions} onRegionChange={changeRegion} />}</Route>
    <Route path="/purchase/:purchaseToken" component={PurchaseDeliveryPage} />
    <Route path="/app/rewards">{() => <RewardsPage region={region} regions={regions} onRegionChange={changeRegion} />}</Route>
    <Route path="/app/privacy">{() => <SimplePage type="privacy" region={region} regions={regions} onRegionChange={changeRegion} setRegion={changeRegion} />}</Route>
    <Route path="/app/settings">{() => <SimplePage type="settings" region={region} regions={regions} onRegionChange={changeRegion} setRegion={changeRegion} />}</Route>
    <Route path="/app/more">{() => <SimplePage type="more" region={region} regions={regions} onRegionChange={changeRegion} setRegion={changeRegion} />}</Route>
    <Route component={NotFoundPage} />
  </Switch></InstallContext.Provider></ClearCatalogSearchContext.Provider>;
}

function NotFoundPage() {
  return <main className="payz-not-found" data-testid="page-not-found">
    <p>404</p>
    <h1>This page isn&apos;t available.</h1>
    <Link href="/" className="button-primary" data-testid="link-not-found-home">Back to <PayzBrandText text="Payz" /></Link>
  </main>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <Switch>
      {DOC_ROUTES.map(path => <Route key={path} path={path} component={DocumentationSite} />)}
      <Route path="/how-it-works" component={HowItWorksPage} />
      {['/about', '/privacy', '/terms', '/contact'].map(path => <Route key={path} path={path} component={PublicInfoPage} />)}
      <Route path="/marketplace"><Redirect to="/app" /></Route>
      <Route path="/rewards"><Redirect to="/app/rewards" /></Route>
      <Route component={AppShell} />
    </Switch>
  </QueryClientProvider>;
}

function AppShell() {
  return <><GuestSessionBootstrap /><AppRoutes /></>;
}

let guestSessionBootstrap: Promise<void> | null = null;
function GuestSessionBootstrap() {
  const client = useQueryClient();
  useEffect(() => {
    if (!guestSessionBootstrap) {
      guestSessionBootstrap = createGuestSession()
        .then(() => undefined)
        .catch(error => {
          guestSessionBootstrap = null;
          throw error;
        });
    }
    void guestSessionBootstrap
      .then(() => client.invalidateQueries({ queryKey: ['/api/orders'] }))
      .catch(() => undefined);
  }, [client]);
  return null;
}

export default App;
