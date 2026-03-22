'use client';

import { Trophy } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { calculateNetWorth } from '@/lib/engine/netWorth';
import { formatMoney } from '@/lib/utils/formatMoney';

export function WinModal() {
  const gameState = useGameStore((s) => s.gameState);
  const setView = useUIStore((s) => s.setView);
  const selectedMode = useGameStore((s) => s.selectedMode);

  if (!gameState) return null;

  const netWorth = calculateNetWorth(gameState);
  const score = netWorth * gameState.player.difficultyMult;

  const handleKeepTrading = () => {
    useGameStore.setState((state) => ({
      gameState: state.gameState ? { ...state.gameState, gameWon: false } : null,
    }));
  };

  const handleRetire = () => {
    useGameStore.setState((state) => ({
      gameState: state.gameState ? { ...state.gameState, gameWon: false } : null,
    }));
    setView('MENU');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="tb-card border-2 border-yellow-400 rounded-2xl p-8 w-full max-w-sm text-center animate-pop-in relative overflow-hidden card-elevated">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full bg-yellow-400/20 animate-firework-burst" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full bg-accent-green/20 animate-firework-burst" style={{ animationDelay: '0.2s' }} />
        </div>

        <div className="relative z-10">
          <Trophy size={44} className="text-yellow-400 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-yellow-400 mb-1">BILLIONAIRE!</h2>
          <p className="tb-text-secondary text-sm mb-5">
            {gameState.player.name} has reached billionaire status!
          </p>

          <div className="space-y-1.5 mb-5 font-[family-name:var(--font-mono)] text-xs">
            <div className="flex justify-between">
              <span className="tb-text-muted">Net Worth:</span>
              <span className="tb-green-text font-bold">{formatMoney(netWorth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="tb-text-muted">Multiplier:</span>
              <span className="tb-text font-bold">{selectedMode.mult}x ({selectedMode.difficulty})</span>
            </div>
            <div className="flex justify-between border-t tb-border pt-1.5">
              <span className="text-yellow-400 font-bold">Final Score:</span>
              <span className="text-yellow-400 font-bold">{formatMoney(score)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button onClick={handleKeepTrading} className="w-full py-2.5 rounded-lg bg-accent-green text-black font-bold text-sm min-h-[44px]">
              KEEP TRADING
            </button>
            <button onClick={handleRetire} className="w-full py-2.5 rounded-lg tb-card border tb-border tb-text-secondary font-bold text-sm min-h-[44px]">
              RETIRE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
