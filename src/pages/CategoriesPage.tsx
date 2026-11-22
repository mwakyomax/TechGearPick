import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { CategoryCard } from '../components/categories/CategoryCard';

export function CategoriesPage() {
  const { loading, categories } = useCatalog();

  usePageSeo({
    title: 'Hardware & Technology Categories',
    description:
      'Browse TechGear Picks categories covering Computer Accessories, Networking Equipment, PC Hardware, IT Technician Tools, Desk Productivity, and Tech Gadgets.',
    canonicalPath: '/categories',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
    ]),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <Breadcrumbs items={[{ label: 'Categories' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Product Categories
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Explore dedicated research hubs spanning desktop peripherals, structured networking, internal PC upgrades, and field diagnostics.
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
          Loading categories from database...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-base font-semibold text-slate-900">
            No categories published yet.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Open Admin CMS
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>

          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Complete Equipment Taxonomy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div key={category.slug} className="space-y-3">
                  <h3 className="font-display text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <Link
                      to={`/categories/${category.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          to={`/categories/${category.slug}?sub=${encodeURIComponent(sub.name)}`}
                          className="text-slate-700 hover:text-blue-600 font-medium block"
                        >
                          {sub.name}
                        </Link>
                        <p className="text-xs text-slate-500">{sub.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
