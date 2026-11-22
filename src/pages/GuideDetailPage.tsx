import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SafeImage } from '../components/ui/SafeImage';
import { CTAButton } from '../components/ui/CTAButton';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getGuideBySlug, getProductBySlug, reviews, loading } = useCatalog();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  usePageSeo({
    title: guide ? guide.title : 'Buying Guide Not Found',
    description: guide?.excerpt || 'Technology buying guide on TechGear Picks.',
    canonicalPath: guide ? `/guides/${guide.slug}` : '/guides',
    ogType: 'article',
    jsonLd: guide
      ? [
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Buying Guides', path: '/guides' },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.excerpt,
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt,
            author: { '@type': 'Person', name: guide.author.name },
          },
        ]
      : undefined,
  });

  if (loading && !guide) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="h-10 w-2/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">Buying Guide Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested buying guide could not be located.
        </p>
        <Link
          to="/guides"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
        >
          Browse All Guides
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Buying Guides', to: '/guides' },
            { label: guide.category, to: `/categories/${guide.categorySlug}` },
            { label: guide.title },
          ]}
        />

        <header className="space-y-4 pb-6 border-b border-slate-200">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-blue-600 uppercase tracking-wider">
              {guide.category}
            </span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Published {formatDate(guide.publishedAt)}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Updated {formatDate(guide.updatedAt)}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>{guide.readingTimeMinutes} min read</span>
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {guide.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {guide.excerpt}
          </p>
          <p className="text-xs text-slate-600">
            By <strong className="text-slate-900">{guide.author.name}</strong> · {guide.author.role}
          </p>
        </header>
      </div>

      <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        <SafeImage
          src={guide.image}
          alt={guide.imageAlt}
          loading="eager"
          className="w-full h-full object-cover"
        />
      </div>

      {/* What to Look For */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          What Matters Most Before You Buy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guide.buyingCriteria.map((criterion, idx) => (
            <div
              key={criterion.title}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-2"
            >
              <p className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                0{idx + 1}.
              </p>
              <h3 className="font-display text-base font-bold text-slate-900">
                {criterion.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{criterion.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Picks */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Recommended Hardware Picks
        </h2>
        <div className="space-y-6">
          {guide.picks.map((pick) => {
            const product = getProductBySlug(pick.productSlug);
            if (!product) return null;
            const review = reviews.find((r) => r.productId === product.id);

            return (
              <article
                key={pick.productSlug}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch"
              >
                <div className="md:col-span-4 bg-slate-100">
                  <SafeImage
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-full h-56 md:h-full object-cover"
                  />
                </div>
                <div className="md:col-span-8 p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {pick.pickLabel}
                    </p>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{pick.rationale}</p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-3 border-t border-slate-100 text-xs">
                      {product.specifications.slice(0, 4).map((spec) => (
                        <div key={spec.label} className="flex justify-between gap-2">
                          <dt className="text-slate-500">{spec.label}</dt>
                          <dd className="font-mono text-slate-800 text-right tabular-nums">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <CTAButton
                      href={product.amazonUrl}
                      customAffiliateUrl={product.affiliateUrl}
                      label="Check Price on Amazon"
                      size="sm"
                      productName={product.name}
                    />
                    {review && (
                      <Link
                        to={`/reviews/${review.slug}`}
                        className="inline-flex items-center px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 min-h-[40px]"
                      >
                        Read Full Review
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Closing Advice */}
      <section className="bg-slate-100 border border-slate-200 rounded-xl p-6 space-y-2">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Practical Next Step
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {guide.closingAdvice}
        </p>
      </section>

      <AffiliateDisclosure variant="full" />
    </div>
  );
}
