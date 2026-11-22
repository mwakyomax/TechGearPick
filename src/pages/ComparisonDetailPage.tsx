import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ProductComparisonTable } from '../components/comparisons/ProductComparisonTable';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

export function ComparisonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { comparisons, getComparisonBySlug, loading } = useCatalog();
  const comparison = slug ? getComparisonBySlug(slug) : undefined;

  usePageSeo({
    title: comparison ? comparison.title : 'Comparison Not Found',
    description: comparison?.summary || 'Side-by-side technology hardware comparison.',
    canonicalPath: comparison ? `/comparisons/${comparison.slug}` : '/comparisons',
    ogType: 'article',
    jsonLd: comparison
      ? buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Comparisons', path: '/comparisons' },
          { name: comparison.title, path: `/comparisons/${comparison.slug}` },
        ])
      : undefined,
  });

  if (loading && !comparison) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="h-10 w-2/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">Comparison Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested comparison article could not be found.
        </p>
        <Link
          to="/comparisons"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
        >
          View All Comparisons
        </Link>
      </div>
    );
  }

  const otherComparisons = comparisons.filter((c) => c.slug !== comparison.slug).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Comparisons', to: '/comparisons' },
            { label: comparison.title },
          ]}
        />

        <header className="space-y-4 pb-6 border-b border-slate-200 max-w-4xl">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-blue-600 uppercase tracking-wider">
              {comparison.category}
            </span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Updated {formatDate(comparison.updatedAt)}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>{comparison.readingTimeMinutes} min read</span>
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {comparison.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {comparison.subtitle}
          </p>
        </header>
      </div>

      {/* Responsive Side-by-Side Comparison Cards & Table */}
      <ProductComparisonTable options={comparison.options} matrix={comparison.matrix} />

      {/* Deep Dive Narrative */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Performance &amp; Technical Differences
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {comparison.performanceDifferences}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Value for Money Analysis
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {comparison.valueComparison}
          </p>
        </div>
      </section>

      {/* Recommendations by User Profile */}
      <section className="bg-[#0B192C] text-white rounded-2xl p-8 space-y-6">
        <h2 className="font-display text-2xl font-bold">Which One Should You Choose?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparison.recommendations.map((rec) => (
            <div
              key={rec.userProfile}
              className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 space-y-2"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {rec.userProfile}
              </p>
              <h3 className="font-display text-lg font-bold text-white">
                {rec.recommendedOption}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{rec.reasoning}</p>
            </div>
          ))}
        </div>
      </section>

      <AffiliateDisclosure variant="full" />

      {/* More Comparisons */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="font-display text-xl font-bold text-slate-900">More Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherComparisons.map((item) => (
            <Link
              key={item.id}
              to={`/comparisons/${item.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-colors"
            >
              <p className="text-xs text-slate-500 mb-1">{item.category}</p>
              <p className="font-display text-sm font-bold text-slate-900">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
