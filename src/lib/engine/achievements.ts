import type { GameState } from './types';

export type AchievementCategory = 'wealth' | 'trading' | 'survival' | 'secret';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  secret: boolean;
  check: (state: GameState, netWorth: number) => boolean;
}

// All monetary values in cents: $1M = 100_000_000, $1B = 100_000_000_000

const ACHIEVEMENTS: AchievementDef[] = [
  // ── Wealth (5) ──
  {
    id: 'first_million',
    name: 'First Million',
    description: 'Reach a net worth of $1,000,000.',
    category: 'wealth',
    rarity: 'common',
    secret: false,
    check: (_s, nw) => nw >= 100_000_000,
  },
  {
    id: 'eight_figures',
    name: 'Eight Figures',
    description: 'Reach a net worth of $10,000,000.',
    category: 'wealth',
    rarity: 'rare',
    secret: false,
    check: (_s, nw) => nw >= 1_000_000_000,
  },
  {
    id: 'hundred_millionaire',
    name: 'Hundred Millionaire',
    description: 'Reach a net worth of $100,000,000.',
    category: 'wealth',
    rarity: 'epic',
    secret: false,
    check: (_s, nw) => nw >= 10_000_000_000,
  },
  {
    id: 'billionaire',
    name: 'Billionaire',
    description: 'Reach a net worth of $1,000,000,000.',
    category: 'wealth',
    rarity: 'legendary',
    secret: false,
    check: (_s, nw) => nw >= 100_000_000_000,
  },
  {
    id: 'started_from_bottom',
    name: 'Started From the Bottom',
    description: 'Reach $1M net worth on Hard mode.',
    category: 'wealth',
    rarity: 'epic',
    secret: false,
    check: (s, nw) => nw >= 100_000_000 && s.player.difficultyMult === 5,
  },

  // ── Trading (5) ──
  {
    id: 'diversified',
    name: 'Diversified',
    description: 'Own shares in all 6 stocks at once.',
    category: 'trading',
    rarity: 'common',
    secret: false,
    check: (s) => s.stockNames.every((name) => (s.player.stocks[name] || 0) > 0),
  },
  {
    id: 'day_trader',
    name: 'Day Trader',
    description: 'Make 20 trades in a single session.',
    category: 'trading',
    rarity: 'rare',
    secret: false,
    check: (s) => s.sessionStats.tradeCount >= 20,
  },
  // buy_the_dip, sell_the_peak, all_in — checked at trade time only
  {
    id: 'buy_the_dip',
    name: 'Buy the Dip',
    description: 'Buy a stock priced below $0.30.',
    category: 'trading',
    rarity: 'rare',
    secret: false,
    check: () => false, // trade-only
  },
  {
    id: 'sell_the_peak',
    name: 'Sell the Peak',
    description: 'Sell a stock priced above $1.80.',
    category: 'trading',
    rarity: 'rare',
    secret: false,
    check: () => false, // trade-only
  },
  {
    id: 'all_in',
    name: 'All In',
    description: 'Spend 90%+ of your cash in a single buy.',
    category: 'trading',
    rarity: 'epic',
    secret: false,
    check: () => false, // trade-only
  },

  // ── Survival (5) ──
  {
    id: 'split_king',
    name: 'Split King',
    description: '5 stock splits in one session.',
    category: 'survival',
    rarity: 'rare',
    secret: false,
    check: (s) => s.sessionStats.splitCount >= 5,
  },
  {
    id: 'crash_test_dummy',
    name: 'Crash Test Dummy',
    description: '3 crashes in one session.',
    category: 'survival',
    rarity: 'rare',
    secret: false,
    check: (s) => s.sessionStats.crashCount >= 3,
  },
  {
    id: 'dividend_collector',
    name: 'Dividend Collector',
    description: 'Earn $50,000+ in dividends in one session.',
    category: 'survival',
    rarity: 'epic',
    secret: false,
    check: (s) => s.sessionStats.totalDividendsPaid >= 5_000_000,
  },
  {
    id: 'news_junkie',
    name: 'News Junkie',
    description: '10 market events in one session.',
    category: 'survival',
    rarity: 'rare',
    secret: false,
    check: (s) => s.sessionStats.eventCount >= 10,
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: '150+ rolls in one session.',
    category: 'survival',
    rarity: 'common',
    secret: false,
    check: (s) => s.rollCount >= 150,
  },

  // ── Secret (5) ──
  {
    id: 'speed_run',
    name: 'Speed Run',
    description: 'Reach $1M before time runs out (Easy <20min, Normal <40min, Hard <60min). Free Play only.',
    category: 'secret',
    rarity: 'legendary',
    secret: true,
    check: (s, nw) => {
      if (s.gameMode !== 'freeplay' || nw < 100_000_000) return false;
      const secs = s.sessionStats.sessionElapsedSeconds;
      const mult = s.player.difficultyMult;
      if (mult === 1) return secs < 20 * 60;
      if (mult === 2) return secs < 40 * 60;
      if (mult === 5) return secs < 60 * 60;
      return false;
    },
  },
  {
    id: 'penny_stock_hero',
    name: 'Penny Stock Hero',
    description: 'Own 10,000+ shares of any single stock.',
    category: 'secret',
    rarity: 'epic',
    secret: true,
    check: (s) => s.stockNames.some((name) => (s.player.stocks[name] || 0) >= 10_000),
  },
  {
    id: 'rock_bottom',
    name: 'Rock Bottom',
    description: 'Have less than $1 cash and zero shares.',
    category: 'secret',
    rarity: 'rare',
    secret: true,
    check: (s) => {
      if (s.player.money >= 100) return false;
      return s.stockNames.every((name) => (s.player.stocks[name] || 0) === 0);
    },
  },
  {
    id: 'hot_streak',
    name: 'Hot Streak',
    description: 'Same stock rolled 5 times in a row.',
    category: 'secret',
    rarity: 'epic',
    secret: true,
    check: (s) => {
      const last5 = s.sessionStats.lastFiveStocks;
      return last5.length === 5 && last5.every((st) => st === last5[0]);
    },
  },
  {
    id: 'sprint_master',
    name: 'Sprint Master',
    description: 'Finish Sprint mode with net worth >= $500k.',
    category: 'secret',
    rarity: 'epic',
    secret: true,
    check: (s, nw) => s.gameMode === 'sprint' && (s.gameLost || s.gameWon) && nw >= 50_000_000,
  },
];

