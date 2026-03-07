'use client';

import { useRef, useCallback } from 'react';
import { TrendingUp, Dice5 } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { WINNING_SCORE, ACTIONS, AMOUNTS } from '@/lib/engine/constants';
import { DiceDisplay } from './DiceDisplay';
import { calculateNetWorth } from '@/lib/engine/netWorth';

export function GameHeader() {
  const gameState = useGameStore((s) => s.gameState);
  const roll = useGameStore((s) => s.roll);
  const autoSave = useGameStore((s) => s.autoSave);
  const isRolling = useUIStore((s) => s.isRolling);
  const setRolling = useUIStore((s) => s.setRolling);
  const setActiveEvent = useUIStore((s) => s.setActiveEvent);
  const setNotification = useUIStore((s) => s.setNotification);
  const turboMode = useUIStore((s) => s.turboMode);
  const haptic = useHaptics();

  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoll = useCallback(() => {
    if (isRolling || !gameState || gameState.gameWon) return;

    const activeEvent = useUIStore.getState().activeEvent;
    if (activeEvent) return;

    setRolling(true);
    setNotification(null);
    haptic();

    const tickRate = turboMode ? 50 : 100;

    // Clear any existing timers
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);

    // Animate dice during roll
    rollIntervalRef.current = setInterval(() => {
      const stockNames = useGameStore.getState().gameState?.stockNames ?? [];
      useGameStore.setState((state) => {
        if (!state.gameState) return state;
        return {
          gameState: {
            ...state.gameState,
            dice: {
              stock: stockNames[Math.floor(Math.random() * stockNames.length)],
              action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
              amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
            },
          },
        };
      });
    }, tickRate);

    // Final roll
    rollTimeoutRef.current = setTimeout(() => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

      const outcome = roll();
      setRolling(false);

      if (outcome) {
        if (outcome.notification) setNotification(outcome.notification);
        if (outcome.event) setActiveEvent(outcome.event);

        // Auto-save after roll
        autoSave();

        // Clear notification after delay
        if (outcome.notification && !outcome.event) {
          setTimeout(() => setNotification(null), 3000);
        }
      }
    }, turboMode ? 200 : 800);
  }, [isRolling, gameState, turboMode, roll, setRolling, setNotification, setActiveEvent, autoSave, haptic]);

  if (!gameState) return null;

  const netWorth = calculateNetWorth(gameState);
  const score = netWorth * gameState.player.difficultyMult;
  const goalProgress = Math.min((score / WINNING_SCORE) * 100, 100);

  const formatMoney = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(2)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <div className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur-sm border-b border-card-border pb-3 lg:pb-2">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 lg:pt-2 mb-2 lg:mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-accent-green" />
          <span className="font-black text-base md:text-lg">TICKRBOOM</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">{gameState.player.name}</div>
          <div className="text-xs text-slate-500 font-[family-name:var(--font-mono)]">
            {gameState.player.difficultyMult}x multiplier
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-3 lg:mb-2">
        <div className="bg-card-bg border border-card-border rounded-lg px-2 py-1.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase">Net Worth</div>
          <div className="font-[family-name:var(--font-mono)] font-bold text-accent-green text-sm md:text-base">
            {formatMoney(netWorth)}
          </div>
        </div>
        <div className="bg-card-bg border border-card-border rounded-lg px-2 py-1.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase">Cash</div>
          <div className="font-[family-name:var(--font-mono)] font-bold text-white text-sm md:text-base">
            {formatMoney(gameState.player.money)}
          </div>
        </div>
        <div className="bg-card-bg border border-card-border rounded-lg px-2 py-1.5 text-center">
          <div className="text-[10px] text-slate-400 uppercase">Score</div>
          <div className="font-[family-name:var(--font-mono)] font-bold text-yellow-400 text-sm md:text-base">
            {formatMoney(score)}
          </div>
        </div>
      </div>

      {/* Goal progress */}
      <div className="px-4 mb-3 lg:mb-2">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>GOAL: $1 BILLION</span>
          <span>{goalProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      {/* Dice + Roll button */}
      <div className="flex items-center gap-3 px-4">
        <div className="flex-1">
          <DiceDisplay />
        </div>
        <button
          onClick={handleRoll}
          disabled={isRolling || gameState.gameWon || !!useUIStore.getState().activeEvent}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm
            min-h-[48px] min-w-[100px] justify-center
            transition-all duration-200
            ${isRolling
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-accent-green text-black hover:brightness-110 active:scale-95'
            }
          `}
        >
          <Dice5 size={18} />
          {isRolling ? 'ROLLING...' : 'ROLL'}
        </button>
      </div>
    </div>
  );
}
