import { Check, Minus } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-4">
          Key Advantages
        </h3>
        <ul className="space-y-3">
          {pros.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-4">
          Limitations &amp; Trade-Offs
        </h3>
        <ul className="space-y-3">
          {cons.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <Minus className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
