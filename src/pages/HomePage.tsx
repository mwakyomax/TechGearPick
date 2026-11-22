import { Link } from 'react-router-dom';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { HERO_IMAGE } from '../lib/adminCatalogSeed';
import { usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { SafeImage } from '../components/ui/SafeImage';
import { CategoryCard } from '../components/categories/CategoryCard';
import { FeaturedProduct } from '../components/products/FeaturedProduct';
import { ProductCard } from '../components/products/ProductCard';
import { ArticleCard } from '../components/blog/ArticleCard';
import { NewsletterForm } from '../components/blog/NewsletterForm';

export function HomePage() {
  const {
    loading,
    categories,
    products,
    reviews,
    comparisons,
    guides,
    articles,
    getFeaturedProducts,
  } = useCatalog();

  usePageSeo({
    title: 'TechGear Picks – Find the Right Tech. Make Smarter Choices.',
    description:
      'Discover expert buying guides, side-by-side product comparisons, and research-backed technology hardware reviews for modern workstations.',
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'TechGear Picks',
      description:
        'Independent technology product research, comparisons, and buying guides for computer accessories, networking equipment, PC upgrades, and IT tools.',
    },
  });

  const featuredProducts = getFeaturedProducts();
  const leadProduct = featuredProducts[0] || products[0];
  const topPicks = featuredProducts.slice(1, 4);
  const latestReviews = reviews.slice(0, 3);
  const latestArticles = articles.slice(0, 3);
  const isEmptyDatabase =
    !loading && categories.length === 0 && products.length === 0 && articles.length === 0;

  return (
    <div className="space-y-20 pb-8">
      {/* Hero Section */}
      <section className="bg-[#0B192C] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                TechGear Picks · Curated Electronics &amp; Amazon Shopping Guides
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold tracking-tight leading-[1.12] text-white">
                Upgrade Your Setup With Confidence.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Stop guessing over confusing spec sheets. Discover standout computer accessories, networking gear, PC upgrades, and pro-grade tools—then click straight through to order your pick securely on Amazon.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors min-h-[44px] whitespace-nowrap shrink-0"
                >
                  <span>Shop Featured Electronics</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/guides"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors min-h-[44px] whitespace-nowrap shrink-0"
                >
                  Read Buying Guides
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-64 sm:h-80 lg:h-full min-h-[320px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Modern engineering workstation with dual monitors, mechanical keyboard, ergonomic wireless mouse, and Thunderbolt dock"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
            Loading published hardware catalog from database...
          </div>
        </section>
      )}

      {isEmptyDatabase && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Firestore Database Ready for Initial Publishing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Your Cloud Firestore database is connected and waiting for catalog records. Sign in to the Admin CMS to add products, reviews, and articles—or import the verified hardware catalog in one click.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <span>Open Admin CMS</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Featured Categories
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Research organized across core workstation, networking, upgrade, and field-tool hardware.
              </p>
            </div>
            <Link
              to="/categories"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>
      )}

      {leadProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Top Picks
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Standout hardware selected from manufacturer specification audits and architectural comparisons.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Browse full catalog</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <FeaturedProduct product={leadProduct} eyebrow="Lead Recommendation" />

          {topPicks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPicks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {latestReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Latest Product Reviews
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Transparent, research-based analyses covering architecture, advantages, and real trade-offs.
              </p>
            </div>
            <Link
              to="/reviews"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>All product reviews</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {latestReviews.map((review) => {
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
                        <span className="font-medium text-blue-600">{review.methodologyLabel}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span>{formatDate(review.publishedAt)}</span>
                      </p>
                      <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                        <Link to={`/reviews/${review.slug}`} className="hover:text-blue-600 transition-colors">
                          {review.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.summary}</p>

                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
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
        </section>
      )}

      {(comparisons.length > 0 || guides.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    Product Comparisons
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Head-to-head breakdowns to settle hardware trade-offs.
                  </p>
                </div>
                <Link
                  to="/comparisons"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                >
                  All comparisons
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                {comparisons.map((comp) => (
                  <Link
                    key={comp.id}
                    to={`/comparisons/${comp.slug}`}
                    className="block p-5 hover:bg-slate-50 transition-colors group"
                  >
                    <p className="text-xs text-slate-500 mb-1">
                      {comp.category} · {comp.readingTimeMinutes} min read
                    </p>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {comp.title}
                      </h3>
                      <ArrowRight
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    Buying Guides
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Criteria-driven shortlists tailored to specific workflows.
                  </p>
                </div>
                <Link
                  to="/guides"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                >
                  All guides
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                {guides.map((guide) => (
                  <Link
                    key={guide.id}
                    to={`/guides/${guide.slug}`}
                    className="block p-5 hover:bg-slate-50 transition-colors group"
                  >
                    <p className="text-xs text-slate-500 mb-1">
                      {guide.category} · Updated {formatDate(guide.updatedAt)}
                    </p>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {guide.title}
                      </h3>
                      <ArrowRight
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {latestArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Latest Technology Articles
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Technical explainers on storage caching, cabling standards, GaN power delivery, and desk setups.
              </p>
            </div>
            <Link
              to="/blog"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Visit the blog</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterForm />
      </section>
    </div>
  );
}
