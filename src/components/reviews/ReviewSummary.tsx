import { Product, ProductReview } from '../../types/product';
import { formatCurrency, formatDate } from '../../lib/utils';
import { SafeImage } from '../ui/SafeImage';
import { CTAButton } from '../ui/CTAButton';
import { AffiliateDisclosure } from '../ui/AffiliateDisclosure';

interface ReviewSummaryProps {
  product: Product;
  review: ProductReview;
}

export function ReviewSummary({ product, review }: ReviewSummaryProps) {
  return (
    <aside
      aria-label="Product Research Summary"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200">
        <SafeImage src={product.image} alt={product.imageAlt} className="w-full h-full object-cover" />
      </div>

      <div className="p-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            {review.methodologyLabel}
          </p>
          <h2 className="font-display text-lg font-bold text-slate-900">{product.name}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {product.brand} · {product.subcategory} · Updated {formatDate(review.updatedAt)}
          </p>
        </div>

        <dl className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
          <div className="py-2.5 flex items-baseline justify-between gap-3">
            <dt className="text-slate-500">Pricing Status</dt>
            <dd className="font-mono text-slate-900 text-right tabular-nums">
              {product.price !== undefined
                ? formatCurrency(product.price, product.currency)
                : 'Check live Amazon price'}
            </dd>
          </div>
          <div className="py-2.5 flex items-baseline justify-between gap-3">
            <dt className="text-slate-500">Availability</dt>
            <dd className="font-medium text-slate-900">{product.availability}</dd>
          </div>
          {product.specifications.slice(0, 3).map((spec) => (
            <div key={spec.label} className="py-2.5 flex items-baseline justify-between gap-3">
              <dt className="text-slate-500 shrink-0">{spec.label}</dt>
              <dd className="font-mono text-slate-800 text-right tabular-nums">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-3">
          <CTAButton
            href={product.amazonUrl}
            customAffiliateUrl={product.affiliateUrl}
            label="Check Price on Amazon"
            className="w-full"
            productName={product.name}
          />
          <AffiliateDisclosure variant="compact" />
        </div>
      </div>
    </aside>
  );
}
