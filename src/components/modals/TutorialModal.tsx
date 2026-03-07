'use client';

import { X, TrendingUp } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function TutorialModal() {
  const toggleTutorial = useUIStore((s) => s.toggleTutorial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={toggleTutorial}>
      <div
        className="bg-card-bg border border-card-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-accent-green" />
            <h2 className="text-xl font-black">HOW TO PLAY</h2>
          </div>
          <button onClick={toggleTutorial} className="p-2 hover:bg-slate-800 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-accent-green mb-1">Goal</h3>
            <p className="text-slate-300">Reach a net worth of $1 Billion (score). Your score = net worth x difficulty multiplier.</p>
          </div>

          <div>
            <h3 className="font-bold text-accent-green mb-1">Rolling Dice</h3>
            <p className="text-slate-300">Each roll has 3 dice: a commodity (which stock), an action (UP/DOWN/DIV), and an amount ($0.05/$0.10/$0.20).</p>
          </div>

          <div>
            <h3 className="font-bold text-accent-green mb-1">UP & DOWN</h3>
            <p className="text-slate-300">UP increases the stock price. DOWN decreases it. Buy low, sell high!</p>
          </div>

          <div>
            <h3 className="font-bold text-accent-green mb-1">Dividends (DIV)</h3>
            <p className="text-slate-300">If a stock is above $1.00 and you own shares, DIV pays you the amount per share. Below $1.00 = no dividend.</p>
          </div>

          <div>
            <h3 className="font-bold text-accent-green mb-1">Stock Splits</h3>
            <p className="text-slate-300">When a stock hits $2.00, it splits! Price resets to $1.00 and your shares double. Splits are very profitable!</p>
          </div>

          <div>
            <h3 className="font-bold text-danger-red mb-1">Market Crashes</h3>
            <p className="text-slate-300">When a stock hits $0.00, it crashes! Price resets to $1.00 but you lose all shares. Be careful with cheap stocks.</p>
          </div>

          <div>
            <h3 className="font-bold text-accent-green mb-1">Trading</h3>
            <p className="text-slate-300">Buy and sell shares between rolls. Use the increment buttons to set how many shares to trade. MAX buys/sells as many as possible.</p>
          </div>

          <div>
            <h3 className="font-bold text-yellow-400 mb-1">Difficulty</h3>
            <p className="text-slate-300">Hard ($5k, 5x) gives less starting cash but a huge score multiplier. Easy ($100k, 1x) starts rich but earns less score.</p>
          </div>
        </div>

        <button
          onClick={toggleTutorial}
          className="w-full mt-6 py-3 rounded-lg bg-accent-green text-black font-bold min-h-[48px]"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
}