export function getAllAchievements(): AchievementDef[] {
  return ACHIEVEMENTS;
}

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

const TRADE_ONLY_IDS = new Set(['buy_the_dip', 'sell_the_peak', 'all_in']);

export function checkAchievements(
  state: GameState,
  netWorth: number,
  alreadyUnlocked: Set<string>,
): string[] {
  const unlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(a.id)) continue;
    if (TRADE_ONLY_IDS.has(a.id)) continue;
    if (a.check(state, netWorth)) unlocked.push(a.id);
  }
  return unlocked;
}

export function checkTradeAchievements(
  state: GameState,
  tradeType: 'BUY' | 'SELL',
  stock: string,
  cashSpent: number,
  cashBefore: number,
  alreadyUnlocked: Set<string>,
): string[] {
  const unlocked: string[] = [];
  const price = state.stockPrices[stock];

  if (!alreadyUnlocked.has('buy_the_dip') && tradeType === 'BUY' && price < 30) {
    unlocked.push('buy_the_dip');
  }
  if (!alreadyUnlocked.has('sell_the_peak') && tradeType === 'SELL' && price > 180) {
    unlocked.push('sell_the_peak');
  }
  if (!alreadyUnlocked.has('all_in') && tradeType === 'BUY' && cashBefore > 0 && cashSpent >= cashBefore * 0.9) {
    unlocked.push('all_in');
  }

  // Also check non-trade-only achievements (e.g. diversified, day_trader)
  for (const a of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(a.id) || unlocked.includes(a.id)) continue;
    if (TRADE_ONLY_IDS.has(a.id)) continue;
    if (a.check(state, 0)) unlocked.push(a.id);
  }

  return unlocked;
}
