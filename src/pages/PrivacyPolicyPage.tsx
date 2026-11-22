import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export function PrivacyPolicyPage() {
  usePageSeo({
    title: 'Privacy Policy',
    description:
      'Privacy Policy explaining data handling, outbound affiliate links, and browser storage on TechGear Picks.',
    canonicalPath: '/privacy-policy',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
    ]),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2">Effective Date: November 2026</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            TechGear Picks operates primarily as an informational editorial platform. We do not require user accounts or collect payment card data. When you interact with search or filter controls, all filtering executes locally in your browser.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            2. Third-Party Outbound Links
          </h2>
          <p>
            Clicking outbound links to third-party merchants such as Amazon.com directs you to external websites governed by their own privacy policies and cookie practices.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            3. Forms &amp; Communications
          </h2>
          <p>
            When you voluntarily submit your email address through our newsletter signup or send a message through our contact form, that submission is stored securely in our editorial database so our administrators can fulfill updates or respond to your inquiry. We do not sell subscriber email addresses or share inquiry details with third-party data brokers.
          </p>
        </section>
      </div>
    </div>
  );
}
