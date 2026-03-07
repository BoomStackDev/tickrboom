'use client';

import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { getDynamicIncrements } from '@/lib/engine/increments';
import { SPLIT_VALUE } from '@/lib/engine/constants';
import { calculateNetWorth } from '@/lib/engine/netWorth';
import { useState } from 'react';

function getStatusBadge(price: number) {
  if (price <= 25) return { label: 'DANGER', color: 'bg-red-900 text-danger-red border-red-700' };
  if (price <= 100) return { label: 'NO YIELD', color: 'bg-slate-800 text-slate-400 border-slate-600' };
  if (price >= SPLIT_VALUE - 25) return { label: 'SPLIT WATCH', color: 'bg-emerald-900 text-emerald-400 border-emerald-700' };
  return { label: 'YIELD', color: 'bg-blue-900 text-blue-400 border-blue-700' };
}

interface StockCardProps {
  stock: string;
}

export function StockCard({ stock }: StockCardProps) {
  const price = useGameStore((s) => s.gameState?.stockPrices[stock] ?? 100);
  const shares = useGameStore((s) => s.gameState?.player.stocks[stock] ?? 0);
  const avgCost = useGameStore((s) => s.gameState?.player.avgCosts[stock] ?? 0);
  const tradeAmount = useGameStore((s) => s.gameState?.tradeAmounts[stock] ?? 500);
  const trade = useGameStore((s) => s.trade);
  const setTradeAmount = useGameStore((s) => s.setTradeAmount);
  const gameState = useGameStore((s) => s.gameState);
  const isRolling = useUIStore((s) => s.isRolling);
  const haptic = useHaptics();

  const [customInput, setCustomInput] = useState('');

  const netWorth = gameState ? calculateNetWorth(gameState) : 0;
  const increments = getDynamicIncrements(netWorth);
  const status = getStatusBadge(price);
  const priceBarPercent = Math.min((price / SPLIT_VALUE) * 100, 100);

  const handleBuy = () => {
    haptic();
    trade({ type: 'BUY', stock, amount: tradeAmount });
  };

  const handleSell = () => {
    haptic();
    trade({ type: 'SELL', stock, amount: tradeAmount });
  };

  const handleCustomAmount = () => {
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) {
      setTradeAmount(stock, val);
      setCustomInput('');
    }
  };

  const positionValue = shares * price;
  const pnl = shares > 0 ? (price - avgCost) * shares : 0;

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-3 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm md:text-base">{stock}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="font-[family-name:var(--font-mono)] font-bold text-white text-sm md:text-base">
          ${(price / 100).toFixed(2)}
        </span>
      </div>

      {/* Price bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            price <= 25 ? 'bg-danger-red' :
            price >= SPLIT_VALUE - 25 ? 'bg-emerald-400' :
            'bg-accent-green'
          }`}
          style={{ width: `${priceBarPercent}%` }}
        />
      </div>

      {/* Position info */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-[family-name:var(--font-mono)]">
        <div>
          <span className="text-slate-500 block">Shares</span>
          <span className="text-white font-bold">{shares.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Avg Cost</span>
          <span className="text-white font-bold">
            {avgCost > 0 ? `$${(avgCost / 100).toFixed(2)}` : '-'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">P&L</span>
          <span className={`font-bold ${pnl > 0 ? 'text-accent-green' : pnl < 0 ? 'text-danger-red' : 'text-slate-400'}`}>
            {pnl !== 0 ? `${pnl > 0 ? '+' : ''}$${(pnl / 100).toFixed(2)}` : '-'}
          </span>
        </div>
      </div>

      {/* Trade amount buttons */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {increments.map((inc) => (
          <button
            key={inc}
            onClick={() => { haptic(); setTradeAmount(stock, inc); }}
            className={`
              px-2 py-1.5 rounded text-xs font-[family-name:var(--font-mono)] font-bold
              min-w-[44px] min-h-[44px] md:min-h-0 md:py-1
              transition-colors
              ${tradeAmount === inc
                ? 'bg-accent-green text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }
            `}
          >
            {inc >= 1000000 ? `${inc / 1000000}M` : inc >= 1000 ? `${inc / 1000}k` : inc}
          </button>
        ))}
        <button
          onClick={() => { haptic(); setTradeAmount(stock, 'MAX'); }}
          className={`
            px-2 py-1.5 rounded text-xs font-bold
            min-w-[44px] min-h-[44px] md:min-h-0 md:py-1
            transition-colors
            ${tradeAmount === 'MAX'
              ? 'bg-accent-green text-black'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
            }
          `}
        >
          MAX
        </button>
      </div>

      {/* Custom amount input */}
      <div className="flex gap-1 mb-2">
        <input
          type="number"
          placeholder="Custom qty"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs font-[family-name:var(--font-mono)] text-white min-h-[44px] md:min-h-0"
        />
        <button
          onClick={handleCustomAmount}
          className="px-3 py-1.5 bg-slate-700 border border-slate-500 rounded text-xs font-bold text-white min-h-[44px] md:min-h-0 hover:bg-slate-600"
        >
          Set
        </button>
      </div>

      {/* Buy/Sell buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSell}
          disabled={shares <= 0 || isRolling}
          className="py-2.5 rounded-lg font-bold text-sm bg-red-900/50 border border-red-700 text-danger-red hover:bg-red-900 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] transition-colors"
        >
          SELL
        </button>
        <button
          onClick={handleBuy}
          disabled={isRolling || (gameState?.player.money ?? 0) < price}
          className="py-2.5 rounded-lg font-bold text-sm bg-emerald-900/50 border border-emerald-700 text-accent-green hover:bg-emerald-900 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] transition-colors"
        >
          BUY
        </button>
      </div>

      {/* Position value */}
      {shares > 0 && (
        <div className="mt-2 text-center text-xs text-slate-500 font-[family-name:var(--font-mono)]">
          Position: ${(positionValue / 100).toFixed(2)}
        </div>
      )}
    </div>
  );
}
