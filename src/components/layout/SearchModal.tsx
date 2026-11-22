import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { SearchBar } from '../navigation/SearchBar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { products, reviews, comparisons, guides, articles } = useCatalog();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        products: products.slice(0, 4),
        articles: [
          ...reviews.slice(0, 2).map((r) => ({ id: r.id, title: r.title, to: `/reviews/${r.slug}`, kind: 'Review' })),
          ...comparisons.slice(0, 2).map((c) => ({ id: c.id, title: c.title, to: `/comparisons/${c.slug}`, kind: 'Comparison' })),
        ],
      };
    }

    const matchedProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q)),
      )
      .slice(0, 5);

    const matchedReviews = reviews
      .filter((r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q))
      .map((r) => ({ id: r.id, title: r.title, to: `/reviews/${r.slug}`, kind: 'Review' }));

    const matchedComparisons = comparisons
      .filter((c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q))
      .map((c) => ({ id: c.id, title: c.title, to: `/comparisons/${c.slug}`, kind: 'Comparison' }));

    const matchedGuides = guides
      .filter((g) => g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q))
      .map((g) => ({ id: g.id, title: g.title, to: `/guides/${g.slug}`, kind: 'Buying Guide' }));

    const matchedArticles = articles
      .filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
      .map((a) => ({ id: a.id, title: a.title, to: `/blog/${a.slug}`, kind: 'Article' }));

    return {
      products: matchedProducts,
      articles: [...matchedReviews, ...matchedComparisons, ...matchedGuides, ...matchedArticles].slice(0, 6),
    };
  }, [query, products, reviews, comparisons, guides, articles]);

  if (!isOpen) return null;

  const hasResults = results.products.length > 0 || results.articles.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search TechGear Picks"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs pt-16 px-4 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-200">
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search products, brands, routers, SSDs, reviews, guides..."
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="p-2.5 text-slate-500 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-6">
          {!hasResults ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-slate-900">No matching products or articles found.</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching by brand or hardware category.
              </p>
            </div>
          ) : (
            <>
              {results.products.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {query ? 'Matching Hardware' : 'Featured Products'}
                    </h2>
                    <Link
                      to={query ? `/products?q=${encodeURIComponent(query)}` : '/products'}
                      onClick={onClose}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>View all products</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {results.products.map((product) => {
                      const reviewMatch = reviews.find((r) => r.productId === product.id);
                      const dest = reviewMatch ? `/reviews/${reviewMatch.slug}` : `/categories/${product.category}`;
                      return (
                        <li key={product.id}>
                          <Link
                            to={dest}
                            onClick={onClose}
                            className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                              <p className="text-xs text-slate-500">
                                {product.brand} · {product.categoryName}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {results.articles.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                    {query ? 'Reviews, Comparisons & Guides' : 'Popular Editorial Reads'}
                  </h2>
                  <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {results.articles.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.kind}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
