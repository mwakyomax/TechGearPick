import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryInfo } from '../../types/category';
import { SafeImage } from '../ui/SafeImage';

interface CategoryCardProps {
  category: CategoryInfo;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/categories/${category.slug}`} className="block aspect-[4/3] bg-slate-100 overflow-hidden">
        <SafeImage
          src={category.image}
          alt={category.imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 mb-1.5">
            <Link to={`/categories/${category.slug}`} className="hover:text-blue-600 transition-colors">
              {category.name}
            </Link>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            {category.shortDescription}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {category.subcategories
              .slice(0, 4)
              .map((s) => s.name)
              .join(' · ')}
          </p>
        </div>

        <Link
          to={`/categories/${category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 pt-2 border-t border-slate-100"
        >
          <span>Browse {category.name}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
