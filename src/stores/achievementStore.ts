'use client';

import { create } from 'zustand';
import { getAchievementById, type AchievementDef } from '@/lib/engine/achievements';

const STORAGE_KEY = 'tickrboom_achievements';

interface AchievementStore {
  unlockedIds: Set<string>;
  pendingToast: AchievementDef | null;
  toastQueue: AchievementDef[];

  unlock: (ids: string[]) => void;
  dismissToast: () => void;
  resetAchievements: () => void;
}

function loadFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveToStorage(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  unlockedIds: loadFromStorage(),
  pendingToast: null,
  toastQueue: [],

  unlock: (ids: string[]) => {
    if (ids.length === 0) return;
    const { unlockedIds, pendingToast, toastQueue } = get();
    const newSet = new Set(unlockedIds);
    const newToasts: AchievementDef[] = [];

    for (const id of ids) {
      if (newSet.has(id)) continue;
      newSet.add(id);
      const def = getAchievementById(id);
      if (def) newToasts.push(def);
    }

    if (newToasts.length === 0) return;
    saveToStorage(newSet);

    if (pendingToast) {
      set({ unlockedIds: newSet, toastQueue: [...toastQueue, ...newToasts] });
    } else {
      const [first, ...rest] = newToasts;
      set({ unlockedIds: newSet, pendingToast: first, toastQueue: [...toastQueue, ...rest] });
    }
  },

  dismissToast: () => {
    const { toastQueue } = get();
    if (toastQueue.length > 0) {
      const [next, ...rest] = toastQueue;
      set({ pendingToast: next, toastQueue: rest });
    } else {
      set({ pendingToast: null });
    }
  },

  resetAchievements: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ unlockedIds: new Set(), pendingToast: null, toastQueue: [] });
  },
}));
