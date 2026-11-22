import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export function NewsletterForm() {
  const { subscribeToNewsletter } = useCatalog();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address (for example, name@domain.com).');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await subscribeToNewsletter(trimmed, 'website_newsletter');
      setSubmittedEmail(trimmed);
      setEmail('');
    } catch {
      setError('Could not save your subscription right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-[#0B192C] text-white rounded-2xl p-8 sm:p-12 border border-slate-800"
    >
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 id="newsletter-heading" className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          Stay Ahead of the Tech.
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
          Get useful technology guides, product recommendations, and buying tips directly in your inbox.
        </p>

        {submittedEmail ? (
          <div
            role="status"
            className="mt-6 max-w-lg mx-auto bg-slate-900/90 border border-slate-700 rounded-xl p-5 text-left flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-white">
                Subscribed: {submittedEmail}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your email has been saved to our subscriber database. You will receive our next hardware briefing and buying guide digest.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedEmail(null)}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2 pt-1"
              >
                Subscribe another address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@company.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="flex-1 px-4 py-3 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none min-h-[44px]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="text-xs text-rose-400 text-left mt-2">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
