import { CategorySlug } from './product';

export interface Author {
  name: string;
  role: string;
  bio: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: CategorySlug;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  featured: boolean;
  image: string;
  imageAlt: string;
  author: Author;
  tableOfContents: TableOfContentsItem[];
  sections: ArticleSection[];
  relatedSlugs: string[];
}

export interface BuyingGuidePick {
  pickLabel: string;
  productSlug: string;
  rationale: string;
}

export interface BuyingGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: CategorySlug;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  image: string;
  imageAlt: string;
  author: Author;
  buyingCriteria: {
    title: string;
    detail: string;
  }[];
  picks: BuyingGuidePick[];
  closingAdvice: string;
}
