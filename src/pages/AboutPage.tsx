import { Link } from 'react-router-dom';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';

export function AboutPage() {
  usePageSeo({
    title: 'About TechGear Picks',
    description:
      'Learn how TechGear Picks evaluates computer accessories, networking gear, and PC upgrades so you can shop with confidence on Amazon.',
    canonicalPath: '/about',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
    ]),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'About Us' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          About TechGear Picks
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
          Find the Right Tech. Make Smarter Choices.
        </p>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">Our Editorial Mission</h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Buying computer accessories, networking infrastructure, PC upgrades, or IT diagnostic tools often means sorting through recycled marketing claims and confusing specification sheets. TechGear Picks exists to translate technical hardware architecture—such as DRAM cache presence, USB-PD power splits, Wi-Fi channel width, and cable shielding—into clear, practical buying advice.
        </p>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Research Methodology &amp; Honesty Standards
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          We maintain strict editorial transparency across every page:
        </p>
        <ul className="list-disc list-inside space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
          <li>
            <strong>Research-Based Analyses Clearly Labeled:</strong> When a product has not undergone direct in-house physical testing, we explicitly label the evaluation as a research-based technical analysis grounded in manufacturer documentation and architectural comparisons.
          </li>
          <li>
            <strong>No Fabricated Numbers:</strong> We never invent customer ratings, review counts, synthetic benchmark scores, or static outdated prices. Readers are always directed to verify live pricing and availability on Amazon.
          </li>
          <li>
            <strong>Reader-First Recommendations:</strong> Every recommendation highlights concrete trade-offs and explains who should avoid a product—not just who should buy it.
          </li>
        </ul>
      </section>

      <AffiliateDisclosure variant="full" />

      <div className="flex flex-wrap gap-4">
        <Link
          to="/products"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Explore Product Directory
        </Link>
        <Link
          to="/contact"
          className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
        >
          Contact Editorial Team
        </Link>
      </div>
    </div>
  );
}
