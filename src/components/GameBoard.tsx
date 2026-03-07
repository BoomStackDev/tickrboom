'use client';

import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { GameHeader } from './GameHeader';
import { StockCard } from './StockCard';
import { NotificationBanner } from './NotificationBanner';
import { MarketLog } from './MarketLog';
import { GameFooter } from './GameFooter';
import { GameOverModal } from './modals/GameOverModal';

export function GameBoard() {
  const stockNames = useGameStore((s) => s.gameState?.stockNames ?? []);
  const gameLost = useGameStore((s) => s.gameState?.gameLost ?? false);
  const isShaking = useUIStore((s) => s.isShaking);
  const isFlashing = useUIStore((s) => s.isFlashing);

  return (
    <div
      className={`min-h-screen tb-bg ${isShaking ? 'animate-shake' : ''} ${isFlashing ? 'animate-flash-white' : ''}`}
    >
      <GameHeader />
      <NotificationBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 px-3 lg:px-6 mt-2">
        {stockNames.map((stock) => (
          <StockCard key={stock} stock={stock} />
        ))}
      </div>

      <MarketLog />
      <GameFooter />
      {gameLost && <GameOverModal />}
    </div>
  );
}
