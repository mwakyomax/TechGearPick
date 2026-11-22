import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export function TermsPage() {
  usePageSeo({
    title: 'Terms and Conditions',
    description:
      'Terms and Conditions governing use of TechGear Picks hardware guides, product comparisons, and affiliate links.',
    canonicalPath: '/terms',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Terms & Conditions', path: '/terms' },
    ]),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Terms and Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-2">Effective Date: November 2026</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            1. Informational Purpose Only
          </h2>
          <p>
            All product analyses, buying guides, and technical comparisons published on TechGear Picks are provided for general informational and educational purposes. Always verify hardware compatibility (such as laptop M.2 slot clearance, Thunderbolt host capabilities, and regional power voltages) with official manufacturer documentation before installation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            2. External Retailer Purchases
          </h2>
          <p>
            TechGear Picks does not sell hardware directly, process orders, or manage warranties. Any purchase made via outbound links is strictly between you and the third-party merchant (such as Amazon).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            3. Intellectual Property
          </h2>
          <p>
            Original editorial copy, structured comparison tables, and page layouts on TechGear Picks are protected by applicable copyright law. Product names and trademarks belong to their respective hardware manufacturers.
          </p>
        </section>
      </div>
    </div>
  );
}
