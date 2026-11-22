import { ExternalLink } from 'lucide-react';
import { AFFILIATE_LINK_REL, resolveAffiliateUrl } from '../../lib/affiliate';
import { cn } from '../../lib/utils';

interface CTAButtonProps {
  href: string;
  customAffiliateUrl?: string;
  label?: 'Check Price on Amazon' | 'View on Amazon' | 'See Latest Price';
  variant?: 'primary' | 'secondary' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  productName?: string;
}

export function CTAButton({
  href,
  customAffiliateUrl,
  label = 'Check Price on Amazon',
  variant = 'primary',
  size = 'md',
  className,
  productName,
}: CTAButtonProps) {
  const resolvedUrl = resolveAffiliateUrl(href, customAffiliateUrl);

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
    navy: 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900',
    secondary: 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-300',
  };

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <a
      href={resolvedUrl}
      target="_blank"
      rel={AFFILIATE_LINK_REL}
      aria-label={productName ? `${label} for ${productName} (opens in a new tab)` : `${label} (opens in a new tab)`}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}
