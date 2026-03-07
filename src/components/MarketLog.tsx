'use client';

import { useGameStore } from '@/stores/gameStore';

export function MarketLog() {
  const logs = useGameStore((s) => s.gameState?.logs ?? []);

  return (
    <div className="mx-3 lg:mx-4 mt-3">
      <h3 className="text-[9px] font-bold tb-text-muted uppercase tracking-[0.15em] mb-1">Market Activity</h3>
      <div className="tb-card card-elevated border tb-border rounded-lg p-2.5 max-h-28 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="tb-text-muted text-[11px] font-[family-name:var(--font-mono)]">Roll the dice to start trading...</p>
        ) : (
          <div className="space-y-0.5">
            {logs.map((log, i) => (
              <p key={i} className={`text-[11px] font-[family-name:var(--font-mono)] ${i === 0 ? 'tb-text' : 'tb-text-muted'}`}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
