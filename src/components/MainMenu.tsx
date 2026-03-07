'use client';

import { useState } from 'react';
import { TrendingUp, Trophy, Edit3 } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { START_MODES, DEFAULT_STOCKS } from '@/lib/engine/constants';
import type { GameState, StartMode } from '@/lib/engine/types';
import { TickerFooter } from './TickerFooter';

export function MainMenu() {
  const selectedMode = useGameStore((s) => s.selectedMode);
  const setSelectedMode = useGameStore((s) => s.setSelectedMode);
  const newGame = useGameStore((s) => s.newGame);
  const highScore = useGameStore((s) => s.highScore);
  const hasAutoSave = useGameStore((s) => s.hasAutoSave);
  const loadAutoSave = useGameStore((s) => s.loadAutoSave);
  const loadGame = useGameStore((s) => s.loadGame);

  const setupName = useUIStore((s) => s.setupName);
  const setSetupName = useUIStore((s) => s.setSetupName);
  const setView = useUIStore((s) => s.setView);
  const setShaking = useUIStore((s) => s.setShaking);
  const setFlashing = useUIStore((s) => s.setFlashing);
  const openSaveManager = useUIStore((s) => s.openSaveManager);
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const toggleTutorial = useUIStore((s) => s.toggleTutorial);

  const haptic = useHaptics();

  const [editingStocks, setEditingStocks] = useState(false);
  const [customStocks, setCustomStocks] = useState<string[]>([...DEFAULT_STOCKS]);

  const handleNewGame = () => {
    haptic([50, 30, 50]);
    setShaking(true);
    setFlashing(true);
    setTimeout(() => {
      setShaking(false);
      setFlashing(false);
      newGame({
        mode: selectedMode,
        playerName: setupName,
        stockNames: customStocks,
      });
      setView('GAME');
    }, 400);
  };

  const handleResume = () => {
    haptic();
    const data = loadAutoSave();
    if (data) {
      const raw = data as GameState & { selectedMode?: StartMode };
      const mode = raw.selectedMode || START_MODES[0];
      loadGame(data, mode);
      setView('GAME');
    }
  };

  const formatMoney = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(2)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen tb-bg menu-grid flex flex-col items-center justify-center px-4 pb-16">
      <div className="w-full max-w-md lg:max-w-lg tb-card card-elevated border tb-border rounded-2xl p-6 lg:p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={28} className="tb-green-text" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight">
              <span className="font-light">Tickr</span><span className="font-black tb-green-text">BOOM</span>
            </h1>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase tb-text-muted">
            Stock Market Dice Game
          </p>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 py-2">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-xs tb-text-muted">High Score:</span>
            <span className="font-[family-name:var(--font-mono)] font-bold text-yellow-400 text-sm">
              {formatMoney(highScore)}
            </span>
          </div>
        )}

        {/* Name input */}
        <div className="w-full mb-5">
          <label className="text-[10px] uppercase tracking-[0.15em] tb-text-muted font-bold block mb-1.5">
            Player Name
          </label>
          <input
            value={setupName}
            onChange={(e) => setSetupName(e.target.value)}
            className="w-full tb-input border tb-border rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] font-bold text-sm min-h-[44px] focus:outline-none focus:border-accent-green/50 caret-accent-green"
            placeholder="Enter your name"
          />
        </div>

        {/* Difficulty selector */}
        <div className="w-full mb-5">
          <label className="text-[10px] uppercase tracking-[0.15em] tb-text-muted font-bold block mb-1.5">
            Starting Cash
          </label>
          <div className="grid grid-cols-3 gap-2">
            {START_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => { haptic(); setSelectedMode(mode); }}
                className={`
                  py-3 rounded-lg font-bold text-sm text-center transition-all min-h-[48px] border
                  ${selectedMode.id === mode.id
                    ? 'bg-accent-green/10 border-accent-green tb-green-text shadow-[0_0_12px_rgba(0,255,135,0.15)]'
                    : 'tb-card tb-border hover:border-[var(--tb-text-muted)]'
                  }
                `}
              >
                <div className={`text-base font-black ${selectedMode.id === mode.id ? 'tb-green-text' : 'tb-text'}`}>
                  {mode.label}
                </div>
                <div className={`text-[10px] ${selectedMode.id === mode.id ? 'tb-green-text opacity-70' : 'tb-text-muted'}`}>
                  {mode.difficulty} ({mode.mult}x)
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] tb-text-muted mt-2 text-center">{selectedMode.desc}</p>
        </div>

        {/* Custom commodities */}
        <div className="w-full mb-6">
          <button
            onClick={() => setEditingStocks(!editingStocks)}
            className="flex items-center gap-1.5 text-[10px] tb-text-muted hover:tb-text-secondary mb-2 uppercase tracking-[0.1em] font-bold"
          >
            <Edit3 size={10} />
            Customize Commodities
          </button>
          {editingStocks && (
            <div className="grid grid-cols-2 gap-2">
              {customStocks.map((name, i) => (
                <input
                  key={i}
                  value={name}
                  onChange={(e) => {
                    const updated = [...customStocks];
                    updated[i] = e.target.value.toUpperCase().slice(0, 8);
                    setCustomStocks(updated);
                  }}
                  maxLength={8}
                  className="tb-input border tb-border rounded px-3 py-2 text-xs font-[family-name:var(--font-mono)] font-bold min-h-[40px] focus:outline-none focus:border-accent-green/50"
                />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={handleNewGame}
            className="w-full py-3.5 rounded-xl bg-accent-green text-black font-black text-base hover:brightness-110 active:scale-[0.98] transition-all min-h-[52px] tracking-wide"
          >
            NEW GAME
          </button>

          {hasAutoSave() && (
            <button
              onClick={handleResume}
              className="w-full py-3 rounded-xl border-2 border-accent-green/50 tb-green-text font-bold hover:bg-accent-green/5 transition-all min-h-[44px] text-sm"
            >
              RESUME GAME
            </button>
          )}

          <button
            onClick={() => { haptic(); openSaveManager('LOAD'); }}
            className="w-full py-3 rounded-xl border tb-border tb-text-secondary font-bold hover:bg-[var(--tb-hover)] transition-all min-h-[44px] text-sm"
          >
            LOAD GAME
          </button>

          <div className="flex gap-4 justify-center pt-2">
            <button
              onClick={() => { haptic(); toggleTutorial(); }}
              className="text-xs tb-text-muted hover:tb-text-secondary font-bold uppercase tracking-wide transition-colors"
            >
              How to Play
            </button>
            <span className="tb-text-muted">|</span>
            <button
              onClick={() => { haptic(); toggleSettings(); }}
              className="text-xs tb-text-muted hover:tb-text-secondary font-bold uppercase tracking-wide transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <TickerFooter />
    </div>
  );
}
