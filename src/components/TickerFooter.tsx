'use client';

import { TrendingUp } from 'lucide-react';
import { TICKER_DATA } from '@/lib/engine/constants';

export function TickerFooter() {
  const items = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-[#222] overflow-hidden z-50">
      <div className="flex animate-scroll-left whitespace-nowrap py-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 px-4 font-[family-name:var(--font-mono)] text-[11px]">
            <span className="font-bold text-white/90">{item.sym}</span>
            <span className={item.dir === 'up' ? 'text-accent-green' : 'text-danger-red'}>
              ${item.val}
            </span>
            <TrendingUp
              size={10}
              className={item.dir === 'up' ? 'text-accent-green' : 'text-danger-red rotate-180'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
