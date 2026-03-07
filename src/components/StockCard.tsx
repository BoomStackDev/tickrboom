'use client';

import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { getDynamicIncrements } from '@/lib/engine/increments';
import { SPLIT_VALUE } from '@/lib/engine/constants';
import { calculateNetWorth } from '@/lib/engine/netWorth';
import { useState } from 'react';

function getStatusBadge(price: number) {
  if (price <= 25) return { label: 'DANGER', cls: 'bg-red-500/15 text-danger-red border-red-500/30' };
  if (price <= 100) return { label: 'NO YIELD', cls: 'bg-[var(--tb-border)]/30 tb-text-muted border-[var(--tb-border)]' };
  if (price >= SPLIT_VALUE - 25) return { label: 'SPLIT WATCH', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-badge-pulse' };
  return { label: 'YIELD', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
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

  const handleBuy = () => { haptic(); trade({ type: 'BUY', stock, amount: tradeAmount }); };
  const handleSell = () => { haptic(); trade({ type: 'SELL', stock, amount: tradeAmount }); };
  const handleCustomAmount = () => {
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) { setTradeAmount(stock, val); setCustomInput(''); }
  };

  const pnl = shares > 0 ? (price - avgCost) * shares : 0;

  return (
    <div className="tb-card card-elevated border tb-border rounded-xl p-3 hover:border-[var(--tb-text-muted)] transition-colors">
      {/* Header: name + badge + price */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-bold tb-text text-xs tracking-wide">{stock}</span>
          <span className={`text-[9px] px-1.5 py-px rounded-full border font-bold ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <span className="font-[family-name:var(--font-mono)] font-bold tb-text text-sm">
          ${(price / 100).toFixed(2)}
        </span>
      </div>

      {/* Price bar */}
      <div className="w-full h-1 bg-[var(--tb-border)] rounded-full mb-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            price <= 25 ? 'bg-danger-red' :
            price >= SPLIT_VALUE - 25 ? 'bg-emerald-400' :
            'bg-accent-green'
          }`}
          style={{ width: `${priceBarPercent}%` }}
        />
      </div>

      {/* Holdings row — single tight line */}
      <div className="flex items-center gap-3 mb-2 text-[11px] font-[family-name:var(--font-mono)]">
        <span className="tb-text-muted">{shares.toLocaleString()} shares</span>
        {avgCost > 0 && <span className="tb-text-muted">avg ${(avgCost / 100).toFixed(2)}</span>}
        {pnl !== 0 && (
          <span className={`font-bold ${pnl > 0 ? 'tb-green-text' : 'text-danger-red'}`}>
            {pnl > 0 ? '+' : ''}${(pnl / 100).toFixed(2)}
          </span>
        )}
      </div>

      {/* Trade increment buttons */}
      <div className="flex gap-1 mb-1.5 flex-wrap">
        {increments.map((inc) => (
          <button
            key={inc}
            onClick={() => { haptic(); setTradeAmount(stock, inc); }}
            className={`
              px-1.5 py-1 rounded text-[10px] font-[family-name:var(--font-mono)] font-bold
              min-w-[36px] min-h-[36px] lg:min-w-0 lg:min-h-0 lg:py-0.5
              transition-colors
              ${tradeAmount === inc
                ? 'bg-accent-green text-black'
                : 'bg-[var(--tb-input-bg)] tb-text-secondary hover:bg-[var(--tb-hover)] border tb-border'
              }
            `}
          >
            {inc >= 1000000 ? `${inc / 1000000}M` : inc >= 1000 ? `${inc / 1000}k` : inc}
          </button>
        ))}
        <button
          onClick={() => { haptic(); setTradeAmount(stock, 'MAX'); }}
          className={`
            px-1.5 py-1 rounded text-[10px] font-bold
            min-w-[36px] min-h-[36px] lg:min-w-0 lg:min-h-0 lg:py-0.5
            transition-colors
            ${tradeAmount === 'MAX'
              ? 'bg-accent-green text-black'
              : 'bg-[var(--tb-input-bg)] tb-text-secondary hover:bg-[var(--tb-hover)] border tb-border'
            }
          `}
        >
          MAX
        </button>
      </div>

      {/* SELL | qty input | BUY */}
      <div className="flex gap-1.5">
        <button
          onClick={handleSell}
          disabled={shares <= 0 || isRolling}
          className="w-20 flex-none rounded-lg font-bold text-xs bg-red-500/10 border border-red-500/30 text-danger-red hover:bg-red-500/20 disabled:opacity-25 disabled:cursor-not-allowed h-10 lg:h-9 transition-colors"
        >
          SELL
        </button>
        <input
          type="number"
          placeholder="Qty"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onBlur={handleCustomAmount}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCustomAmount(); }}
          className="flex-1 min-w-0 tb-input border tb-border rounded-lg px-2 text-[10px] font-[family-name:var(--font-mono)] h-10 lg:h-9 focus:outline-none focus:border-accent-green/50 text-center"
        />
        <button
          onClick={handleBuy}
          disabled={isRolling || (gameState?.player.money ?? 0) < price}
          className="w-20 flex-none rounded-lg font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 tb-green-text hover:bg-emerald-500/20 disabled:opacity-25 disabled:cursor-not-allowed h-10 lg:h-9 transition-colors"
        >
          BUY
        </button>
      </div>
    </div>
  );
}
