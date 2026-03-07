import type { GameState, GameConfig, DicePlaceholder } from './types';
import { DEFAULT_STOCKS, SPRINT_ROLLS, TIMED_DURATION } from './constants';

export function createNewGame(config: GameConfig): GameState {
  const stockNames = config.stockNames && config.stockNames.length === 6
    ? config.stockNames
    : [...DEFAULT_STOCKS];

  const stockPrices: Record<string, number> = {};
  const stocks: Record<string, number> = {};
  const avgCosts: Record<string, number> = {};
  const tradeAmounts: Record<string, number | 'MAX'> = {};

  for (const name of stockNames) {
    stockPrices[name] = 100; // $1.00 in cents
    stocks[name] = 0;
    avgCosts[name] = 0;
    tradeAmounts[name] = 500; // default trade amount
  }

  const dice: DicePlaceholder = { stock: '?', action: '?', amount: '?' };
  const today = new Date().toISOString().split('T')[0];
  const gameMode = config.gameMode;

  return {
    player: {
      name: config.playerName,
      money: config.mode.cash * 100,
      stocks,
      avgCosts,
      difficultyMult: config.mode.mult,
      hasWon: false,
    },
    stockPrices,
    stockNames,
    dice,
    logs: [],
    gameWon: false,
    gameLost: false,
    tutorialFlags: {
      split: false,
      crash: false,
      divPaid: false,
      divSkipped: false,
    },
    tradeAmounts,
    gameMode,
    rollCount: 0,
    maxRolls: gameMode === 'sprint' ? (SPRINT_ROLLS[config.mode.id] ?? 100) : null,
    timeRemaining: gameMode === 'timed' ? TIMED_DURATION : null,
    challengeDate: gameMode === 'challenge' ? today : null,
    rollIndex: 0,
  };
}
