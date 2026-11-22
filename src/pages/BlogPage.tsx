import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SearchBar } from '../components/navigation/SearchBar';
import { FeaturedArticle } from '../components/blog/FeaturedArticle';
import { ArticleCard } from '../components/blog/ArticleCard';
import { NewsletterForm } from '../components/blog/NewsletterForm';

export function BlogPage() {
  const { articles, categories, loading } = useCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  usePageSeo({
    title: 'Technology Blog & Hardware Guides',
    description:
      'In-depth editorial articles explaining NVMe DRAM caching, Cat6 vs Cat6a cabling, Thunderbolt workstation builds, and GaN power delivery.',
    canonicalPath: '/blog',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCat =
        selectedCategory === 'all' || article.categorySlug === selectedCategory;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <Breadcrumbs items={[{ label: 'Blog' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Technology Editorial &amp; Explainers
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Practical guides demystifying interface standards, storage endurance, home networking, and ergonomic setups.
        </p>
      </div>

      {!searchQuery && selectedCategory === 'all' && featuredArticle && (
        <FeaturedArticle article={featuredArticle} />
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search articles by topic or keyword..."
            label="Search blog articles"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-bold text-slate-900">
            No articles published yet
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Publish your first editorial explainer or import the starter hardware catalog in the Admin CMS.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Admin CMS
          </Link>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-base font-semibold text-slate-900">
            No articles match your search.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <NewsletterForm />
    </div>
  );
}
