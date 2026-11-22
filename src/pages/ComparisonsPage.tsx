import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SafeImage } from '../components/ui/SafeImage';

export function ComparisonsPage() {
  const { comparisons, loading } = useCatalog();

  usePageSeo({
    title: 'Product Comparisons & Technology Matchups',
    description:
      'Side-by-side hardware comparisons covering Wi-Fi 6 vs Wi-Fi 7, SSD vs HDD, mechanical vs membrane keyboards, and USB-C hubs vs docks.',
    canonicalPath: '/comparisons',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Comparisons', path: '/comparisons' },
    ]),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'Comparisons' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Product &amp; Architecture Comparisons
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Clear side-by-side specification matrices and trade-off analyses tailored to different budgets and technical workflows.
        </p>
      </div>

      {loading && comparisons.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : comparisons.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-bold text-slate-900">
            No comparisons published yet
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Seed the initial hardware catalog or publish a new comparison from the Admin CMS.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Admin CMS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((comp) => (
            <article
              key={comp.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <Link to={`/comparisons/${comp.slug}`} className="block aspect-[16/9] bg-slate-100">
                <SafeImage
                  src={comp.image}
                  alt={comp.imageAlt}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-blue-600">{comp.category}</span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>Updated {formatDate(comp.updatedAt)}</span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>{comp.readingTimeMinutes} min read</span>
                  </p>
                  <h2 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    <Link to={`/comparisons/${comp.slug}`} className="hover:text-blue-600 transition-colors">
                      {comp.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{comp.summary}</p>
                </div>
                <Link
                  to={`/comparisons/${comp.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
                >
                  <span>View full comparison table</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
