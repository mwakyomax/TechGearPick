import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  emptyMessage = 'No products match your selected filters.',
  onResetFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
        <p className="font-display text-base font-semibold text-slate-900">{emptyMessage}</p>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Try clearing one or more active filters or broadening your search keyword.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600 transition-colors min-h-[40px]"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
