'use client';

import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { calculateNetWorth } from '@/lib/engine/netWorth';

export function GameOverModal() {
  const gameState = useGameStore((s) => s.gameState);
  const selectedMode = useGameStore((s) => s.selectedMode);
  const selectedGameMode = useGameStore((s) => s.selectedGameMode);
  const newGame = useGameStore((s) => s.newGame);
  const setView = useUIStore((s) => s.setView);
  const haptic = useHaptics();

  if (!gameState || !gameState.gameLost) return null;

  const netWorth = calculateNetWorth(gameState);
  const score = netWorth * gameState.player.difficultyMult;

  const formatMoney = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(2)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`;
    return `$${dollars.toFixed(2)}`;
  };

  const subtitle = gameState.gameMode === 'sprint'
    ? `Sprint Complete \u2014 ${gameState.rollCount} rolls`
    : gameState.gameMode === 'timed'
    ? "Time\u2019s Up!"
    : gameState.gameMode === 'challenge'
    ? `Daily Challenge \u2014 ${gameState.challengeDate}`
    : 'Game Over';

  const handlePlayAgain = () => {
    haptic();
    newGame({
      mode: selectedMode,
      playerName: gameState.player.name,
      gameMode: selectedGameMode,
    });
    setView('GAME');
  };

  const handleMainMenu = () => {
    haptic();
    setView('MENU');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="tb-card card-elevated border tb-border rounded-2xl p-8 max-w-sm w-full text-center animate-pop-in">
        <h2 className="text-2xl font-black tb-text mb-1">GAME OVER</h2>
        <p className="text-xs tb-text-muted mb-5">{subtitle}</p>

        <div className="tb-card border tb-border rounded-xl p-4 mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="tb-text-muted">Net Worth</span>
            <span className="font-[family-name:var(--font-mono)] font-bold tb-green-text">{formatMoney(netWorth)}</span>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span className="tb-text-muted">Multiplier</span>
            <span className="font-[family-name:var(--font-mono)] font-bold tb-text">{gameState.player.difficultyMult}x</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="tb-text-muted">Final Score</span>
            <span className="font-[family-name:var(--font-mono)] font-bold text-yellow-400">{formatMoney(score)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3 rounded-xl bg-accent-green text-black font-black text-sm min-h-[44px] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={handleMainMenu}
            className="w-full py-3 rounded-xl tb-card border tb-border tb-text-secondary font-bold text-sm min-h-[44px] hover:bg-[var(--tb-hover)] transition-all"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
