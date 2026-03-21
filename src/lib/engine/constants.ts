import type { StartMode, TickerItem } from './types';

export const DEFAULT_STOCKS = ['GOLD', 'SILVER', 'OIL', 'BONDS', 'INDUSTRIALS', 'GRAIN'];

export const DICE_LABELS: Record<string, string> = {
  GOLD: 'GOLD',
  SILVER: 'SLVR',
  OIL: 'OIL',
  BONDS: 'BNDS',
  INDUSTRIALS: 'IND',
  GRAIN: 'GRN',
};

export const ACTIONS = ['UP', 'DOWN', 'DIV'] as const;

export const AMOUNTS = [5, 10, 20] as const;

export const SPLIT_VALUE = 200; // price in cents where stock splits

export const CRASH_VALUE = 0; // price in cents where stock crashes

export const WINNING_SCORE = 100_000_000_000; // $1 Billion in cents

export const MAX_LOGS = 250;

export const START_MODES: StartMode[] = [
  {
    id: 'hard',
    cash: 5000,
    label: '$5k',
    mult: 5,
    difficulty: 'HARD',
    desc: 'Start with less cash, earn maximum Score (5x).',
  },
  {
    id: 'normal',
    cash: 25000,
    label: '$25k',
    mult: 2,
    difficulty: 'NORMAL',
    desc: 'Balanced starting cash and Score potential (2x).',
  },
  {
    id: 'easy',
    cash: 100000,
    label: '$100k',
    mult: 1,
    difficulty: 'EASY',
    desc: 'Start rich, but earn standard Score (1x).',
  },
];

export const SPRINT_ROLLS: Record<string, number> = {
  hard: 50,
  normal: 100,
  easy: 150,
};

export const TIMED_DURATION = 300; // 5 minutes in seconds

export const GAME_MODES = [
  { id: 'freeplay', label: 'Free Play', desc: 'No limits. Race to $1 Billion.' },
  { id: 'sprint', label: 'Sprint', desc: 'Hard: 50 rolls · Normal: 100 · Easy: 150' },
  { id: 'timed', label: 'Timed', desc: '5 minutes. Turbo disabled.' },
  { id: 'challenge', label: 'Daily', desc: 'Same rolls for everyone. Once per day.' },
] as const;

export const TICKER_DATA: TickerItem[] = [
  { sym: 'GOLD', val: '1,840.50', dir: 'up' },
  { sym: 'OIL', val: '75.20', dir: 'down' },
  { sym: 'TECH', val: '420.69', dir: 'up' },
  { sym: 'CRYPTO', val: '23,400', dir: 'down' },
  { sym: 'FOREX', val: '1.05', dir: 'up' },
  { sym: 'BONDS', val: '98.45', dir: 'up' },
  { sym: 'AGRI', val: '12.40', dir: 'down' },
];
