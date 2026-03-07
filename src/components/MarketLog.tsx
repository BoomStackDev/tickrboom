'use client';

import { useGameStore } from '@/stores/gameStore';

export function MarketLog() {
  const logs = useGameStore((s) => s.gameState?.logs ?? []);

  return (
    <div className="mx-4 mt-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Market Activity</h3>
      <div className="bg-card-bg border border-card-border rounded-lg p-3 max-h-32 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-xs font-[family-name:var(--font-mono)]">Roll the dice to start trading...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, i) => (
              <p key={i} className={`text-xs font-[family-name:var(--font-mono)] ${i === 0 ? 'text-white' : 'text-slate-500'}`}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
