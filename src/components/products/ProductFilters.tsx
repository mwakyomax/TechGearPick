import { useCatalog } from '../../context/CatalogContext';
import { SearchBar } from '../navigation/SearchBar';

export type ProductSortOption = 'newest' | 'name-asc' | 'brand-asc' | 'price-asc' | 'price-desc';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedBrand: string;
  onBrandChange: (value: string) => void;
  selectedFeature: string;
  onFeatureChange: (value: string) => void;
  sortBy: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
  availableBrands: string[];
  availableFeatures: string[];
  hasVerifiedPrices: boolean;
  hideCategorySelect?: boolean;
  onClearFilters: () => void;
  totalResults: number;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  selectedFeature,
  onFeatureChange,
  sortBy,
  onSortChange,
  availableBrands,
  availableFeatures,
  hasVerifiedPrices,
  hideCategorySelect = false,
  onClearFilters,
  totalResults,
}: ProductFiltersProps) {
  const { categories } = useCatalog();
  const hasActiveFilters =
    Boolean(searchQuery) ||
    (!hideCategorySelect && selectedCategory !== 'all') ||
    selectedBrand !== 'all' ||
    selectedFeature !== 'all';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className={hideCategorySelect ? 'md:col-span-5' : 'md:col-span-4'}>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {!hideCategorySelect && (
          <div className="md:col-span-3">
            <label htmlFor="filter-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 min-h-[42px]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label htmlFor="filter-brand" className="sr-only">
            Filter by brand
          </label>
          <select
            id="filter-brand"
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 min-h-[42px]"
          >
            <option value="all">All Brands</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className={hideCategorySelect ? 'md:col-span-3' : 'md:col-span-3'}>
          <label htmlFor="sort-products" className="sr-only">
            Sort products
          </label>
          <select
            id="sort-products"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
            className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 min-h-[42px]"
          >
            <option value="newest">Sort: Newest Research</option>
            <option value="name-asc">Sort: Name (A–Z)</option>
            <option value="brand-asc">Sort: Brand (A–Z)</option>
            {hasVerifiedPrices && (
              <>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by feature">
          <button
            type="button"
            onClick={() => onFeatureChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFeature === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Specs
          </button>
          {availableFeatures.map((feat) => (
            <button
              key={feat}
              type="button"
              onClick={() => onFeatureChange(feat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedFeature === feat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {feat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 tabular-nums">
          <span>
            Showing <strong className="text-slate-900">{totalResults}</strong>{' '}
            {totalResults === 1 ? 'product' : 'products'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
