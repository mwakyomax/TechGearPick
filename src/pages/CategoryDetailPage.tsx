import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SafeImage } from '../components/ui/SafeImage';
import { ProductFilters, ProductSortOption } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { ArticleCard } from '../components/blog/ArticleCard';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

export function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSub = searchParams.get('sub') || 'all';

  const {
    loading,
    getCategoryBySlug,
    getProductsByCategory,
    articles,
    guides,
  } = useCatalog();

  const category = slug ? getCategoryBySlug(slug) : undefined;
  const categoryProducts = useMemo(
    () => (category ? getProductsByCategory(category.slug) : []),
    [category, getProductsByCategory],
  );

  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSub);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [sortBy, setSortBy] = useState<ProductSortOption>('newest');

  usePageSeo({
    title: category ? `${category.name} – Hardware & Buying Guides` : 'Category',
    description:
      category?.shortDescription ||
      'Browse technology hardware categories on TechGear Picks.',
    canonicalPath: category ? `/categories/${category.slug}` : '/categories',
    jsonLd: category
      ? buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
          { name: category.name, path: `/categories/${category.slug}` },
        ])
      : undefined,
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-600">
        Loading category from database...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">Category Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested equipment category does not exist or has not been published yet.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
        >
          Return to Categories
        </Link>
      </div>
    );
  }

  const availableBrands = Array.from(new Set(categoryProducts.map((p) => p.brand))).sort();
  const availableFeatures = ['Wireless', 'USB-C', '2.5GbE', 'PCIe 4.0', 'QMK', 'Rugged'].filter(
    (feat) =>
      categoryProducts.some(
        (p) =>
          p.name.toLowerCase().includes(feat.toLowerCase()) ||
          p.description.toLowerCase().includes(feat.toLowerCase()) ||
          p.features.some((f) => f.toLowerCase().includes(feat.toLowerCase())),
      ),
  );

  const filteredProducts = categoryProducts
    .filter((product) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSub =
        selectedSubcategory === 'all' ||
        product.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      const matchesFeature =
        selectedFeature === 'all' ||
        product.name.toLowerCase().includes(selectedFeature.toLowerCase()) ||
        product.description.toLowerCase().includes(selectedFeature.toLowerCase()) ||
        product.features.some((f) => f.toLowerCase().includes(selectedFeature.toLowerCase()));

      return matchesSub && matchesQuery && matchesBrand && matchesFeature;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'brand-asc') return a.brand.localeCompare(b.brand);
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    });

  const relevantArticles = articles.filter((a) => a.categorySlug === category.slug);
  const relevantGuides = guides.filter((g) => g.categorySlug === category.slug);

  const resetFilters = () => {
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedFeature('all');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Categories', to: '/categories' },
            { label: category.name },
          ]}
        />

        <section className="bg-[#0B192C] text-white rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch border border-slate-800">
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Hardware Category
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{category.name}</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {category.editorialOverview}
            </p>
          </div>
          <div className="lg:col-span-5 h-56 lg:h-auto">
            <SafeImage
              src={category.image}
              alt={category.imageAlt}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </div>

      <section aria-label="Subcategories" className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Subcategories in {category.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedSubcategory('all');
              setSearchParams({});
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedSubcategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All {category.name}
          </button>
          {category.subcategories.map((sub) => (
            <button
              key={sub.slug}
              type="button"
              onClick={() => {
                setSelectedSubcategory(sub.name);
                setSearchParams({ sub: sub.name });
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSubcategory.toLowerCase() === sub.name.toLowerCase()
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={category.slug}
          onCategoryChange={() => {}}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          selectedFeature={selectedFeature}
          onFeatureChange={setSelectedFeature}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableBrands={availableBrands}
          availableFeatures={availableFeatures}
          hasVerifiedPrices={false}
          hideCategorySelect
          onClearFilters={resetFilters}
          totalResults={filteredProducts.length}
        />

        <ProductGrid
          products={filteredProducts}
          emptyMessage={`No products listed yet for "${selectedSubcategory}" in ${category.name}.`}
          onResetFilters={resetFilters}
        />
      </section>

      {relevantGuides.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Related Buying Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relevantGuides.map((guide) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  <p className="text-xs text-blue-600 font-semibold mb-1.5">
                    Buying Guide · {guide.readingTimeMinutes} min read
                  </p>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{guide.excerpt}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <span>Open buying guide</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relevantArticles.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relevantArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      <AffiliateDisclosure variant="full" />
    </div>
  );
}
