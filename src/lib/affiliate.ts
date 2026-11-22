/**
 * Amazon Associates & PA-API Configuration Layer
 *
 * Configure VITE_AMAZON_ASSOCIATE_TAG in environment variables once approved.
 * Never scrape Amazon pages or fabricate live prices/ratings.
 */

export const AFFILIATE_CONFIG = {
  associateTag: (import.meta.env.VITE_AMAZON_ASSOCIATE_TAG as string | undefined) || '',
  welcomeBanner:
    'Welcome to TechGear Picks — we are an Amazon Associate! Explore top-rated electronics devices, smart workspace upgrades, and dependable hardware handpicked so you can shop on Amazon with total confidence.',
  disclosureShort:
    'Shop confidently with TechGear Picks — every featured electronics device links straight to Amazon for fast shipping, verified pricing, and trusted checkout.',
  disclosureFull:
    'Welcome to TechGear Picks — your trusted Amazon Associate guide for electronics and computer gear. We highlight proven keyboards, routers, SSDs, docking stations, and tech tools with clear, honest specs so you can choose the right upgrade and buy directly on Amazon with fast, secure delivery.',
  paApiEnabled: false,
} as const;

/**
 * Architectural interface for future Amazon Product Advertising API (PA-API 5.0)
 * server-side integration. Requires approved Associates credentials and backend proxy.
 */
export interface AmazonPaApiConfig {
  partnerTag: string;
  marketplace: 'www.amazon.com';
  region: 'us-east-1';
  credentialsConfigured: boolean;
}

export function getPaApiStatus(): AmazonPaApiConfig {
  return {
    partnerTag: AFFILIATE_CONFIG.associateTag || 'unconfigured',
    marketplace: 'www.amazon.com',
    region: 'us-east-1',
    credentialsConfigured: false,
  };
}

/**
 * Resolves a product's outbound Amazon URL, appending the configured Associate tag
 * only when a valid tag is supplied in environment configuration.
 */
export function resolveAffiliateUrl(baseUrl: string, customAffiliateUrl?: string): string {
  const target = customAffiliateUrl || baseUrl;
  try {
    const url = new URL(target);
    if (AFFILIATE_CONFIG.associateTag && !url.searchParams.has('tag')) {
      url.searchParams.set('tag', AFFILIATE_CONFIG.associateTag);
    }
    return url.toString();
  } catch {
    return target;
  }
}

export const AFFILIATE_LINK_REL = 'sponsored nofollow noopener noreferrer';
