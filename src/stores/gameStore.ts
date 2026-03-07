'use client';

import { create } from 'zustand';
import type { GameState, GameConfig, GameMode, TradeAction, RollOutcome, StartMode, SaveFile } from '@/lib/engine/types';
import { createNewGame } from '@/lib/engine/createGame';
import { processRoll } from '@/lib/engine/processRoll';
import { executeTrade } from '@/lib/engine/trade';
import { rollDice } from '@/lib/engine/rollDice';
import { calculateNetWorth } from '@/lib/engine/netWorth';
import { START_MODES } from '@/lib/engine/constants';
import { platform } from '@/lib/platform/local';
import { useUIStore } from './uiStore';

interface GameStore {
  // State
  gameState: GameState | null;
  selectedMode: StartMode;
  selectedGameMode: GameMode;
  highScore: number;
  manualSaves: SaveFile[];
  timerInterval: ReturnType<typeof setInterval> | null;

  // Actions
  newGame: (config: GameConfig) => void;
  loadGame: (savedState: GameState, mode?: StartMode) => void;
  roll: () => RollOutcome | null;
  trade: (action: TradeAction) => void;
  setTradeAmount: (stock: string, amount: number | 'MAX') => void;
  updateStockName: (index: number, name: string) => void;
  getNetWorth: () => number;
  getScore: () => number;

  // Timer
  startTimer: () => void;
  stopTimer: () => void;

  // Challenge
  getTodayKey: () => string;
  hasPlayedChallenge: () => boolean;
  markChallengeComplete: () => void;

  // Save/Load
  autoSave: () => void;
  loadAutoSave: () => GameState | null;
  hasAutoSave: () => boolean;
  manualSave: (name: string, id?: string | null) => void;
  manualLoad: (save: SaveFile) => void;
  deleteSave: (id: string) => void;
  loadSaves: () => void;
  clearAutoSave: () => void;

  // Settings
  setHighScore: (score: number) => void;
  setSelectedMode: (mode: StartMode) => void;
  setSelectedGameMode: (mode: GameMode) => void;
  resetData: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  selectedMode: START_MODES[0],
  selectedGameMode: 'freeplay',
  highScore: 0,
  manualSaves: [],
  timerInterval: null,

  newGame: (config: GameConfig) => {
    get().stopTimer();
    const state = createNewGame(config);
    set({ gameState: state, selectedMode: config.mode, selectedGameMode: config.gameMode });
    platform.trackEvent('game_start', { mode: config.mode.id, gameMode: config.gameMode });

    // Disable turbo for timed mode
    if (config.gameMode === 'timed') {
      const uiStore = useUIStore.getState();
      if (uiStore.turboMode) uiStore.toggleTurbo();
    }

    // Start timer for timed mode
    if (config.gameMode === 'timed') {
      get().startTimer();
    }
  },

  loadGame: (savedState: GameState, mode?: StartMode) => {
    get().stopTimer();
    set({
      gameState: savedState,
      selectedMode: mode || get().selectedMode,
      selectedGameMode: savedState.gameMode || 'freeplay',
    });
  },

  roll: () => {
    const { gameState } = get();
    if (!gameState || gameState.gameWon || gameState.gameLost) return null;

    // Challenge mode uses seeded dice
    const dice = gameState.gameMode === 'challenge' && gameState.challengeDate
      ? rollDice(gameState.stockNames, gameState.challengeDate, gameState.rollIndex)
      : rollDice(gameState.stockNames);

    const outcome = processRoll(gameState, dice);
    set({ gameState: outcome.newState });

    // Update high score
    const score = calculateNetWorth(outcome.newState) * outcome.newState.player.difficultyMult;
    const { highScore } = get();
    if (score > highScore) {
      set({ highScore: score });
      platform.saveGame('tickrBoom_highScore', score.toString());
    }

    // Check for game end (sprint loss or win in any mode)
    if (outcome.newState.gameLost || outcome.newState.gameWon) {
      get().stopTimer();
      if (outcome.newState.gameMode === 'challenge') {
        get().markChallengeComplete();
      }
    }

    return outcome;
  },

  trade: (action: TradeAction) => {
    const { gameState } = get();
    if (!gameState) return;
    const newState = executeTrade(gameState, action);
    set({ gameState: newState });
  },

  setTradeAmount: (stock: string, amount: number | 'MAX') => {
    const { gameState } = get();
    if (!gameState) return;
    set({
      gameState: {
        ...gameState,
        tradeAmounts: { ...gameState.tradeAmounts, [stock]: amount },
      },
    });
  },

