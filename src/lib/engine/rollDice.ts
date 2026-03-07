import type { DiceResult } from './types';
import { ACTIONS, AMOUNTS } from './constants';

function seededRandom(seed: string, index: number): number {
  let h = 0;
  const str = seed + ':' + index;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return (h >>> 0) / 0xFFFFFFFF;
}

export function rollDice(
  stockNames: string[],
  seed?: string,
  rollIndex?: number,
): DiceResult {
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
  return {
    stock: stockNames[Math.floor(Math.random() * stockNames.length)],
    action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
    amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
  };
}
