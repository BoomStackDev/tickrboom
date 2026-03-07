import type { DiceResult } from './types';
import { ACTIONS, AMOUNTS } from './constants';

export function rollDice(stockNames: string[]): DiceResult {
  return {
    stock: stockNames[Math.floor(Math.random() * stockNames.length)],
    action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
    amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
  };
}
