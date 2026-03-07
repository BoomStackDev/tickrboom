'use client';

import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { GameHeader } from './GameHeader';
import { StockCard } from './StockCard';
import { NotificationBanner } from './NotificationBanner';
import { MarketLog } from './MarketLog';
import { GameFooter } from './GameFooter';

export function GameBoard() {
  const stockNames = useGameStore((s) => s.gameState?.stockNames ?? []);
  const isShaking = useUIStore((s) => s.isShaking);
  const isFlashing = useUIStore((s) => s.isFlashing);

  return (
    <div
      className={`min-h-screen bg-dark-bg ${isShaking ? 'animate-shake' : ''} ${isFlashing ? 'animate-flash-white' : ''}`}
    >
      <GameHeader />
      <NotificationBanner />

      {/* Stock cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 mt-3">
        {stockNames.map((stock) => (
          <StockCard key={stock} stock={stock} />
        ))}
      </div>

      <MarketLog />
      <GameFooter />
    </div>
  );
}
