import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SafeImage } from '../components/ui/SafeImage';

export function ReviewsPage() {
  const { loading, reviews, products, categories } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState('all');

  usePageSeo({
    title: 'Product Reviews & Research Analyses',
    description:
      'Read transparent, research-based hardware reviews evaluating technical specifications, ergonomics, pros, cons, and ideal use cases.',
    canonicalPath: '/reviews',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Reviews', path: '/reviews' },
    ]),
  });

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (selectedCategory === 'all') return true;
      const product = products.find((p) => p.id === review.productId);
      return product?.category === selectedCategory;
    });
  }, [reviews, products, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'Reviews' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Product Reviews &amp; Hardware Analyses
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Every review clearly states its research methodology—grounded in verified manufacturer specifications, hardware architecture, and documented use-case trade-offs.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by category">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Reviews
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat.slug
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
          Loading product reviews from database...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-base font-semibold text-slate-900">
            No reviews published in this category yet.
          </p>
          {selectedCategory !== 'all' ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
            >
              Show all reviews
            </button>
          ) : (
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Publish Reviews in Admin CMS
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => {
            const product = products.find((p) => p.id === review.productId);
            if (!product) return null;
            return (
              <article
                key={review.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                <Link to={`/reviews/${review.slug}`} className="block aspect-[4/3] bg-slate-100">
                  <SafeImage
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-blue-600">{review.methodologyLabel}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{formatDate(review.updatedAt)}</span>
                    </p>
                    <h2 className="font-display text-lg font-bold text-slate-900 leading-snug">
                      <Link to={`/reviews/${review.slug}`} className="hover:text-blue-600 transition-colors">
                        {review.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{review.summary}</p>
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      {product.pros.slice(0, 2).map((pro) => (
                        <p key={pro} className="flex items-start gap-2 text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{pro}</span>
                        </p>
                      ))}
                      {product.cons.slice(0, 1).map((con) => (
                        <p key={con} className="flex items-start gap-2 text-slate-500">
                          <Minus className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{con}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/reviews/${review.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors min-h-[40px]"
                  >
                    <span>Read Full Review</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
