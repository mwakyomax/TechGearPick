import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Article } from '../../types/article';
import { formatDate } from '../../lib/utils';
import { SafeImage } from '../ui/SafeImage';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const dest = `/blog/${article.slug}`;

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
      <Link to={dest} className="lg:col-span-6 bg-slate-100 block">
        <SafeImage
          src={article.image}
          alt={article.imageAlt}
          className="w-full h-64 lg:h-full object-cover"
        />
      </Link>

      <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-blue-600 uppercase tracking-wider">Featured</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{article.category}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{article.readingTimeMinutes} min read</span>
          </p>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            <Link to={dest} className="hover:text-blue-600 transition-colors">
              {article.title}
            </Link>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{article.author.name}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span>{article.author.role}</span>
          </div>

          <Link
            to={dest}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
          >
            <span>Read Full Guide</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
