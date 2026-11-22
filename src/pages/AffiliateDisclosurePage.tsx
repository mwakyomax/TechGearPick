import { AFFILIATE_CONFIG } from '../lib/affiliate';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export function AffiliateDisclosurePage() {
  usePageSeo({
    title: 'Amazon Shopping Promise & Buyer Guide',
    description:
      'Discover how TechGear Picks helps you find dependable electronics devices and shop safely on Amazon with confidence.',
    canonicalPath: '/affiliate-disclosure',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Buyer Promise', path: '/affiliate-disclosure' },
    ]),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: 'Buyer Promise' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Your Amazon Electronics Shopping Promise
        </h1>
        <p className="text-xs text-slate-500 mt-2">Last updated: November 2026</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
        <p className="font-semibold text-slate-900">
          {AFFILIATE_CONFIG.disclosureFull}
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Seamless Direct Shopping on Amazon
          </h2>
          <p>
            Every “Check Price on Amazon” and “View on Amazon” button on TechGear Picks takes you straight to the official Amazon product listing. You enjoy full Amazon buyer protection, live availability, fast Prime-eligible delivery options, and hassle-free returns—at the exact price listed on Amazon.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Live Pricing &amp; Verified Specifications
          </h2>
          <p>
            Electronics pricing and inventory update continuously throughout the day. Clicking through directly to Amazon ensures you always see real-time pricing, current bundles, and authentic warranty coverage before completing your order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Built to Help You Buy the Right Device First Time
          </h2>
          <p>
            Instead of guessing between confusing model numbers, our comparison matrices, pros and cons, and buying guides help you match the right device to your workflow—saving you time, money, and setup frustration.
          </p>
        </section>
      </div>
    </div>
  );
}