  updateStockName: (index: number, name: string) => {
    const { gameState } = get();
    if (!gameState) return;
    const newNames = [...gameState.stockNames];
    const oldName = newNames[index];
    newNames[index] = name;

    const newPrices = { ...gameState.stockPrices };
    const newStocks = { ...gameState.player.stocks };
    const newAvgCosts = { ...gameState.player.avgCosts };
    const newTradeAmounts = { ...gameState.tradeAmounts };

    if (oldName !== name) {
      newPrices[name] = newPrices[oldName] ?? 100;
      newStocks[name] = newStocks[oldName] ?? 0;
      newAvgCosts[name] = newAvgCosts[oldName] ?? 0;
      newTradeAmounts[name] = newTradeAmounts[oldName] ?? 500;
      delete newPrices[oldName];
      delete newStocks[oldName];
      delete newAvgCosts[oldName];
      delete newTradeAmounts[oldName];
    }

    set({
      gameState: {
        ...gameState,
        stockNames: newNames,
        stockPrices: newPrices,
        tradeAmounts: newTradeAmounts,
        player: {
          ...gameState.player,
          stocks: newStocks,
          avgCosts: newAvgCosts,
        },
      },
    });
  },

  getNetWorth: () => {
    const { gameState } = get();
    if (!gameState) return 0;
    return calculateNetWorth(gameState);
  },

  getScore: () => {
    const { gameState } = get();
    if (!gameState) return 0;
    return calculateNetWorth(gameState) * gameState.player.difficultyMult;
  },

  // Timer
  startTimer: () => {
    const { gameState } = get();
    if (!gameState || gameState.gameMode !== 'timed') return;

    const interval = setInterval(() => {
      const { gameState: current } = get();
      if (!current || current.gameMode !== 'timed') {
        get().stopTimer();
        return;
      }
      const remaining = (current.timeRemaining ?? 0) - 1;
      if (remaining <= 0) {
        set({
          gameState: {
            ...current,
            timeRemaining: 0,
            gameLost: !current.gameWon,
          },
        });
        get().stopTimer();
      } else {
        set({
          gameState: { ...current, timeRemaining: remaining },
        });
      }
    }, 1000);
    set({ timerInterval: interval });
  },

  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: null });
    }
  },

  // Challenge
  getTodayKey: () => {
    return 'tickrBoom_challenge_' + new Date().toISOString().split('T')[0];
  },

  hasPlayedChallenge: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(get().getTodayKey());
  },

  markChallengeComplete: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(get().getTodayKey(), 'true');
  },

  // Save/Load
  autoSave: () => {
    const { gameState, selectedMode } = get();
    if (!gameState) return;
    const data = JSON.stringify({ ...gameState, selectedMode });
    platform.saveGame('tickrBoom_activeGame', data);
  },

  loadAutoSave: () => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('tickrBoom_activeGame');
      if (!raw) return null;
      return JSON.parse(raw) as GameState;
    } catch {
      return null;
    }
  },

  hasAutoSave: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('tickrBoom_activeGame') !== null;
  },

  clearAutoSave: () => {
    platform.deleteGame('tickrBoom_activeGame');
  },

  manualSave: (name: string, id?: string | null) => {
    const { gameState, selectedMode, selectedGameMode, manualSaves } = get();
    if (!gameState) return;

    const netWorth = calculateNetWorth(gameState);
    const newSave: SaveFile = {
      id: id || Date.now().toString(),
      timestamp: Date.now(),
      name,
      netWorth,
      data: gameState,
      mode: selectedMode,
      gameMode: selectedGameMode,
    };

    let updated: SaveFile[];
    if (id) {
      updated = manualSaves.map((s) => (s.id === id ? newSave : s));
    } else {
      updated = [newSave, ...manualSaves];
    }
    set({ manualSaves: updated });
    platform.saveGame('tickrBoom_saves', JSON.stringify(updated));
  },

  manualLoad: (save: SaveFile) => {
    get().stopTimer();
    set({
      gameState: save.data,
      selectedMode: save.mode || START_MODES[0],
      selectedGameMode: save.gameMode || 'freeplay',
    });
  },

  deleteSave: (id: string) => {
    const updated = get().manualSaves.filter((s) => s.id !== id);
    set({ manualSaves: updated });
    platform.saveGame('tickrBoom_saves', JSON.stringify(updated));
  },

  loadSaves: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('tickrBoom_saves');
      if (raw) {
        set({ manualSaves: JSON.parse(raw) });
      }
    } catch {
      // ignore
    }
    // Load high score
    const hs = localStorage.getItem('tickrBoom_highScore');
    if (hs) {
      set({ highScore: parseInt(hs, 10) || 0 });
    }
  },

  setHighScore: (score: number) => {
    set({ highScore: score });
    platform.saveGame('tickrBoom_highScore', score.toString());
  },

  setSelectedMode: (mode: StartMode) => {
    set({ selectedMode: mode });
  },

  setSelectedGameMode: (mode: GameMode) => {
    set({ selectedGameMode: mode });
  },

  resetData: () => {
    platform.deleteGame('tickrBoom_highScore');
    platform.deleteGame('tickrBoom_playerName');
    platform.deleteGame('tickrBoom_activeGame');
    set({ highScore: 0, manualSaves: [] });
  },
}));
