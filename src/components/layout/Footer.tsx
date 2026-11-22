import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { AFFILIATE_CONFIG } from '../../lib/affiliate';

export function Footer() {
  const year = new Date().getFullYear();
  const { categories } = useCatalog();

  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-lg font-bold text-white tracking-tight inline-block">
              TechGear Picks
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              Find the Right Tech. Upgrade With Confidence. Your Amazon Associate destination for curated electronics, clear comparisons, and gear that powers better work.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs font-medium text-slate-400">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechGear Picks on X"
                className="hover:text-white transition-colors"
              >
                X / Twitter
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechGear Picks on LinkedIn"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechGear Picks on YouTube"
                className="hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Editorial Navigation */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Editorial
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Product Reviews
                </Link>
              </li>
              <li>
                <Link to="/comparisons" className="hover:text-white transition-colors">
                  Product Comparisons
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-white transition-colors">
                  Buying Guides
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Technology Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Categories
            </h2>
            <ul className="space-y-2.5 text-sm">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/categories/${category.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/categories" className="hover:text-white transition-colors">
                    Browse Categories
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company & Compliance */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Company &amp; Legal
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="hover:text-white transition-colors">
                  Buyer Promise
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin CMS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Shopping Promise & Copyright */}
        <div className="pt-8 space-y-3 text-xs text-slate-400 leading-relaxed">
          <p>{AFFILIATE_CONFIG.disclosureFull}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
            <p>© {year} TechGear Picks. All rights reserved.</p>
            <p>Curated electronics recommendations &amp; direct Amazon shopping guides.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
