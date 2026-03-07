'use client';

import { useState } from 'react';
import { TrendingUp, Wallet, Trophy, User, Edit3 } from 'lucide-react';
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
      // Auto-save embeds selectedMode in the JSON alongside GameState fields
      const raw = data as GameState & { selectedMode?: StartMode };
      const mode = raw.selectedMode || START_MODES[0];
      loadGame(data, mode);
      setView('GAME');
    }
  };

  const handleLoadSave = () => {
    haptic();
    openSaveManager('LOAD');
  };

  const formatMoney = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(2)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4 pb-16">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <TrendingUp size={36} className="text-accent-green" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            TICKR<span className="text-accent-green">BOOM</span>
          </h1>
        </div>
        <p className="text-slate-400 text-sm">Stock Market Dice Game</p>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="flex items-center gap-2 mb-6 bg-card-bg border border-card-border rounded-lg px-4 py-2">
          <Trophy size={16} className="text-yellow-400" />
          <span className="text-sm text-slate-400">High Score:</span>
          <span className="font-[family-name:var(--font-mono)] font-bold text-yellow-400">
            {formatMoney(highScore)}
          </span>
        </div>
      )}

      {/* Name input */}
      <div className="w-full max-w-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 uppercase font-bold">Player Name</span>
        </div>
        <input
          value={setupName}
          onChange={(e) => setSetupName(e.target.value)}
          className="w-full bg-card-bg border border-card-border rounded-lg px-4 py-3 text-white font-bold min-h-[48px]"
          placeholder="Enter your name"
        />
      </div>

      {/* Difficulty selector */}
      <div className="w-full max-w-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 uppercase font-bold">Starting Cash</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {START_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { haptic(); setSelectedMode(mode); }}
              className={`
                py-3 rounded-lg font-bold text-sm text-center transition-all min-h-[48px]
                ${selectedMode.id === mode.id
                  ? 'bg-accent-green text-black ring-2 ring-accent-green'
                  : 'bg-card-bg border border-card-border text-slate-300 hover:bg-slate-800'
                }
              `}
            >
              <div className="text-base font-black">{mode.label}</div>
              <div className={`text-[10px] ${selectedMode.id === mode.id ? 'text-black/70' : 'text-slate-500'}`}>
                {mode.difficulty} ({mode.mult}x)
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">{selectedMode.desc}</p>
      </div>

      {/* Custom commodities */}
      <div className="w-full max-w-sm mb-6">
        <button
          onClick={() => setEditingStocks(!editingStocks)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 mb-2"
        >
          <Edit3 size={12} />
          <span className="uppercase font-bold">Customize Commodities</span>
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
                className="bg-card-bg border border-card-border rounded px-3 py-2 text-sm font-[family-name:var(--font-mono)] font-bold text-white min-h-[44px]"
              />
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleNewGame}
          className="w-full py-4 rounded-xl bg-accent-green text-black font-black text-lg hover:brightness-110 active:scale-[0.98] transition-all min-h-[56px]"
        >
          NEW GAME
        </button>

        {hasAutoSave() && (
          <button
            onClick={handleResume}
            className="w-full py-3 rounded-xl bg-card-bg border-2 border-accent-green text-accent-green font-bold hover:bg-emerald-900/30 transition-all min-h-[48px]"
          >
            RESUME GAME
          </button>
        )}

        <button
          onClick={handleLoadSave}
          className="w-full py-3 rounded-xl bg-card-bg border border-card-border text-slate-300 font-bold hover:bg-slate-800 transition-all min-h-[48px]"
        >
          LOAD GAME
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => { haptic(); toggleTutorial(); }}
            className="flex-1 py-3 rounded-xl bg-card-bg border border-card-border text-slate-300 font-bold hover:bg-slate-800 transition-all min-h-[48px] text-sm"
          >
            HOW TO PLAY
          </button>
          <button
            onClick={() => { haptic(); toggleSettings(); }}
            className="flex-1 py-3 rounded-xl bg-card-bg border border-card-border text-slate-300 font-bold hover:bg-slate-800 transition-all min-h-[48px] text-sm"
          >
            SETTINGS
          </button>
        </div>
      </div>

      <TickerFooter />
    </div>
  );
}
