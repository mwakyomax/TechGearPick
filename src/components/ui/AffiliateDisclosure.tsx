import { Link } from 'react-router-dom';
import { AFFILIATE_CONFIG } from '../../lib/affiliate';
import { cn } from '../../lib/utils';

interface AffiliateDisclosureProps {
  variant?: 'compact' | 'banner' | 'full';
  className?: string;
}

export function AffiliateDisclosure({ variant = 'compact', className }: AffiliateDisclosureProps) {
  if (variant === 'banner') {
    return (
      <div
        role="region"
        aria-label="Welcome Banner"
        className={cn(
          'bg-slate-100 border-b border-slate-200 text-slate-700 text-xs py-2.5 px-4',
          className,
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="leading-relaxed font-medium text-slate-800">
            {AFFILIATE_CONFIG.welcomeBanner}
          </p>
          <Link
            to="/products"
            className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Browse Electronics &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <aside
        aria-label="Why Buy Through TechGear Picks"
        className={cn(
          'rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 leading-relaxed',
          className,
        )}
      >
        <p className="font-semibold text-slate-900 mb-1">Shop Smart With TechGear Picks</p>
        <p>{AFFILIATE_CONFIG.disclosureFull}</p>
      </aside>
    );
  }

  return (
    <p className={cn('text-xs text-slate-500 leading-relaxed', className)}>
      {AFFILIATE_CONFIG.disclosureShort}{' '}
      <Link to="/affiliate-disclosure" className="underline underline-offset-2 hover:text-slate-800">
        Why shop here
      </Link>
    </p>
  );
}
