import { Link } from 'react-router-dom';
import { ComparisonOption, ComparisonRow } from '../../types/product';
import { useCatalog } from '../../context/CatalogContext';
import { SafeImage } from '../ui/SafeImage';
import { CTAButton } from '../ui/CTAButton';

interface ProductComparisonTableProps {
  options: ComparisonOption[];
  matrix: ComparisonRow[];
}

export function ProductComparisonTable({ options, matrix }: ProductComparisonTableProps) {
  const { reviews } = useCatalog();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((opt) => {
          const matchingReview = opt.productSlug
            ? reviews.find(
                (r) =>
                  r.slug.includes(opt.productSlug!.split('-')[0]) ||
                  r.productId.includes(opt.productSlug!),
              )
            : undefined;
          return (
            <div
              key={opt.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-slate-100 border-b border-slate-200">
                <SafeImage src={opt.image} alt={opt.imageAlt} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-500">
                    {opt.brand} · {opt.priceTier}
                  </p>
                  <h3 className="font-display text-lg font-bold text-slate-900">{opt.name}</h3>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Best for:</span> {opt.intendedUser}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    {opt.pros.slice(0, 2).map((pro) => (
                      <p key={pro} className="text-xs text-slate-700 leading-relaxed">
                        + {pro}
                      </p>
                    ))}
                    {opt.cons.slice(0, 1).map((con) => (
                      <p key={con} className="text-xs text-slate-500 leading-relaxed">
                        − {con}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                  {opt.affiliateUrl && (
                    <CTAButton
                      href={opt.affiliateUrl}
                      label="See Latest Price"
                      size="sm"
                      productName={opt.name}
                    />
                  )}
                  {matchingReview && (
                    <Link
                      to={`/reviews/${matchingReview.slug}`}
                      className="inline-flex items-center px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 min-h-[40px]"
                    >
                      View Product Analysis
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5 font-semibold w-1/4">
                  Comparison Factor
                </th>
                {options.map((opt) => (
                  <th key={opt.id} scope="col" className="py-3.5 px-5 font-semibold">
                    {opt.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {matrix.map((row) => (
                <tr key={row.criterion} className="hover:bg-slate-50/70">
                  <th scope="row" className="py-4 px-5 font-semibold text-slate-900 align-top">
                    {row.criterion}
                  </th>
                  {options.map((opt) => (
                    <td key={opt.id} className="py-4 px-5 text-slate-700 align-top tabular-nums">
                      {row.values[opt.id] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
