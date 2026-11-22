import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SafeImage } from '../components/ui/SafeImage';

export function GuidesPage() {
  const { guides, loading } = useCatalog();

  usePageSeo({
    title: 'Technology Buying Guides',
    description:
      'Criteria-based buying guides for students, IT technicians, laptop SSD upgrades, beginner networking tools, and small business routers.',
    canonicalPath: '/guides',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Buying Guides', path: '/guides' },
    ]),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'Buying Guides' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Expert Buying Guides
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Practical shortlists explaining what specifications actually matter before you buy—and which products fit distinct budgets and environments.
        </p>
      </div>

      {loading && guides.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : guides.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-bold text-slate-900">
            No buying guides published yet
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Seed the initial hardware catalog from the Admin CMS to populate buying guides.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Admin CMS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <article
              key={guide.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <Link to={`/guides/${guide.slug}`} className="block aspect-[4/3] bg-slate-100">
                <SafeImage
                  src={guide.image}
                  alt={guide.imageAlt}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-blue-600">{guide.category}</span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>Updated {formatDate(guide.updatedAt)}</span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>{guide.readingTimeMinutes} min read</span>
                  </p>
                  <h2 className="font-display text-lg font-bold text-slate-900 leading-snug">
                    <Link to={`/guides/${guide.slug}`} className="hover:text-blue-600 transition-colors">
                      {guide.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{guide.excerpt}</p>
                </div>
                <Link
                  to={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
                >
                  <span>Read buying guide</span>
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
