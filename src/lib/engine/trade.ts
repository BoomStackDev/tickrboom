import type { GameState, TradeAction } from './types';
import { MAX_LOGS } from './constants';

export function executeTrade(state: GameState, action: TradeAction): GameState {
  const { type, stock, amount } = action;
  const price = state.stockPrices[stock];
  if (!price || price <= 0) return state;

  // Deep clone
  const newState: GameState = {
    ...state,
    player: {
      ...state.player,
      stocks: { ...state.player.stocks },
      avgCosts: { ...state.player.avgCosts },
    },
    sessionStats: { ...state.sessionStats, tradeCount: state.sessionStats.tradeCount + 1 },
    logs: [...state.logs],
  };

  const player = newState.player;
  const currentShares = player.stocks[stock] || 0;

  if (type === 'BUY') {
    let sharesToBuy: number;

    if (amount === 'MAX') {
      // Buy as many as affordable
      sharesToBuy = Math.floor(player.money / price);
    } else {
      sharesToBuy = amount;
    }

    if (sharesToBuy <= 0) return state;

    const cost = sharesToBuy * price;
    if (cost > player.money) return state;

    // Weighted average cost
    const totalOldCost = currentShares * (player.avgCosts[stock] || 0);
    const totalNewCost = totalOldCost + cost;
    const newTotalShares = currentShares + sharesToBuy;

    player.money -= cost;
    player.stocks[stock] = newTotalShares;
    player.avgCosts[stock] = newTotalShares > 0 ? Math.round(totalNewCost / newTotalShares) : 0;

    newState.logs = [`BUY ${sharesToBuy} ${stock} @ $${(price / 100).toFixed(2)} = -$${(cost / 100).toFixed(2)}`, ...newState.logs].slice(0, MAX_LOGS);
  } else {
    // SELL
    let sharesToSell: number;

    if (amount === 'MAX') {
      sharesToSell = currentShares;
    } else {
      sharesToSell = Math.min(amount, currentShares);
    }

    if (sharesToSell <= 0) return state;

    const revenue = sharesToSell * price;
    player.money += revenue;
    player.stocks[stock] = currentShares - sharesToSell;

    newState.logs = [`SELL ${sharesToSell} ${stock} @ $${(price / 100).toFixed(2)} = +$${(revenue / 100).toFixed(2)}`, ...newState.logs].slice(0, MAX_LOGS);

    // Reset avg cost if all sold
    if (player.stocks[stock] <= 0) {
      player.stocks[stock] = 0;
      player.avgCosts[stock] = 0;
    }
  }

  return newState;
}
