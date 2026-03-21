import type { DiceResult } from './types';
import { ACTIONS, AMOUNTS } from './constants';
import { ShuffleBag } from './shuffleBag';

function seededRandom(seed: string, index: number): number {
  let h = 0;
  const str = seed + ':' + index;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return (h >>> 0) / 0xFFFFFFFF;
}

// Module-level shuffle bags for even distribution
let stockBag: ShuffleBag<string> | null = null;
let lastStockKey = '';
const actionBag = new ShuffleBag<string>(ACTIONS);
const amountBag = new ShuffleBag<number>(AMOUNTS);

export function rollDice(
  stockNames: string[],
  seed?: string,
  rollIndex?: number,
): DiceResult {
  // Seeded path (challenge mode) — completely unchanged
  if (seed !== undefined && rollIndex !== undefined) {
    const r0 = seededRandom(seed, rollIndex * 3);
    const r1 = seededRandom(seed, rollIndex * 3 + 1);
    const r2 = seededRandom(seed, rollIndex * 3 + 2);
    return {
      stock: stockNames[Math.floor(r0 * stockNames.length)],
      action: ACTIONS[Math.floor(r1 * ACTIONS.length)],
      amount: AMOUNTS[Math.floor(r2 * AMOUNTS.length)],
    };
  }

  // Recreate stock bag if stock names changed
  const stockKey = stockNames.join(',');
  if (!stockBag || stockKey !== lastStockKey) {
    stockBag = new ShuffleBag(stockNames);
    lastStockKey = stockKey;
  }

  return {
    stock: stockBag.draw(),
    action: actionBag.draw() as DiceResult['action'],
    amount: amountBag.draw() as DiceResult['amount'],
  };
}
