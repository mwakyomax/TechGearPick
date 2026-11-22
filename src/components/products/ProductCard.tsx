import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { useCatalog } from '../../context/CatalogContext';
import { formatCurrency } from '../../lib/utils';
import { SafeImage } from '../ui/SafeImage';
import { CTAButton } from '../ui/CTAButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { getReviewByProductId } = useCatalog();
  const review = getReviewByProductId(product.id);
  const reviewPath = review ? `/reviews/${review.slug}` : `/categories/${product.category}`;

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={reviewPath} className="block aspect-[4/3] bg-slate-100 overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">
            <span>{product.brand}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{product.categoryName}</span>
          </p>

          <h3 className="font-display text-base font-semibold text-slate-900 leading-snug mb-2">
            <Link to={reviewPath} className="hover:text-blue-600 transition-colors">
              {product.name}
            </Link>
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>

          <dl className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
            {product.specifications.slice(0, 2).map((spec) => (
              <div key={spec.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-500 shrink-0">{spec.label}</dt>
                <dd className="font-mono text-slate-800 text-right truncate tabular-nums">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="font-mono text-slate-700 tabular-nums">
              {product.price !== undefined
                ? formatCurrency(product.price, product.currency)
                : 'Check live price on Amazon'}
            </span>
            {product.rating !== undefined ? (
              <span className="font-mono text-slate-600 tabular-nums">
                {product.rating.toFixed(1)} / 5
              </span>
            ) : (
              <span className="text-slate-500">Spec Verified</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CTAButton
              href={product.amazonUrl}
              customAffiliateUrl={product.affiliateUrl}
              label="Check Price on Amazon"
              size="sm"
              className="flex-1"
              productName={product.name}
            />
            <Link
              to={reviewPath}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <span>{review ? 'View Review' : 'Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
