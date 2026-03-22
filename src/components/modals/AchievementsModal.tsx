'use client';

import { useState } from 'react';
import { X, Trophy, Lock } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { getAllAchievements, type AchievementCategory, type AchievementRarity } from '@/lib/engine/achievements';

const CATEGORIES: { id: AchievementCategory; label: string }[] = [
  { id: 'wealth', label: 'Wealth' },
  { id: 'trading', label: 'Trading' },
  { id: 'survival', label: 'Survival' },
  { id: 'secret', label: 'Secret' },
];

const RARITY_BADGE: Record<AchievementRarity, { bg: string; text: string; label: string }> = {
  common: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Common' },
  rare: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Rare' },
  epic: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Epic' },
  legendary: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Legendary' },
};

const RARITY_ICON: Record<AchievementRarity, string> = {
  common: 'text-gray-500',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export function AchievementsModal() {
  const setShowAchievements = useUIStore((s) => s.setShowAchievements);
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);
  const [activeTab, setActiveTab] = useState<AchievementCategory>('wealth');

  const all = getAllAchievements();
  const totalUnlocked = all.filter((a) => unlockedIds.has(a.id)).length;
  const filtered = all.filter((a) => a.category === activeTab);

  const handleClose = () => setShowAchievements(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tb-overlay p-4" onClick={handleClose}>
      <div
        className="tb-card border tb-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-pop-in card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <h2 className="text-lg font-black tb-text">ACHIEVEMENTS</h2>
            <p className="text-xs tb-text-muted font-bold">{totalUnlocked} / {all.length} Unlocked</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-[var(--tb-hover)] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center tb-text-secondary">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 px-5 pb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`py-2 rounded-lg text-[11px] font-bold transition-all border ${
                activeTab === cat.id
                  ? 'bg-accent-green/10 border-accent-green tb-green-text'
                  : 'tb-card tb-border tb-text-muted hover:bg-[var(--tb-hover)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievement list */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {filtered.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            const hidden = a.secret && !unlocked;
            const rarity = RARITY_BADGE[a.rarity];
            const iconColor = RARITY_ICON[a.rarity];

            return (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-3 rounded-xl border tb-border ${
                  unlocked ? '' : 'opacity-50'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {unlocked ? (
                    <Trophy size={18} className={iconColor} />
                  ) : (
                    <Lock size={18} className="tb-text-muted" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tb-text truncate">
                      {hidden ? '???' : a.name}
                    </span>
                    <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${rarity.bg} ${rarity.text}`}>
                      {rarity.label}
                    </span>
                  </div>
                  <p className="text-[11px] tb-text-muted leading-snug mt-0.5">
                    {hidden ? 'Keep playing to find out.' : a.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
