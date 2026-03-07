'use client';

import { TrendingUp } from 'lucide-react';
import { TICKER_DATA } from '@/lib/engine/constants';

export function TickerFooter() {
  const items = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-card-border overflow-hidden z-50">
      <div className="flex animate-scroll-left whitespace-nowrap py-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-4 font-[family-name:var(--font-mono)] text-sm">
            <span className="font-bold text-white">{item.sym}</span>
            <span className={item.dir === 'up' ? 'text-accent-green' : 'text-danger-red'}>
              ${item.val}
            </span>
            <TrendingUp
              size={12}
              className={`${item.dir === 'up' ? 'text-accent-green' : 'text-danger-red rotate-180'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
