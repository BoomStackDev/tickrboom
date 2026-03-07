import type { GameState, DiceResult, RollOutcome, GameEvent, Notification } from './types';
import { SPLIT_VALUE, CRASH_VALUE, WINNING_SCORE } from './constants';
import { calculateNetWorth } from './netWorth';

export function processRoll(state: GameState, dice: DiceResult): RollOutcome {
  // Deep clone state to avoid mutations
  const newState: GameState = {
    ...state,
    player: {
      ...state.player,
      stocks: { ...state.player.stocks },
      avgCosts: { ...state.player.avgCosts },
    },
    stockPrices: { ...state.stockPrices },
    logs: [...state.logs],
    tutorialFlags: { ...state.tutorialFlags },
    dice,
    rollCount: state.rollCount + 1,
    rollIndex: state.rollIndex + 1,
  };

  const player = newState.player;
  const { stock, action, amount } = dice;
  let event: GameEvent | null = null;
  let notification: Notification | null = null;
  let log = '';

  const sharesOwned = player.stocks[stock] || 0;

  if (action === 'DIV') {
    // Dividend: pays amount cents per share ONLY if price > 100
    if (newState.stockPrices[stock] > 100 && sharesOwned > 0) {
      const payout = amount * sharesOwned;
      player.money += payout;
      log = `${stock} DIV: ${sharesOwned} shares x $${(amount / 100).toFixed(2)} = +$${(payout / 100).toFixed(2)}`;
      notification = { type: 'profit', msg: `${stock} DIVIDEND +$${(payout / 100).toFixed(2)}` };

      // Tutorial: first dividend paid
      if (!newState.tutorialFlags.divPaid) {
        newState.tutorialFlags.divPaid = true;
        event = {
          title: 'DIVIDEND PAID!',
          message: `${stock} paid a dividend of $${(amount / 100).toFixed(2)} per share! You earned $${(payout / 100).toFixed(2)}. Dividends pay out when a stock is above $1.00 and the dice rolls DIV.`,
          type: 'profit',
        };
      }
    } else if (newState.stockPrices[stock] <= 100) {
      log = `${stock} DIV: No yield (price <= $1.00)`;
      notification = { type: 'neutral', msg: `${stock} NO YIELD - Price too low for dividends` };

      // Tutorial: first skipped dividend
      if (!newState.tutorialFlags.divSkipped) {
        newState.tutorialFlags.divSkipped = true;
        event = {
          title: 'NO DIVIDEND',
          message: `${stock} is below $1.00, so no dividend is paid. Stocks must be above $1.00 to pay dividends.`,
          type: 'info',
        };
      }
    } else {
      log = `${stock} DIV: You own 0 shares`;
      notification = { type: 'neutral', msg: `${stock} DIVIDEND - You have no shares` };
    }
  } else {
    // UP or DOWN: change price
    const direction = action === 'UP' ? 1 : -1;
    newState.stockPrices[stock] += amount * direction;

    if (action === 'UP') {
      log = `${stock} +$${(amount / 100).toFixed(2)} → $${(newState.stockPrices[stock] / 100).toFixed(2)}`;
      notification = { type: 'profit', msg: `${stock} UP +$${(amount / 100).toFixed(2)}` };
    } else {
      log = `${stock} -$${(amount / 100).toFixed(2)} → $${(newState.stockPrices[stock] / 100).toFixed(2)}`;
      notification = { type: 'danger', msg: `${stock} DOWN -$${(amount / 100).toFixed(2)}` };
    }

    // Check for SPLIT: price >= SPLIT_VALUE
    if (newState.stockPrices[stock] >= SPLIT_VALUE) {
      const oldShares = player.stocks[stock] || 0;
      if (oldShares > 0) {
        player.stocks[stock] = oldShares * 2;
        // Reset avg cost on split: halve it since shares doubled
        if (player.avgCosts[stock]) {
          player.avgCosts[stock] = Math.round(player.avgCosts[stock] / 2);
        }
      }
      newState.stockPrices[stock] = 100;
      log = `${stock} STOCK SPLIT! Price reset to $1.00. ${oldShares > 0 ? `Shares: ${oldShares} → ${oldShares * 2}` : 'You have no shares.'}`;
      notification = { type: 'profit', msg: `${stock} STOCK SPLIT!` };

      if (!newState.tutorialFlags.split) {
        newState.tutorialFlags.split = true;
        event = {
          title: 'STOCK SPLIT!',
          message: `${stock} hit $2.00 and split! The price resets to $1.00 and ${oldShares > 0 ? `your shares doubled from ${oldShares} to ${oldShares * 2}` : 'any shares you owned would have doubled'}. Splits are great if you own the stock!`,
          type: 'profit',
        };
      }
    }

    // Check for CRASH: price <= CRASH_VALUE
    if (newState.stockPrices[stock] <= CRASH_VALUE) {
      const lostShares = player.stocks[stock] || 0;
      player.stocks[stock] = 0;
      player.avgCosts[stock] = 0;
      newState.stockPrices[stock] = 100;
      log = `${stock} CRASHED! Price reset to $1.00. ${lostShares > 0 ? `Lost ${lostShares} shares!` : 'You had no shares.'}`;
      notification = { type: 'danger', msg: `${stock} CRASHED!` };

      if (!newState.tutorialFlags.crash) {
        newState.tutorialFlags.crash = true;
        event = {
          title: 'MARKET CRASH!',
          message: `${stock} crashed to $0! The price resets to $1.00 but ${lostShares > 0 ? `you lost all ${lostShares} shares` : 'any shares you owned would have been lost'}. Crashes wipe out your position!`,
          type: 'danger',
        };
      }
    }
  }

  // Add log entry
  newState.logs = [log, ...newState.logs].slice(0, 50);

  // Check win condition
  const netWorth = calculateNetWorth(newState);
  const score = netWorth * player.difficultyMult;
  if (score >= WINNING_SCORE && !player.hasWon) {
    player.hasWon = true;
    newState.gameWon = true;
  }

  // Sprint end condition: out of rolls without winning
  if (newState.gameMode === 'sprint' && newState.maxRolls !== null) {
    if (newState.rollCount >= newState.maxRolls && !newState.gameWon) {
      newState.gameLost = true;
    }
  }

  return { newState, event, notification, log };
}
