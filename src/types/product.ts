export type CategorySlug =
  | 'computer-accessories'
  | 'networking-equipment'
  | 'pc-hardware'
  | 'it-technician-tools'
  | 'desk-productivity'
  | 'tech-gadgets';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  categoryName: string;
  subcategory: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Verified manufacturer list price or verified snapshot price when available; undefined if dynamic/unverified */
  price?: number;
  priceNote?: string;
  currency: 'USD';
  amazonUrl: string;
  affiliateUrl: string;
  amazonAsin?: string;
  specifications: ProductSpecification[];
  features: string[];
  pros: string[];
  cons: string[];
  /** Only populated when verified from an explicit external source */
  rating?: number;
  reviewCount?: number;
  availability: 'Check Availability' | 'Widely Available' | 'Discontinued';
  featured: boolean;
  publicationDate: string;
  keywords: string[];
}

export interface ProductReview {
  id: string;
  slug: string;
  productId: string;
  title: string;
  methodologyLabel: 'Research-Based Technical Analysis';
  summary: string;
  introduction: string;
  performanceOverview: string;
  bestUseCases: string[];
  whoShouldBuy: string[];
  whoShouldAvoid: string[];
  alternativeSlugs: string[];
  finalVerdict: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
}

export interface ComparisonRow {
  criterion: string;
  values: Record<string, string>;
}

export interface ComparisonOption {
  id: string;
  name: string;
  brand: string;
  productSlug?: string;
  image: string;
  imageAlt: string;
  intendedUser: string;
  priceTier: string;
  pros: string[];
  cons: string[];
  affiliateUrl?: string;
}

export interface ComparisonArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  summary: string;
  image: string;
  imageAlt: string;
  options: ComparisonOption[];
  matrix: ComparisonRow[];
  performanceDifferences: string;
  valueComparison: string;
  recommendations: {
    userProfile: string;
    recommendedOption: string;
    reasoning: string;
  }[];
}
