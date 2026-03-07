'use client';

import { Trophy } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { calculateNetWorth } from '@/lib/engine/netWorth';

export function WinModal() {
  const gameState = useGameStore((s) => s.gameState);
  const setView = useUIStore((s) => s.setView);
  const selectedMode = useGameStore((s) => s.selectedMode);

  if (!gameState) return null;

  const netWorth = calculateNetWorth(gameState);
  const score = netWorth * gameState.player.difficultyMult;

  const formatMoney = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(2)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
    return `$${dollars.toFixed(2)}`;
  };

  const handleKeepTrading = () => {
    // Just dismiss the modal - gameWon stays true but user can keep playing
    // We need to set hasWon back, but keep gameWon for reference
    useGameStore.setState((state) => ({
      gameState: state.gameState ? {
        ...state.gameState,
        gameWon: false,
      } : null,
    }));
  };

  const handleRetire = () => {
    useGameStore.setState((state) => ({
      gameState: state.gameState ? {
        ...state.gameState,
        gameWon: false,
      } : null,
    }));
    setView('MENU');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-card-bg border-2 border-yellow-400 rounded-2xl p-8 w-full max-w-sm text-center animate-pop-in relative overflow-hidden">
        {/* Fireworks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full bg-yellow-400/20 animate-firework-burst" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-full bg-accent-green/20 animate-firework-burst" style={{ animationDelay: '0.2s' }} />
        </div>

        <div className="relative z-10">
          <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-yellow-400 mb-2">BILLIONAIRE!</h2>
          <p className="text-slate-300 mb-6">
            {gameState.player.name} has reached billionaire status!
          </p>

          <div className="space-y-2 mb-6 font-[family-name:var(--font-mono)]">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Net Worth:</span>
              <span className="text-accent-green font-bold">{formatMoney(netWorth)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Multiplier:</span>
              <span className="text-white font-bold">{selectedMode.mult}x ({selectedMode.difficulty})</span>
            </div>
            <div className="flex justify-between text-sm border-t border-card-border pt-2">
              <span className="text-yellow-400 font-bold">Final Score:</span>
              <span className="text-yellow-400 font-bold">{formatMoney(score)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleKeepTrading}
              className="w-full py-3 rounded-lg bg-accent-green text-black font-bold min-h-[48px]"
            >
              KEEP TRADING
            </button>
            <button
              onClick={handleRetire}
              className="w-full py-3 rounded-lg bg-card-bg border border-card-border text-slate-300 font-bold min-h-[48px]"
            >
              RETIRE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
