'use client';

import { X, TrendingUp } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function TutorialModal() {
  const toggleTutorial = useUIStore((s) => s.toggleTutorial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tb-overlay p-4" onClick={toggleTutorial}>
      <div
        className="tb-card card-elevated border tb-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="tb-green-text" />
            <h2 className="text-lg font-black tb-text">HOW TO PLAY</h2>
          </div>
          <button onClick={toggleTutorial} className="p-2 hover:bg-[var(--tb-hover)] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center tb-text-secondary">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <h3 className="font-bold tb-green-text mb-0.5 text-xs">Goal</h3>
            <p className="tb-text-secondary leading-relaxed">Reach a net worth of $1 Billion (score). Your score = net worth x difficulty multiplier.</p>
          </div>
          <div>
            <h3 className="font-bold tb-green-text mb-0.5 text-xs">Rolling Dice</h3>
            <p className="tb-text-secondary leading-relaxed">Each roll has 3 dice: a commodity (which stock), an action (UP/DOWN/DIV), and an amount ($0.05/$0.10/$0.20).</p>
          </div>
          <div>
            <h3 className="font-bold tb-green-text mb-0.5 text-xs">UP & DOWN</h3>
            <p className="tb-text-secondary leading-relaxed">UP increases the stock price. DOWN decreases it. Buy low, sell high!</p>
          </div>
          <div>
            <h3 className="font-bold tb-green-text mb-0.5 text-xs">Dividends (DIV)</h3>
            <p className="tb-text-secondary leading-relaxed">If a stock is above $1.00 and you own shares, DIV pays you the amount per share. Below $1.00 = no dividend.</p>
          </div>
          <div>
            <h3 className="font-bold tb-green-text mb-0.5 text-xs">Stock Splits</h3>
            <p className="tb-text-secondary leading-relaxed">When a stock hits $2.00, it splits! Price resets to $1.00 and your shares double.</p>
          </div>
          <div>
            <h3 className="font-bold text-danger-red mb-0.5 text-xs">Market Crashes</h3>
            <p className="tb-text-secondary leading-relaxed">When a stock hits $0.00, it crashes! Price resets to $1.00 but you lose all shares.</p>
          </div>
          <div>
            <h3 className="font-bold tb-green-text mb-0.5 text-xs">Trading</h3>
            <p className="tb-text-secondary leading-relaxed">Buy and sell shares between rolls. Use increment buttons or MAX to trade.</p>
          </div>
          <div>
            <h3 className="font-bold text-yellow-400 mb-0.5 text-xs">Difficulty</h3>
            <p className="tb-text-secondary leading-relaxed">Hard ($5k, 5x) gives less cash but huge score multiplier. Easy ($100k, 1x) starts rich but earns less.</p>
          </div>
        </div>

        <button
          onClick={toggleTutorial}
          className="w-full mt-5 py-2.5 rounded-lg bg-accent-green text-black font-bold text-sm min-h-[44px]"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
}
