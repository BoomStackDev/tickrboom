'use client';

import { useRef, useCallback } from 'react';
import { TrendingUp, Dice5, HelpCircle } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { usePopover } from '@/hooks/usePopover';
import { WINNING_SCORE, TIMED_DURATION, ACTIONS, AMOUNTS } from '@/lib/engine/constants';
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
  const scorePopover = usePopover('score-help');

  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoll = useCallback(() => {
    if (isRolling || !gameState || gameState.gameWon || gameState.gameLost) return;
    const activeEvent = useUIStore.getState().activeEvent;
    if (activeEvent) return;

    setRolling(true);
    setNotification(null);
    haptic();

    const tickRate = turboMode ? 50 : 100;

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);

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

    rollTimeoutRef.current = setTimeout(() => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      const outcome = roll();
      setRolling(false);
      if (outcome) {
        if (outcome.notification) setNotification(outcome.notification);
        if (outcome.event) setActiveEvent(outcome.event);
        autoSave();
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

  // Mode-aware progress bar content
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderProgressBar = () => {
    if (gameState.gameMode === 'sprint') {
      const rollPct = gameState.maxRolls ? (gameState.rollCount / gameState.maxRolls) * 100 : 0;
      return (
        <>
          <div className="flex justify-between text-[9px] tb-text-muted mb-0.5">
            <span>SPRINT</span>
            <span>{gameState.rollCount} / {gameState.maxRolls} ROLLS</span>
          </div>
          <div className="w-full h-[2px] bg-[var(--tb-border)] rounded-full overflow-hidden">
            <div className="h-full bg-accent-green rounded-full transition-all duration-300" style={{ width: `${rollPct}%` }} />
          </div>
        </>
      );
    }
    if (gameState.gameMode === 'timed') {
      const remaining = gameState.timeRemaining ?? 0;
      const timerColorClass = remaining <= 30
        ? 'text-danger-red animate-pulse'
        : remaining <= 60
        ? 'text-yellow-400'
        : 'tb-text-muted';
      const timePct = (remaining / TIMED_DURATION) * 100;
      return (
        <>
          <div className="flex justify-between text-[9px] mb-0.5">
            <span className="tb-text-muted">TIMED</span>
            <span className={timerColorClass}>{formatTime(remaining)}</span>
          </div>
          <div className="w-full h-[2px] bg-[var(--tb-border)] rounded-full overflow-hidden">
            <div className="h-full bg-accent-green rounded-full transition-all duration-1000" style={{ width: `${timePct}%` }} />
          </div>
        </>
      );
    }
    // freeplay + challenge: default $1B goal
    return (
      <>
        <div className="flex justify-between text-[9px] tb-text-muted mb-0.5">
          <span>GOAL: $1B</span>
          <span>{goalProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-[2px] bg-[var(--tb-border)] rounded-full overflow-hidden">
          <div className="h-full bg-accent-green rounded-full transition-all duration-500" style={{ width: `${goalProgress}%` }} />
        </div>
      </>
    );
  };

  const scoreHelpPopover = (
    <div className="relative" onMouseLeave={scorePopover.close}>
      <button
        onClick={(e) => { e.stopPropagation(); scorePopover.toggle(); }}
        className="w-5 h-5 flex items-center justify-center rounded-full border tb-border tb-text-muted hover:bg-[var(--tb-hover)] transition-colors"
      >
        <HelpCircle size={10} />
      </button>
      {scorePopover.isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 w-[220px] p-3 rounded-xl tb-card border tb-border shadow-lg animate-pop-in card-elevated"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs font-bold tb-text mb-1">Score</div>
          <div className="text-xs tb-text-muted leading-relaxed">
            Your score is your Net Worth multiplied by your difficulty bonus. Hard mode (5x) earns 5× more score than Easy mode (1x).
          </div>
        </div>
      )}
    </div>
  );

  const rollDisabled = isRolling || gameState.gameWon || gameState.gameLost || !!useUIStore.getState().activeEvent;
  const rollColorClass = isRolling
    ? 'bg-[var(--tb-border)] tb-text-muted cursor-not-allowed'
    : 'bg-accent-green text-black hover:brightness-110 active:scale-95';

  const mobileRollButton = (
    <button
      onClick={handleRoll}
      disabled={rollDisabled}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm
        min-h-[48px] min-w-[110px] justify-center
        transition-all duration-200 ${rollColorClass}
      `}
    >
      <Dice5 size={18} />
      {isRolling ? 'ROLLING...' : 'ROLL'}
    </button>
  );

  const desktopRollButton = (
    <button
      onClick={handleRoll}
      disabled={rollDisabled}
      className={`
        flex flex-col items-center justify-center gap-0.5 w-16 py-3 rounded-xl font-black text-xs
        min-h-[48px] px-0
        transition-all duration-200 ${rollColorClass}
      `}
    >
      <Dice5 className="w-5 h-5" />
      {isRolling ? '...' : 'ROLL'}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 tb-bg backdrop-blur-sm border-b tb-border" style={{ backgroundColor: 'var(--tb-bg)', opacity: 0.98 }}>

      {/* ── Desktop: single compact bar ── */}
      <div className="hidden lg:flex lg:items-center gap-3 px-6 py-2">
        {/* Logo + player */}
        <div className="flex items-center gap-2 flex-none">
          <TrendingUp className="w-6 h-6 tb-green-text" />
          <span className="font-light text-2xl tb-text">Tickr</span><span className="font-black text-2xl tb-green-text">BOOM</span>
          <span className="text-sm tb-text-muted font-[family-name:var(--font-mono)] ml-1">
            {gameState.player.name} &middot; {gameState.player.difficultyMult}x
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-1 min-w-0 items-center justify-center">
          <div className="tb-card border tb-border rounded-lg px-3 py-3 text-center card-elevated w-32 flex-none">
            <div className="text-[10px] tb-text-muted uppercase tracking-wider">Net Worth</div>
            <div className="font-[family-name:var(--font-mono)] font-bold tb-green-text text-base">{formatMoney(netWorth)}</div>
          </div>
          <div className="tb-card border tb-border rounded-lg px-3 py-3 text-center card-elevated w-32 flex-none">
            <div className="text-[10px] tb-text-muted uppercase tracking-wider">Cash</div>
            <div className="font-[family-name:var(--font-mono)] font-bold tb-text text-base">{formatMoney(gameState.player.money)}</div>
          </div>
          <div className="tb-card border tb-border rounded-lg px-3 py-3 text-center card-elevated w-32 flex-none relative">
            <div className="absolute top-1.5 right-1.5">{scoreHelpPopover}</div>
            <div className="text-[10px] tb-text-muted uppercase tracking-wider">Score</div>
            <div className="font-[family-name:var(--font-mono)] font-bold text-yellow-400 text-base">{formatMoney(score)}</div>
          </div>
        </div>

        {/* Dice + Roll */}
        <div className="flex items-center gap-3 flex-none">
          <DiceDisplay />
          {desktopRollButton}
        </div>
      </div>

      {/* Desktop: progress bar */}
      <div className="hidden lg:block px-6 pb-1.5">
        {renderProgressBar()}
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="lg:hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={16} className="tb-green-text" />
            <span className="font-light text-sm tb-text">Tickr</span><span className="font-black text-sm tb-green-text">BOOM</span>
            <span className="text-[10px] tb-text-muted font-[family-name:var(--font-mono)] ml-1 hidden sm:inline">
              {gameState.player.name} &middot; {gameState.player.difficultyMult}x
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5 px-4 mb-1.5">
          <div className="tb-card border tb-border rounded-lg px-2 py-1 text-center card-elevated">
            <div className="text-[9px] tb-text-muted uppercase tracking-wider">Net Worth</div>
            <div className="font-[family-name:var(--font-mono)] font-bold tb-green-text text-sm">{formatMoney(netWorth)}</div>
          </div>
          <div className="tb-card border tb-border rounded-lg px-2 py-1 text-center card-elevated">
            <div className="text-[9px] tb-text-muted uppercase tracking-wider">Cash</div>
            <div className="font-[family-name:var(--font-mono)] font-bold tb-text text-sm">{formatMoney(gameState.player.money)}</div>
          </div>
          <div className="tb-card border tb-border rounded-lg px-2 py-1 text-center card-elevated relative">
            <div className="absolute top-0.5 right-0.5">{scoreHelpPopover}</div>
            <div className="text-[9px] tb-text-muted uppercase tracking-wider">Score</div>
            <div className="font-[family-name:var(--font-mono)] font-bold text-yellow-400 text-sm">{formatMoney(score)}</div>
          </div>
        </div>

        {/* Goal progress */}
        <div className="px-4 mb-2">
          {renderProgressBar()}
        </div>

        {/* Dice + Roll button */}
        <div className="flex items-center gap-3 px-4 pb-2.5">
          <div className="flex-1">
            <DiceDisplay />
          </div>
          {mobileRollButton}
        </div>
      </div>
    </div>
  );
}
