import type { GameState } from './types';

export function calculateNetWorth(state: GameState): number {
  const stockValue = state.stockNames.reduce((sum, stock) => {
    return sum + (state.player.stocks[stock] || 0) * (state.stockPrices[stock] || 0);
  }, 0);
  return state.player.money + stockValue;
}
