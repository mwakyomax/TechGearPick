import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { useCatalog } from '../../context/CatalogContext';
import { formatCurrency } from '../../lib/utils';
import { SafeImage } from '../ui/SafeImage';
import { CTAButton } from '../ui/CTAButton';

interface FeaturedProductProps {
  product: Product;
  eyebrow?: string;
}

export function FeaturedProduct({ product, eyebrow = 'Editor Spotlight' }: FeaturedProductProps) {
  const { getReviewByProductId } = useCatalog();
  const review = getReviewByProductId(product.id);
  const reviewPath = review ? `/reviews/${review.slug}` : `/categories/${product.category}`;

  return (
    <section
      aria-label={`Featured product: ${product.name}`}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
    >
      <div className="lg:col-span-5 bg-slate-100">
        <SafeImage
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-64 lg:h-full object-cover"
        />
      </div>

      <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {eyebrow} · {product.categoryName}
          </p>
          <h3 className="font-display text-2xl font-bold text-slate-900">
            <Link to={reviewPath} className="hover:text-blue-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {product.description}
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-3 border-t border-slate-100 text-xs">
            {product.specifications.slice(0, 4).map((spec) => (
              <div key={spec.label} className="flex items-baseline justify-between gap-2 py-1 border-b border-slate-100">
                <dt className="text-slate-500">{spec.label}</dt>
                <dd className="font-mono text-slate-900 text-right tabular-nums">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-600 font-mono tabular-nums">
            {product.price !== undefined
              ? `Verified Price: ${formatCurrency(product.price, product.currency)}`
              : 'Live price updated directly on Amazon'}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={reviewPath}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors min-h-[40px]"
            >
              <span>Read Full Analysis</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <CTAButton
              href={product.amazonUrl}
              customAffiliateUrl={product.affiliateUrl}
              label="Check Price on Amazon"
              productName={product.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
