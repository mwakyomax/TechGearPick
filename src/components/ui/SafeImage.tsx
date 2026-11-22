import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({ src, alt, className, loading = 'lazy' }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-500 p-6 text-center',
          className,
        )}
      >
        <Cpu className="w-8 h-8 text-slate-400" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[220px]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={cn('object-cover', className)}
    />
  );
}
