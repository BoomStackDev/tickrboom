'use client';

import { useState, useEffect, useRef } from 'react';
import { Dice5 } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';

export function DiceDisplay() {
  const dice = useGameStore((s) => s.gameState?.dice);
  const isRolling = useUIStore((s) => s.isRolling);
  const prevRollingRef = useRef(false);

  // Flip state: 'none' | 'fast' | 'slow'
  const [flipStock, setFlipStock] = useState<'none' | 'fast' | 'slow'>('none');
  const [flipAction, setFlipAction] = useState<'none' | 'fast' | 'slow'>('none');
  const [flipAmount, setFlipAmount] = useState<'none' | 'fast' | 'slow'>('none');

  // Track whether we've just revealed (rolling stopped)
  const [revealed, setRevealed] = useState(true);

  // Trigger fast flip whenever dice values change during rolling
  const prevDiceRef = useRef(dice);
  useEffect(() => {
    if (!isRolling || !dice) return;
    const prev = prevDiceRef.current;
    if (!prev) { prevDiceRef.current = dice; return; }

    if (prev.stock !== dice.stock) {
      setFlipStock('fast');
    }
    if (prev.action !== dice.action) {
      setFlipAction('fast');
    }
    if (prev.amount !== dice.amount) {
      setFlipAmount('fast');
    }
    prevDiceRef.current = dice;
  }, [dice, isRolling]);

  // Clear flip classes after animation completes
  useEffect(() => {
    if (flipStock === 'none') return;
    const dur = flipStock === 'fast' ? 150 : 400;
    const t = setTimeout(() => setFlipStock('none'), dur);
    return () => clearTimeout(t);
  }, [flipStock]);

  useEffect(() => {
    if (flipAction === 'none') return;
    const dur = flipAction === 'fast' ? 150 : 400;
    const t = setTimeout(() => setFlipAction('none'), dur);
    return () => clearTimeout(t);
  }, [flipAction]);

  useEffect(() => {
    if (flipAmount === 'none') return;
    const dur = flipAmount === 'fast' ? 150 : 400;
    const t = setTimeout(() => setFlipAmount('none'), dur);
    return () => clearTimeout(t);
  }, [flipAmount]);

  // Detect rolling -> not rolling transition: trigger slow reveal flip
  useEffect(() => {
    if (prevRollingRef.current && !isRolling) {
      // Rolling just stopped — do a slow reveal flip
      setRevealed(false);
      setFlipStock('slow');
      setFlipAction('slow');
      setFlipAmount('slow');
      const t = setTimeout(() => setRevealed(true), 400);
      return () => clearTimeout(t);
    }
    if (isRolling) {
      setRevealed(false);
    }
    prevRollingRef.current = isRolling;
  }, [isRolling]);

  if (!dice) return null;

  const neutralStyle = 'bg-[#222] border-card-border text-white';
  const showColor = !isRolling && revealed;

  const actionStyle = showColor
    ? dice.action === 'UP' ? 'bg-emerald-900/50 border-emerald-700 text-accent-green'
    : dice.action === 'DOWN' ? 'bg-red-900/50 border-red-700 text-danger-red'
    : dice.action === 'DIV' ? 'bg-blue-900/50 border-blue-700 text-blue-400'
    : neutralStyle
    : neutralStyle;

  const flipClass = (state: 'none' | 'fast' | 'slow') =>
    state === 'fast' ? 'animate-die-flip' : state === 'slow' ? 'animate-die-flip-slow' : '';

  return (
    <div className="flex gap-2 items-center justify-center">
      {/* Stock die */}
      <div
        className={`
          flex items-center justify-center px-3 py-2 rounded-lg
          ${neutralStyle} border
          font-[family-name:var(--font-mono)] text-sm font-bold
          min-w-[70px] text-center
          ${flipClass(flipStock)}
        `}
        style={{ perspective: '200px' }}
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
          ${flipClass(flipAction)}
        `}
        style={{ perspective: '200px' }}
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
          ${flipClass(flipAmount)}
        `}
        style={{ perspective: '200px' }}
      >
        {dice.amount === '?' ? '?' : `$${(dice.amount / 100).toFixed(2)}`}
      </div>
    </div>
  );
}
