import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { MobileNavbar } from './MobileNavbar';
import { SearchModal } from './SearchModal';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Comparisons', to: '/comparisons' },
  { label: 'Buying Guides', to: '/guides' },
  { label: 'Categories', to: '/categories' },
  { label: 'Blog', to: '/blog' },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Wordmark */}
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors"
          >
            TechGear Picks
          </Link>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-slate-900 border-blue-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Search icon + Primary Action / Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open site search"
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            <Link
              to="/products"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              Explore Products
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavbar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
        currentPath={location.pathname}
      />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
