import type { GameState, GameEvent } from './types';

/** Minimum and maximum rolls between market events */
export const EVENT_INTERVAL_MIN = 5;
export const EVENT_INTERVAL_MAX = 8;

export function randomEventInterval(): number {
  return EVENT_INTERVAL_MIN + Math.floor(Math.random() * (EVENT_INTERVAL_MAX - EVENT_INTERVAL_MIN + 1));
}

// ---------------------------------------------------------------------------
// Event definitions — zero React dependencies
// ---------------------------------------------------------------------------

interface MarketEventDef {
  headline: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
  weight: number; // higher = more common
  apply: (state: GameState) => { state: GameState; detail: string };
}

function clampPrice(price: number): number {
  // Keep prices in [1, 199] so events never directly trigger splits/crashes
  return Math.max(1, Math.min(199, price));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTwoRandom(names: string[]): [string, string] {
  const i = Math.floor(Math.random() * names.length);
  let j = Math.floor(Math.random() * (names.length - 1));
  if (j >= i) j++;
  return [names[i], names[j]];
}

const EVENTS: MarketEventDef[] = [
  // --- BULLISH (raise prices) ---
  {
    headline: 'Bull Market Rally',
    description: 'Investor confidence surges across all sectors.',
    type: 'bullish',
    weight: 5,
    apply: (state) => {
      const s = cloneState(state);
      const bump = 10; // +$0.10
      for (const name of s.stockNames) {
        s.stockPrices[name] = clampPrice(s.stockPrices[name] + bump);
      }
      return { state: s, detail: `All stocks +$${(bump / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Sector Boom',
    description: 'Analysts upgrade outlook for a hot commodity.',
    type: 'bullish',
    weight: 4,
    apply: (state) => {
      const s = cloneState(state);
      const stock = pickRandom(s.stockNames);
      const bump = 30;
      s.stockPrices[stock] = clampPrice(s.stockPrices[stock] + bump);
      return { state: s, detail: `${stock} +$${(bump / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Stimulus Package',
    description: 'Central bank injects liquidity into the market.',
    type: 'bullish',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      const bump = 15;
      for (const name of s.stockNames) {
        s.stockPrices[name] = clampPrice(s.stockPrices[name] + bump);
      }
      return { state: s, detail: `All stocks +$${(bump / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Investor Frenzy',
    description: 'Retail investors pile into two trending commodities.',
    type: 'bullish',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      const [a, b] = pickTwoRandom(s.stockNames);
      const bump = 25;
      s.stockPrices[a] = clampPrice(s.stockPrices[a] + bump);
      s.stockPrices[b] = clampPrice(s.stockPrices[b] + bump);
      return { state: s, detail: `${a} & ${b} +$${(bump / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Golden Age',
    description: 'A historic rally sweeps every commodity to new highs.',
    type: 'bullish',
    weight: 1,
    apply: (state) => {
      const s = cloneState(state);
      const bump = 25;
      for (const name of s.stockNames) {
        s.stockPrices[name] = clampPrice(s.stockPrices[name] + bump);
      }
      return { state: s, detail: `All stocks +$${(bump / 100).toFixed(2)}` };
    },
  },

  // --- BEARISH (lower prices) ---
  {
    headline: 'Market Correction',
    description: 'Profit-taking drags all commodity prices lower.',
    type: 'bearish',
    weight: 5,
    apply: (state) => {
      const s = cloneState(state);
      const drop = 10;
      for (const name of s.stockNames) {
        s.stockPrices[name] = clampPrice(s.stockPrices[name] - drop);
      }
      return { state: s, detail: `All stocks -$${(drop / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Sector Downturn',
    description: 'Bad earnings report tanks a single commodity.',
    type: 'bearish',
    weight: 4,
    apply: (state) => {
      const s = cloneState(state);
      const stock = pickRandom(s.stockNames);
      const drop = 30;
      s.stockPrices[stock] = clampPrice(s.stockPrices[stock] - drop);
      return { state: s, detail: `${stock} -$${(drop / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Trade War',
    description: 'New tariffs rattle global commodity markets.',
    type: 'bearish',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      const drop = 15;
      for (const name of s.stockNames) {
        s.stockPrices[name] = clampPrice(s.stockPrices[name] - drop);
      }
      return { state: s, detail: `All stocks -$${(drop / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Panic Selling',
    description: 'Fear grips the market as two commodities plummet.',
    type: 'bearish',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      const [a, b] = pickTwoRandom(s.stockNames);
      const drop = 25;
      s.stockPrices[a] = clampPrice(s.stockPrices[a] - drop);
      s.stockPrices[b] = clampPrice(s.stockPrices[b] - drop);
      return { state: s, detail: `${a} & ${b} -$${(drop / 100).toFixed(2)}` };
    },
  },
  {
    headline: 'Market Meltdown',
    description: 'A broad selloff hammers every commodity on the board.',
    type: 'bearish',
    weight: 1,
    apply: (state) => {
      const s = cloneState(state);
      const drop = 25;
      for (const name of s.stockNames) {
        s.stockPrices[name] = clampPrice(s.stockPrices[name] - drop);
      }
      return { state: s, detail: `All stocks -$${(drop / 100).toFixed(2)}` };
    },
  },

  // --- NEUTRAL (special effects) ---
  {
    headline: 'Government Bailout',
    description: 'Regulators step in to prop up the weakest commodity.',
    type: 'neutral',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      let lowest = s.stockNames[0];
      for (const name of s.stockNames) {
        if (s.stockPrices[name] < s.stockPrices[lowest]) lowest = name;
      }
      const oldPrice = s.stockPrices[lowest];
      s.stockPrices[lowest] = 100; // reset to $1.00
      return { state: s, detail: `${lowest} reset to $1.00 (was $${(oldPrice / 100).toFixed(2)})` };
    },
  },
  {
    headline: 'Mega Merger',
    description: 'Two commodities swap trading positions in a surprise deal.',
    type: 'neutral',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      const [a, b] = pickTwoRandom(s.stockNames);
      const tmp = s.stockPrices[a];
      s.stockPrices[a] = s.stockPrices[b];
      s.stockPrices[b] = tmp;
      return { state: s, detail: `${a} ↔ ${b} prices swapped` };
    },
  },
  {
    headline: 'Flash Recovery',
    description: 'Bargain hunters lift the cheapest stocks off their lows.',
    type: 'neutral',
    weight: 3,
    apply: (state) => {
      const s = cloneState(state);
      const threshold = 50; // $0.50
      const liftTo = 75; // $0.75
      const lifted: string[] = [];
      for (const name of s.stockNames) {
        if (s.stockPrices[name] < threshold) {
          s.stockPrices[name] = liftTo;
          lifted.push(name);
        }
      }
      if (lifted.length === 0) {
        return { state: s, detail: 'No stocks below $0.50 — no effect' };
      }
      return { state: s, detail: `${lifted.join(', ')} lifted to $0.75` };
    },
  },
];

// ---------------------------------------------------------------------------
// Weighted random selection
// ---------------------------------------------------------------------------

function pickWeightedEvent(): MarketEventDef {
  const totalWeight = EVENTS.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const ev of EVENTS) {
    roll -= ev.weight;
    if (roll <= 0) return ev;
  }
  return EVENTS[EVENTS.length - 1];
}

// ---------------------------------------------------------------------------
// Deep-clone helper (prices + logs only — the fields events mutate)
// ---------------------------------------------------------------------------

function cloneState(state: GameState): GameState {
  return {
    ...state,
    stockPrices: { ...state.stockPrices },
    logs: [...state.logs],
  };
}

// ---------------------------------------------------------------------------
// Public API — called from processRoll
// ---------------------------------------------------------------------------

export interface MarketEventResult {
  newState: GameState;
  event: GameEvent;
  log: string;
}

export function tryMarketEvent(state: GameState): MarketEventResult | null {
  if (state.nextEventRoll === null || state.rollCount < state.nextEventRoll) {
    return null;
  }

  const def = pickWeightedEvent();
  const { state: newState, detail } = def.apply(state);

  // Schedule next event
  newState.nextEventRoll = newState.rollCount + randomEventInterval();

  const eventType: GameEvent['type'] =
    def.type === 'bullish' ? 'profit' :
    def.type === 'bearish' ? 'danger' : 'info';

  const event: GameEvent = {
    title: def.headline,
    message: `${def.description}\n\n${detail}`,
    type: eventType,
    label: 'BREAKING NEWS',
  };

  const log = `📰 ${def.headline}: ${detail}`;

  return { newState, event, log };
}
