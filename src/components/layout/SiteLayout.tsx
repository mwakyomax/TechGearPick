import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AffiliateDisclosure } from '../ui/AffiliateDisclosure';

interface SiteLayoutProps {
  children: ReactNode;
  showDisclosureBanner?: boolean;
}

export function SiteLayout({ children, showDisclosureBanner = true }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg text-sm font-medium"
      >
        Skip to main content
      </a>
      <Navbar />
      {showDisclosureBanner && <AffiliateDisclosure variant="banner" />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
