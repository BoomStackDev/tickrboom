import type { DiceResult } from './types';
import { ACTIONS, AMOUNTS } from './constants';
import { ShuffleBag } from './shuffleBag';

/** Hash a string to a 32-bit integer with good avalanche (MurmurHash3-style). */
function hashString(str: string): number {
  let h = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193); // FNV prime
  }
  // Murmur-style final mix for avalanche
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Mulberry32 — returns a () => number PRNG producing values in [0, 1). */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0xFFFFFFFF;
  };
}

// Lazy-initialized shuffle bags — avoids Math.random() during SSR
let stockBag: ShuffleBag<string> | null = null;
let lastStockKey = '';
let actionBag: ShuffleBag<string> | null = null;
let amountBag: ShuffleBag<number> | null = null;

export function rollDice(
  stockNames: string[],
  seed?: string,
  rollIndex?: number,
): DiceResult {
  // Seeded path (challenge mode) — deterministic per date + roll
  if (seed !== undefined && rollIndex !== undefined) {
    const rand = mulberry32(hashString(seed + ':' + rollIndex));
    return {
      stock: stockNames[Math.floor(rand() * stockNames.length)],
      action: ACTIONS[Math.floor(rand() * ACTIONS.length)],
      amount: AMOUNTS[Math.floor(rand() * AMOUNTS.length)],
    };
  }

  // Lazy-init bags on first use (client-side only)
  const stockKey = stockNames.join(',');
  if (!stockBag || stockKey !== lastStockKey) {
    stockBag = new ShuffleBag(stockNames);
    lastStockKey = stockKey;
  }
  if (!actionBag) actionBag = new ShuffleBag<string>([...ACTIONS]);
  if (!amountBag) amountBag = new ShuffleBag<number>([...AMOUNTS]);

  return {
    stock: stockBag.draw(),
    action: actionBag.draw() as DiceResult['action'],
    amount: amountBag.draw() as DiceResult['amount'],
  };
}
