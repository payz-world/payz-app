import type { IconType } from 'react-icons';
import {
  SiAdidas, SiAirbnb, SiApple, SiAircanada, SiAuchan, SiBattledotnet, SiBookingdotcom, SiCarrefour,
  SiDazn, SiDeliveroo, SiDoordash, SiEbay, SiGoogle, SiGoogleplay, SiGooglegemini,
  SiGrab, SiIkea, SiMcdonalds, SiNetflix, SiNike, SiNordvpn, SiNotion,
  SiPlaystation, SiRakuten, SiRoblox, SiShopee, SiSpotify, SiStarbucks,
  SiSteam, SiSwiggy, SiTarget, SiTesco, SiUber, SiUbereats, SiUniqlo, SiYoutube, SiZara, SiFnac, SiRewe, SiMarriott,
} from 'react-icons/si';
import { FaAmazon, FaXbox } from 'react-icons/fa6';
import brandDomains from './brand-logo-domains.json';
import highResolutionAssets from './brand-high-resolution-assets.json';

export type BrandArtwork = {
  color: string;
  background: string;
  Icon?: IconType;
  asset?: string;
};

// Brand colors describe the actual identity, not product availability. Unknown
// brands have unavailable artwork; we never invent a logo or a text wordmark.
const artwork: Record<string, BrandArtwork> = {
  'amazon fresh': { color: '#008A00', background: '#EDF8E9', asset: 'amazon-fresh.png' },
  amazon: { color: '#232F3E', background: '#FFF1DC', Icon: FaAmazon },
  decathlon: { color: '#0082C3', background: '#E8F4FC' },
  shell: { color: '#DD1D21', background: '#FFF8D8', asset: 'shell.png' },
  starbucks: { color: '#00704A', background: '#E6F3EC', Icon: SiStarbucks },
  traveloka: { color: '#0194F3', background: '#E6F4FF' },
  xbox: { color: '#107C10', background: '#EAF5E6', Icon: FaXbox },
  adidas: { color: '#111111', background: '#F1F0EC', Icon: SiAdidas },
  dunkin: { color: '#F58220', background: '#FFF0E8', asset: 'dunkin.png' },
  roblox: { color: '#202227', background: '#EEF0F5', Icon: SiRoblox },
  'battle net': { color: '#148EFF', background: '#E6F2FF', Icon: SiBattledotnet },
  nike: { color: '#111111', background: '#F2F0E9', Icon: SiNike },
  'ntuc fairprice': { color: '#235E91', background: '#EAF2FA', asset: 'fairprice.png' },
  fairprice: { color: '#235E91', background: '#EAF2FA', asset: 'fairprice.png' },
  netflix: { color: '#E50914', background: '#FDEDEE', Icon: SiNetflix },
  spotify: { color: '#1DB954', background: '#E8F7ED', Icon: SiSpotify },
  apple: { color: '#151515', background: '#F0F0F3', Icon: SiApple },
  'app store': { color: '#151515', background: '#EAF2FF', Icon: SiApple },
  'google play': { color: '#01875F', background: '#EAF7F1', asset: 'google-play-icon.svg', Icon: SiGoogleplay },
  'google gemini': { color: '#4285F4', background: '#EDF0FF', Icon: SiGooglegemini },
  gemini: { color: '#4285F4', background: '#EDF0FF', Icon: SiGooglegemini },
  google: { color: '#4285F4', background: '#F0F4FA', asset: 'google-icon.svg', Icon: SiGoogle },
  steam: { color: '#171D25', background: '#E9EFF5', Icon: SiSteam },
  playstation: { color: '#003791', background: '#E8EEFA', Icon: SiPlaystation },
  nintendo: { color: '#E60012', background: '#FFECEF' },
  'uber eats': { color: '#06A85A', background: '#E6F7ED', Icon: SiUbereats },
  uber: { color: '#111111', background: '#EEEEEB', Icon: SiUber },
  airbnb: { color: '#FF5A5F', background: '#FFECEE', Icon: SiAirbnb },
  'booking com': { color: '#003B95', background: '#EAF0FC', Icon: SiBookingdotcom },
  doordash: { color: '#FF3008', background: '#FFECE5', Icon: SiDoordash },
  deliveroo: { color: '#008E8B', background: '#E5F6F4', Icon: SiDeliveroo },
  mcdonalds: { color: '#FFC72C', background: '#DA291C', Icon: SiMcdonalds },
  'mcdonald s': { color: '#FFC72C', background: '#DA291C', Icon: SiMcdonalds },
  target: { color: '#CC0000', background: '#FDEAEA', Icon: SiTarget },
  walmart: { color: '#0071CE', background: '#FFF4D8' },
  'best buy': { color: '#111111', background: '#FFF3BD' },
  ikea: { color: '#0058A3', background: '#FFF6C5', Icon: SiIkea },
  'h m': { color: '#CC071E', background: '#FCECEF' },
  zara: { color: '#111111', background: '#F4EFEA', Icon: SiZara },
  uniqlo: { color: '#FF0000', background: '#FFF0EF', Icon: SiUniqlo },
  sephora: { color: '#111111', background: '#F4EBF2' },
  asos: { color: '#111111', background: '#F2EDEA' },
  ebay: { color: '#E53238', background: '#FFF1E9', Icon: SiEbay },
  youtube: { color: '#FF0000', background: '#FFEEEE', Icon: SiYoutube },
  disney: { color: '#113CCF', background: '#E9EDFF' },
  hulu: { color: '#07883E', background: '#EAF8E5' },
  'amc theatres': { color: '#E31837', background: '#FFF0F1' },
  dazn: { color: '#101010', background: '#F2F4D7', Icon: SiDazn },
  nordvpn: { color: '#4687FF', background: '#EAF1FF', Icon: SiNordvpn },
  notion: { color: '#111111', background: '#F3F0EC', Icon: SiNotion },
  adobe: { color: '#EB1000', background: '#FFEDE8' },
  canva: { color: '#008D9D', background: '#E4F7F8' },
  microsoft: { color: '#5E5E5E', background: '#F5EEE5' },
  grab: { color: '#00A859', background: '#E4F6EA', Icon: SiGrab },
  shopee: { color: '#EE4D2D', background: '#FFECE5', Icon: SiShopee },
  lazada: { color: '#FF5F00', background: '#FFF0E5' },
  tokopedia: { color: '#03AC0E', background: '#EAF7E9' },
  gojek: { color: '#00880D', background: '#E8F5E8' },
  gofood: { color: '#EE2737', background: '#FFECED' },
  carrefour: { color: '#004E9F', background: '#EAF1FA', Icon: SiCarrefour },
  tesco: { color: '#EE1C2E', background: '#FFECEF', Icon: SiTesco },
  rakuten: { color: '#BF0000', background: '#FBEAEA', Icon: SiRakuten },
  coles: { color: '#E01A22', background: '#FDEDEE' },
  woolworths: { color: '#267F2B', background: '#EAF4E4' },
  'tim hortons': { color: '#C8102E', background: '#F9EBE7' },
  kfc: { color: '#E4002B', background: '#FFEDEE' },
  subway: { color: '#008938', background: '#FFF5DA' },
  'pizza hut': { color: '#EE3124', background: '#FDEEE7' },
  'burger king': { color: '#D62300', background: '#F8E8CE' },
  'chevron': { color: '#0066B2', background: '#E9F2FB' },
  'dick s sporting goods': { color: '#006747', background: '#E7F2EB' },
  'academy sports': { color: '#003A70', background: '#E8F0FA' },
  fanatics: { color: '#E31837', background: '#FFEDF0' },
  'air canada': { color: '#F01428', background: '#FFEDF0', Icon: SiAircanada },
  fnac: { color: '#E1A925', background: '#FFF4DA', Icon: SiFnac },
  rewe: { color: '#CC071E', background: '#FCECEF', Icon: SiRewe },
  auchan: { color: '#D6180B', background: '#FDECEE', Icon: SiAuchan },
  swiggy: { color: '#FC8019', background: '#FFF0E3', Icon: SiSwiggy },
  marriott: { color: '#A70023', background: '#EDF1F5', Icon: SiMarriott },
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[®™]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function getBrandArtwork(brand: string, logoKey = ''): BrandArtwork {
  const identities = [normalize(brand), normalize(logoKey)];
  // Most-specific aliases win (Amazon Fresh, Uber Eats, Google Play).
  const domains: Record<string, string> = brandDomains;
  const highResolution: Record<string, string> = highResolutionAssets;
  const alias = [...new Set([...Object.keys(artwork), ...Object.keys(domains), ...Object.keys(highResolution)])].sort((a, b) => b.length - a.length)
    .find((key) => identities.some((value) => value === key || value.startsWith(`${key} `)));
  const presentation = alias && artwork[alias] ? artwork[alias] : { color: '#293342', background: '#EDF1F5' };
  const domain = alias ? domains[alias] : undefined;
  const highResolutionAsset = alias ? highResolution[alias] : undefined;
  if (highResolutionAsset) return { ...presentation, asset: highResolutionAsset };
  // Native brand vectors and curated assets take precedence over tiny favicons.
  if (presentation.Icon || presentation.asset) return presentation;
  return domain ? {
    ...presentation,
    asset: `website-${domain.replaceAll('.', '-')}.png`,
  } : presentation;
}

export function brandAssetUrl(asset: string): string {
  return `${import.meta.env.BASE_URL}brand-logos/${asset}`;
}
