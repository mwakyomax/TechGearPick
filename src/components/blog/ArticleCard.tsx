import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Article } from '../../types/article';
import { formatDate } from '../../lib/utils';
import { SafeImage } from '../ui/SafeImage';

interface ArticleCardProps {
  article: Article;
  basePath?: string;
}

export function ArticleCard({ article, basePath = '/blog' }: ArticleCardProps) {
  const dest = `${basePath}/${article.slug}`;

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={dest} className="block aspect-[4/3] bg-slate-100 overflow-hidden">
        <SafeImage
          src={article.image}
          alt={article.imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-2">
            <span className="font-medium text-blue-600">{article.category}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{article.readingTimeMinutes} min read</span>
          </p>
          <h3 className="font-display text-base font-bold text-slate-900 leading-snug mb-2">
            <Link to={dest} className="hover:text-blue-600 transition-colors">
              {article.title}
            </Link>
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <Link
          to={dest}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-600 pt-3 border-t border-slate-100"
        >
          <span>Read article</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
