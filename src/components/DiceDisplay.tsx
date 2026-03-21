'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { DICE_LABELS } from '@/lib/engine/constants';

type FlipState = 'none' | 'fast' | 'slow';

function DieBox({
  value,
  label,
  flipState,
  colorClass,
}: {
  value: string;
  label: string;
  flipState: FlipState;
  colorClass: string;
}) {
  const flipClass =
    flipState === 'fast' ? 'animate-die-flip' :
    flipState === 'slow' ? 'animate-die-flip-slow' : '';

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          w-16 h-16 lg:w-[72px] lg:h-[72px]
          flex items-center justify-center
          rounded-xl border-2
          font-[family-name:var(--font-mono)] text-sm lg:text-base font-bold
          transition-colors duration-200
          ${colorClass}
          ${flipClass}
        `}
        style={{ perspective: '200px' }}
      >
        {value}
      </div>
      <span className="text-[9px] uppercase tracking-[0.15em] tb-text-muted font-bold">
        {label}
      </span>
    </div>
  );
}

export function DiceDisplay() {
  const dice = useGameStore((s) => s.gameState?.dice);
  const isRolling = useUIStore((s) => s.isRolling);
  const prevRollingRef = useRef(false);

  const [flipStock, setFlipStock] = useState<FlipState>('none');
  const [flipAction, setFlipAction] = useState<FlipState>('none');
  const [flipAmount, setFlipAmount] = useState<FlipState>('none');
  const [revealed, setRevealed] = useState(true);

  const prevDiceRef = useRef(dice);
  useEffect(() => {
    if (!isRolling || !dice) return;
    const prev = prevDiceRef.current;
    if (!prev) { prevDiceRef.current = dice; return; }
    if (prev.stock !== dice.stock) setFlipStock('fast');
    if (prev.action !== dice.action) setFlipAction('fast');
    if (prev.amount !== dice.amount) setFlipAmount('fast');
    prevDiceRef.current = dice;
  }, [dice, isRolling]);

  useEffect(() => {
    if (flipStock === 'none') return;
    const t = setTimeout(() => setFlipStock('none'), flipStock === 'fast' ? 150 : 400);
    return () => clearTimeout(t);
  }, [flipStock]);

  useEffect(() => {
    if (flipAction === 'none') return;
    const t = setTimeout(() => setFlipAction('none'), flipAction === 'fast' ? 150 : 400);
    return () => clearTimeout(t);
  }, [flipAction]);

  useEffect(() => {
    if (flipAmount === 'none') return;
    const t = setTimeout(() => setFlipAmount('none'), flipAmount === 'fast' ? 150 : 400);
    return () => clearTimeout(t);
  }, [flipAmount]);

  useEffect(() => {
    if (prevRollingRef.current && !isRolling) {
      setRevealed(false);
      setFlipStock('slow');
      setFlipAction('slow');
      setFlipAmount('slow');
      const t = setTimeout(() => setRevealed(true), 400);
      return () => clearTimeout(t);
    }
    if (isRolling) setRevealed(false);
    prevRollingRef.current = isRolling;
  }, [isRolling]);

  if (!dice) return null;

  const neutral = 'border-accent-green/30 tb-text bg-[var(--tb-input-bg)]';
  const showColor = !isRolling && revealed;

  const actionColor = showColor
    ? dice.action === 'UP' ? 'bg-emerald-900/60 border-emerald-500 text-accent-green'
    : dice.action === 'DOWN' ? 'bg-red-900/60 border-red-500 text-danger-red'
    : dice.action === 'DIV' ? 'bg-blue-900/60 border-blue-500 text-blue-400'
    : neutral
    : neutral;

  const actionIcon =
    dice.action === 'UP' ? '\u25B2 UP' :
    dice.action === 'DOWN' ? '\u25BC DN' :
    dice.action === 'DIV' ? '$ DIV' :
    '?';

  return (
    <div className="flex gap-3 lg:gap-4 items-start justify-center">
      <DieBox
        value={DICE_LABELS[dice.stock] ?? String(dice.stock)}
        label="Commodity"
        flipState={flipStock}
        colorClass={neutral}
      />
      <DieBox
        value={dice.action === '?' ? '?' : actionIcon}
        label="Action"
        flipState={flipAction}
        colorClass={actionColor}
      />
      <DieBox
        value={dice.amount === '?' ? '?' : `$${(dice.amount / 100).toFixed(2)}`}
        label="Amount"
        flipState={flipAmount}
        colorClass={neutral}
      />
    </div>
  );
}
