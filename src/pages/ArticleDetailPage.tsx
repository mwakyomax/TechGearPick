import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Copy, Share2 } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SafeImage } from '../components/ui/SafeImage';
import { ArticleCard } from '../components/blog/ArticleCard';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, getArticleBySlug, loading } = useCatalog();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const [copied, setCopied] = useState(false);

  usePageSeo({
    title: article ? article.title : 'Article Not Found',
    description: article?.excerpt || 'Technology editorial on TechGear Picks.',
    canonicalPath: article ? `/blog/${article.slug}` : '/blog',
    ogType: 'article',
    jsonLd: article
      ? [
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: article.title, path: `/blog/${article.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: { '@type': 'Person', name: article.author.name },
          },
        ]
      : undefined,
  });

  if (loading && !article) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="h-10 w-2/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">Article Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested article could not be located.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const relatedArticles = article.relatedSlugs
    .map((relSlug) => articles.find((a) => a.slug === relSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        items={[
          { label: 'Blog', to: '/blog' },
          { label: article.category, to: `/categories/${article.categorySlug}` },
          { label: article.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <article className="lg:col-span-8 space-y-8">
          <header className="space-y-4 pb-6 border-b border-slate-200">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-blue-600 uppercase tracking-wider">
                {article.category}
              </span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Published {formatDate(article.publishedAt)}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Updated {formatDate(article.updatedAt)}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>{article.readingTimeMinutes} min read</span>
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-600">
                By <strong className="text-slate-900">{article.author.name}</strong> ·{' '}
                {article.author.role}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 min-h-[36px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 min-h-[36px]"
                >
                  <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Share on X</span>
                </a>
              </div>
            </div>
          </header>

          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <SafeImage
              src={article.image}
              alt={article.imageAlt}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Sections */}
          <div className="space-y-8 max-w-prose">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-4 scroll-mt-24">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-base text-slate-700 leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bulletPoints && (
                  <ul className="list-disc list-inside space-y-2 text-base text-slate-700 pt-1">
                    {section.bulletPoints.map((bp) => (
                      <li key={bp} className="leading-relaxed">
                        {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Author Bio */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              About the Author
            </p>
            <h3 className="font-display text-base font-bold text-slate-900">
              {article.author.name} — {article.author.role}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{article.author.bio}</p>
          </section>

          <AffiliateDisclosure variant="full" />
        </article>

        {/* Table of Contents Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
              Table of Contents
            </h2>
            <nav aria-label="Article sections">
              <ol className="space-y-2.5 text-sm">
                {article.tableOfContents.map((item, idx) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-slate-600 hover:text-blue-600 transition-colors flex items-baseline gap-2"
                    >
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200 space-y-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
