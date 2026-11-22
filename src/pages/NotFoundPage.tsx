import { Link } from 'react-router-dom';
import { usePageSeo } from '../lib/seo';

export function NotFoundPage() {
  usePageSeo({
    title: 'Page Not Found',
    description: 'The requested page could not be found on TechGear Picks.',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
      <p className="font-mono text-sm font-semibold text-blue-600">404</p>
      <h1 className="font-display text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
        The URL you requested does not match an active guide, review, or category page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/products"
          className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
        >
          Explore Products
        </Link>
      </div>
    </div>
  );
}
