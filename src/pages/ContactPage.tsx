import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { buildBreadcrumbSchema, usePageSeo } from '../lib/seo';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export function ContactPage() {
  const { submitContactInquiry } = useCatalog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Editorial Feedback');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  usePageSeo({
    title: 'Contact TechGear Picks',
    description:
      'Reach the TechGear Picks editorial team for hardware specification corrections, partnership inquiries, or site feedback.',
    canonicalPath: '/contact',
    jsonLd: buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim().length < 2 || !email.trim() || message.trim().length < 5) {
      setError('Please enter your name (at least 2 characters), a valid email address, and a brief message (at least 5 characters).');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        topic,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch {
      setError('Could not deliver your inquiry right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Contact Us
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Have a hardware correction, broken link report, or question about a buying guide? Send our editorial team a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          {submitted ? (
            <div role="status" className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-2">
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Inquiry Received
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thank you, {name}. Your message has been saved to our editorial inbox for review.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-600"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none min-h-[42px]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none min-h-[42px]"
                />
              </div>

              <div>
                <label htmlFor="contact-topic" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Topic
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none min-h-[42px]"
                >
                  <option>Editorial Feedback</option>
                  <option>Specification Correction</option>
                  <option>Product Coverage Request</option>
                  <option>Amazon Link &amp; Shopping Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs text-rose-600 font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors min-h-[44px]"
              >
                {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>

        <aside className="md:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              Editorial Standards
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We welcome specification updates from engineers, IT technicians, and manufacturers. TechGear Picks does not accept payment for favorable review verdicts.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2 text-sm text-slate-600">
            <h2 className="font-display text-base font-bold text-slate-900">
              Editorial Inbox
            </h2>
            <p className="leading-relaxed">
              Submissions sent through this form are routed directly to the TechGear Picks editorial queue for specification verification, broken link fixes, and coverage requests.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
