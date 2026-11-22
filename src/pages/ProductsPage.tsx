import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ProductFilters, ProductSortOption } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

const PAGE_SIZE = 9;

export function ProductsPage() {
  const { loading, products } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [sortBy, setSortBy] = useState<ProductSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  usePageSeo({
    title: 'All Technology Products & Hardware Directory',
    description:
      'Search and filter researched computer accessories, networking routers, NVMe SSDs, IT technician tools, and Thunderbolt docks.',
    canonicalPath: '/products',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
    ]),
  });

  const availableBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  );

  const availableFeatures = ['Wireless', 'USB-C', '2.5GbE', 'PCIe 4.0', 'QMK', 'Rugged'];

  const hasVerifiedPrices = useMemo(
    () => products.some((p) => typeof p.price === 'number'),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
        product.subcategory.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.keywords.some((k) => k.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;

      const matchesFeature =
        selectedFeature === 'all' ||
        product.name.toLowerCase().includes(selectedFeature.toLowerCase()) ||
        product.description.toLowerCase().includes(selectedFeature.toLowerCase()) ||
        product.features.some((f) => f.toLowerCase().includes(selectedFeature.toLowerCase())) ||
        product.specifications.some((s) =>
          s.value.toLowerCase().includes(selectedFeature.toLowerCase()),
        );

      return matchesQuery && matchesCategory && matchesBrand && matchesFeature;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'brand-asc') return a.brand.localeCompare(b.brand);
      if (sortBy === 'price-asc') return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      if (sortBy === 'price-desc') return (b.price ?? 0) - (a.price ?? 0);
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedFeature, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedFeature('all');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: 'Products' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Technology Product Directory
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Filter hardware across categories, brands, and technical specifications. Click any item to read our research analysis or verify live pricing on Amazon.
        </p>
      </div>

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          setCurrentPage(1);
        }}
        selectedBrand={selectedBrand}
        onBrandChange={(val) => {
          setSelectedBrand(val);
          setCurrentPage(1);
        }}
        selectedFeature={selectedFeature}
        onFeatureChange={(val) => {
          setSelectedFeature(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        availableBrands={availableBrands}
        availableFeatures={availableFeatures}
        hasVerifiedPrices={hasVerifiedPrices}
        onClearFilters={handleClearFilters}
        totalResults={filteredProducts.length}
      />

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
          Loading products from database...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-base font-semibold text-slate-900">
            No products published in Firestore yet.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Publish Products in Admin CMS
          </Link>
        </div>
      ) : (
        <ProductGrid products={paginatedProducts} onResetFilters={handleClearFilters} />
      )}

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AffiliateDisclosure variant="full" />
    </div>
  );
}
