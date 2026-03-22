'use client';

import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { useAchievementStore } from '@/stores/achievementStore';
import type { AchievementRarity } from '@/lib/engine/achievements';

const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: 'border-gray-400 text-gray-300',
  rare: 'border-blue-400 text-blue-400',
  epic: 'border-purple-400 text-purple-400',
  legendary: 'border-yellow-400 text-yellow-400',
};

const RARITY_ICON: Record<AchievementRarity, string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export function AchievementToast() {
  const pendingToast = useAchievementStore((s) => s.pendingToast);
  const dismissToast = useAchievementStore((s) => s.dismissToast);

  useEffect(() => {
    if (!pendingToast) return;
    const timer = setTimeout(dismissToast, 3000);
    return () => clearTimeout(timer);
  }, [pendingToast, dismissToast]);

  if (!pendingToast) return null;

  const colors = RARITY_COLORS[pendingToast.rarity];
  const iconColor = RARITY_ICON[pendingToast.rarity];

  return (
    <div className="fixed top-4 right-4 z-[900] animate-toast-slide-in pointer-events-auto">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors} tb-card card-elevated max-w-[300px] shadow-lg`}
        onClick={dismissToast}
      >
        <Trophy size={20} className={iconColor} />
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest tb-text-muted font-bold">
            Achievement Unlocked
          </div>
          <div className="text-sm font-black tb-text truncate">{pendingToast.name}</div>
        </div>
      </div>
    </div>
  );
}
