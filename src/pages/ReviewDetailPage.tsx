import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { ProsCons } from '../components/reviews/ProsCons';
import { CTAButton } from '../components/ui/CTAButton';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

export function ReviewDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { loading, getReviewBySlug, getProductBySlug, products, reviews } = useCatalog();

  const review = slug ? getReviewBySlug(slug) : undefined;
  const product = review ? products.find((p) => p.id === review.productId) : undefined;

  usePageSeo({
    title: review ? review.title : 'Product Review',
    description: review?.summary || 'Hardware research analysis on TechGear Picks.',
    canonicalPath: review ? `/reviews/${review.slug}` : '/reviews',
    ogType: 'article',
    jsonLd:
      review && product
        ? [
            buildBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Reviews', path: '/reviews' },
              { name: product.name, path: `/reviews/${review.slug}` },
            ]),
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: review.title,
              description: review.summary,
              datePublished: review.publishedAt,
              dateModified: review.updatedAt,
              author: {
                '@type': 'Person',
                name: review.authorName,
              },
            },
          ]
        : undefined,
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-600">
        Loading product review from database...
      </div>
    );
  }

  if (!review || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">Review Not Found</h1>
        <p className="text-sm text-slate-600">
          We could not locate the requested product analysis.
        </p>
        <Link
          to="/reviews"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
        >
          Browse All Reviews
        </Link>
      </div>
    );
  }

  const alternatives = review.alternativeSlugs
    .map((altSlug) => getProductBySlug(altSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        items={[
          { label: 'Reviews', to: '/reviews' },
          { label: product.categoryName, to: `/categories/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <article className="lg:col-span-8 space-y-10">
          <header className="space-y-4 pb-6 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-500">
              <span className="font-semibold text-blue-600 uppercase tracking-wider">
                {review.methodologyLabel}
              </span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Published {formatDate(review.publishedAt)}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Updated {formatDate(review.updatedAt)}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>{review.readingTimeMinutes} min read</span>
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {review.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {review.summary}
            </p>

            <p className="text-xs text-slate-600 pt-1">
              By <strong className="text-slate-900">{review.authorName}</strong> · {review.authorRole}
            </p>
          </header>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Methodology Notice:</strong> This evaluation is a{' '}
            <em>research-based product analysis</em> compiled from manufacturer technical specifications, interface standards, and documented user requirements—not a hands-on laboratory test. Verify live pricing and seller details directly on Amazon before purchasing.
          </div>

          <section className="space-y-3 max-w-prose">
            <h2 className="font-display text-2xl font-bold text-slate-900">Introduction</h2>
            <p className="text-base text-slate-700 leading-relaxed">{review.introduction}</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Technical Specifications
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <dl className="divide-y divide-slate-200 text-sm">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-5 py-3.5"
                  >
                    <dt className="font-semibold text-slate-700">{spec.label}</dt>
                    <dd className="sm:col-span-2 font-mono text-slate-900 tabular-nums">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-slate-900">Key Features</h2>
            <ul className="bg-white border border-slate-200 rounded-xl p-6 space-y-2.5 list-disc list-inside text-sm sm:text-base text-slate-700">
              {product.features.map((feat) => (
                <li key={feat} className="leading-relaxed">
                  {feat}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 max-w-prose">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Architecture &amp; Performance Overview
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              {review.performanceOverview}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Advantages &amp; Disadvantages
            </h2>
            <ProsCons pros={product.pros} cons={product.cons} />
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-slate-900">Best Use Cases</h2>
            <ul className="bg-white border border-slate-200 rounded-xl p-6 space-y-2.5 list-disc list-inside text-sm sm:text-base text-slate-700">
              {review.bestUseCases.map((useCase) => (
                <li key={useCase} className="leading-relaxed">
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Who Should Buy It
              </h2>
              <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside leading-relaxed">
                {review.whoShouldBuy.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Who Should Avoid It
              </h2>
              <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside leading-relaxed">
                {review.whoShouldAvoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {alternatives.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Notable Alternatives
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map((alt) => {
                  const altRev = reviews.find((r) => r.productId === alt.id);
                  return (
                    <div
                      key={alt.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs text-slate-500">
                          {alt.brand} · {alt.subcategory}
                        </p>
                        <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                          {alt.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                          {alt.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        {altRev && (
                          <Link
                            to={`/reviews/${altRev.slug}`}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Read review
                          </Link>
                        )}
                        <CTAButton
                          href={alt.amazonUrl}
                          customAffiliateUrl={alt.affiliateUrl}
                          label="View on Amazon"
                          variant="secondary"
                          size="sm"
                          productName={alt.name}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="bg-[#0B192C] text-white rounded-2xl p-8 space-y-4">
            <h2 className="font-display text-2xl font-bold">Final Verdict</h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {review.finalVerdict}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <CTAButton
                href={product.amazonUrl}
                customAffiliateUrl={product.affiliateUrl}
                label="Check Price on Amazon"
                size="lg"
                productName={product.name}
              />
              <Link
                to={`/categories/${product.category}`}
                className="text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4"
              >
                Explore more {product.categoryName}
              </Link>
            </div>
          </section>

          <AffiliateDisclosure variant="full" />
        </article>

        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <ReviewSummary product={product} review={review} />
        </div>
      </div>
    </div>
  );
}
