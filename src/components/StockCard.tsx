'use client';

import { useGameStore } from '@/stores/gameStore';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';
import { usePopover } from '@/hooks/usePopover';
import { getDynamicIncrements } from '@/lib/engine/increments';
import { SPLIT_VALUE } from '@/lib/engine/constants';
import { calculateNetWorth } from '@/lib/engine/netWorth';
import { useState } from 'react';

const BADGE_HELP: Record<string, { title: string; body: string }> = {
  DANGER: {
    title: 'DANGER',
    body: 'This stock is near $0.00. If it hits $0.00 it crashes \u2014 you lose all your shares and the price resets to $1.00.',
  },
  'NO YIELD': {
    title: 'NO YIELD',
    body: 'Dividends only pay when the price is strictly above $1.00. This stock is at or below $1.00, so dividend rolls won\u2019t pay out.',
  },
  YIELD: {
    title: 'YIELD',
    body: 'This stock is above $1.00. If a dividend is rolled, you\u2019ll receive a cash payout for every share you own.',
  },
  'SPLIT WATCH': {
    title: 'SPLIT WATCH',
    body: 'This stock is close to $2.00. If it hits $2.00 it splits \u2014 your share count doubles instantly and the price resets to $1.00.',
  },
};

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
  const popover = usePopover(`badge-${stock}`);

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
  const help = BADGE_HELP[status.label];

  return (
    <div className="tb-card card-elevated border tb-border rounded-xl p-3 lg:p-5 hover:border-[var(--tb-text-muted)] transition-colors">
      {/* Header: name + badge + price */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-bold tb-text text-xs lg:text-sm tracking-wide">{stock}</span>
          <div
            className="relative"
            onMouseLeave={popover.close}
          >
            <button
              onClick={(e) => { e.stopPropagation(); popover.toggle(); }}
              className={`text-[9px] px-1.5 py-px rounded-full border font-bold cursor-help ${status.cls}`}
            >
              {status.label}
            </button>
            {popover.isOpen && help && (
              <div
                className="absolute left-0 bottom-full mb-1.5 z-50 w-[220px] p-3 rounded-xl tb-card border tb-border shadow-lg animate-pop-in card-elevated"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`text-xs font-bold mb-1 ${status.cls.split(' ').find((c) => c.startsWith('text-')) || 'tb-text'}`}>
                  {help.title}
                </div>
                <div className="text-xs tb-text-muted leading-relaxed">{help.body}</div>
              </div>
            )}
          </div>
        </div>
        <span className="font-[family-name:var(--font-mono)] font-bold tb-text text-sm lg:text-base">
          ${(price / 100).toFixed(2)}
        </span>
      </div>

      {/* Price bar with end labels */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[9px] font-bold text-danger-red flex-none">$0</span>
        <div className="flex-1 h-1 bg-[var(--tb-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              price <= 25 ? 'bg-danger-red' :
              price >= SPLIT_VALUE - 25 ? 'bg-emerald-400' :
              'bg-accent-green'
            }`}
            style={{ width: `${priceBarPercent}%` }}
          />
        </div>
        <span className="text-[9px] font-bold text-emerald-400 flex-none">$2 SPLIT</span>
      </div>

      {/* Holdings row — single tight line */}
      <div className="flex items-center gap-3 mb-2 text-[11px] lg:text-sm font-[family-name:var(--font-mono)]">
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
              px-1.5 py-1 rounded text-[10px] lg:text-xs font-[family-name:var(--font-mono)] font-bold
              min-w-[36px] min-h-[36px] lg:min-w-0 lg:min-h-[36px] lg:px-3 lg:py-1.5
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
            px-1.5 py-1 rounded text-[10px] lg:text-xs font-bold
            min-w-[36px] min-h-[36px] lg:min-w-0 lg:min-h-[36px] lg:px-3 lg:py-1.5
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
          className="w-20 flex-none rounded-lg font-bold text-xs lg:text-sm bg-red-500/10 border border-red-500/30 text-danger-red hover:bg-red-500/20 disabled:opacity-25 disabled:cursor-not-allowed h-10 lg:h-11 transition-colors"
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
          className="flex-1 min-w-0 tb-input border tb-border rounded-lg px-2 text-base lg:text-sm font-[family-name:var(--font-mono)] h-10 lg:h-11 focus:outline-none focus:border-accent-green/50 text-center"
        />
        <button
          onClick={handleBuy}
          disabled={isRolling || (gameState?.player.money ?? 0) < price}
          className="w-20 flex-none rounded-lg font-bold text-xs lg:text-sm bg-emerald-500/10 border border-emerald-500/30 tb-green-text hover:bg-emerald-500/20 disabled:opacity-25 disabled:cursor-not-allowed h-10 lg:h-11 transition-colors"
        >
          BUY
        </button>
      </div>
    </div>
  );
}
