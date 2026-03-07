'use client';

import { Dice5 } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';

export function DiceDisplay() {
  const dice = useGameStore((s) => s.gameState?.dice);
  const isRolling = useUIStore((s) => s.isRolling);

  if (!dice) return null;

  const neutralStyle = 'bg-[#222] border-card-border text-white';

  const actionStyle = isRolling
    ? neutralStyle
    : dice.action === 'UP' ? 'bg-emerald-900/50 border-emerald-700 text-accent-green'
    : dice.action === 'DOWN' ? 'bg-red-900/50 border-red-700 text-danger-red'
    : dice.action === 'DIV' ? 'bg-blue-900/50 border-blue-700 text-blue-400'
    : neutralStyle;

  return (
    <div className="flex gap-2 items-center justify-center">
      {/* Stock die */}
      <div
        className={`
          flex items-center justify-center px-3 py-2 rounded-lg
          ${neutralStyle} border
          font-[family-name:var(--font-mono)] text-sm font-bold
          min-w-[70px] text-center
          ${isRolling ? 'animate-pulse' : ''}
        `}
      >
        <Dice5 size={14} className="mr-1.5 text-accent-green" />
        {dice.stock}
      </div>

      {/* Action die */}
      <div
        className={`
          flex items-center justify-center px-3 py-2 rounded-lg
          font-[family-name:var(--font-mono)] text-sm font-bold
          min-w-[60px] text-center border
          ${actionStyle}
          ${isRolling ? 'animate-pulse' : ''}
        `}
      >
        {dice.action === '?' ? '?' : dice.action}
      </div>

      {/* Amount die */}
      <div
        className={`
          flex items-center justify-center px-3 py-2 rounded-lg
          ${neutralStyle} border
          font-[family-name:var(--font-mono)] text-sm font-bold
          min-w-[50px] text-center
          ${isRolling ? 'animate-pulse' : ''}
        `}
      >
        {dice.amount === '?' ? '?' : `$${(dice.amount / 100).toFixed(2)}`}
      </div>
    </div>
  );
}
