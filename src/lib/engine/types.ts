export type GameMode = 'freeplay' | 'sprint' | 'timed' | 'challenge';

export interface Player {
  name: string;
  money: number; // in cents (100 = $1.00)
  stocks: Record<string, number>; // stock name -> shares owned
  avgCosts: Record<string, number>; // stock name -> average cost basis in cents
  difficultyMult: number;
  hasWon: boolean;
}

export interface DiceResult {
  stock: string;
  action: 'UP' | 'DOWN' | 'DIV';
  amount: number; // 5, 10, or 20
}

export interface DicePlaceholder {
  stock: '?';
  action: '?';
  amount: '?';
}

export interface GameEvent {
  title: string;
  message: string;
  type: 'profit' | 'danger' | 'info';
  label?: string;
}

export interface Notification {
  type: 'profit' | 'danger' | 'neutral';
  msg: string;
}

export interface TutorialFlags {
  split: boolean;
  crash: boolean;
  divPaid: boolean;
  divSkipped: boolean;
}

export interface SessionStats {
  splitCount: number;
  crashCount: number;
  totalDividendsPaid: number; // cents
  tradeCount: number;
  eventCount: number;
  lastFiveStocks: string[];
  sessionElapsedSeconds: number;
}

export interface GameState {
  player: Player;
  stockPrices: Record<string, number>;
  stockNames: string[];
  dice: DiceResult | DicePlaceholder;
  logs: string[];
  gameWon: boolean;
  gameLost: boolean;
  tutorialFlags: TutorialFlags;
  tradeAmounts: Record<string, number | 'MAX'>;
  gameMode: GameMode;
  rollCount: number;
  maxRolls: number | null;
  timeRemaining: number | null;
  challengeDate: string | null;
  rollIndex: number;
  nextEventRoll: number | null;
  sessionStats: SessionStats;
}

export interface RollOutcome {
  newState: GameState;
  event: GameEvent | null;
  notification: Notification | null;
  log: string;
}

export interface StartMode {
  id: string;
  cash: number;
  label: string;
  mult: number;
  difficulty: string;
  desc: string;
}

export interface GameConfig {
  mode: StartMode;
  playerName: string;
  gameMode: GameMode;
}

export interface TradeAction {
  type: 'BUY' | 'SELL';
  stock: string;
  amount: number | 'MAX';
}

export interface SaveFile {
  id: string;
  timestamp: number;
  name: string;
  netWorth: number;
  data: GameState;
  mode: StartMode;
  gameMode: GameMode;
}

export interface TickerItem {
  sym: string;
  val: string;
  dir: 'up' | 'down';
}
