import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface NavLinkItem {
  label: string;
  to: string;
}

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLinkItem[];
  currentPath: string;
}

export function MobileNavbar({ isOpen, onClose, links, currentPath }: MobileNavbarProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden bg-slate-950/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs ml-auto h-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <span className="font-display text-base font-bold text-slate-900">TechGear Picks</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile Primary Navigation" className="mt-6 flex flex-col gap-1">
            {links.map((link) => {
              const isActive =
                link.to === '/' ? currentPath === '/' : currentPath.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    isActive
                      ? 'bg-slate-100 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-3">
          <Link
            to="/products"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            Explore Products
          </Link>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <Link to="/about" onClick={onClose} className="hover:text-slate-900">
              About
            </Link>
            <Link to="/contact" onClick={onClose} className="hover:text-slate-900">
              Contact
            </Link>
            <Link to="/affiliate-disclosure" onClick={onClose} className="hover:text-slate-900">
              Buyer Promise
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
