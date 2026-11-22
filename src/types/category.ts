import { CategorySlug } from './product';

export interface SubcategoryItem {
  name: string;
  slug: string;
  description: string;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  editorialOverview: string;
  image: string;
  imageAlt: string;
  subcategories: SubcategoryItem[];
}
