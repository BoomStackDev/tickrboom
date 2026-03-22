'use client';

import { create } from 'zustand';
import type { GameEvent, Notification } from '@/lib/engine/types';

export type ThemeMode = 'dark' | 'light' | 'system';

interface UIStore {
  view: 'MENU' | 'GAME';
  isRolling: boolean;
  isShaking: boolean;
  isFlashing: boolean;
  showSettings: boolean;
  showTutorial: boolean;
  showAchievements: boolean;
  showSaveManager: { show: boolean; mode: 'SAVE' | 'LOAD' };
  activeEvent: GameEvent | null;
  notification: Notification | null;
  turboMode: boolean;
  haptics: boolean;
  setupName: string;
  theme: ThemeMode;

  // Actions
  setView: (view: 'MENU' | 'GAME') => void;
  setRolling: (rolling: boolean) => void;
  setShaking: (shaking: boolean) => void;
  setFlashing: (flashing: boolean) => void;
  toggleSettings: () => void;
  toggleTutorial: () => void;
  setShowAchievements: (val: boolean) => void;
  openSaveManager: (mode: 'SAVE' | 'LOAD') => void;
  closeSaveManager: () => void;
  setActiveEvent: (event: GameEvent | null) => void;
  setNotification: (notification: Notification | null) => void;
  toggleTurbo: () => void;
  toggleHaptics: () => void;
  setSetupName: (name: string) => void;
  setTheme: (theme: ThemeMode) => void;
  loadSettings: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  view: 'MENU',
  isRolling: false,
  isShaking: false,
  isFlashing: false,
  showSettings: false,
  showTutorial: false,
  showAchievements: false,
  showSaveManager: { show: false, mode: 'LOAD' },
  activeEvent: null,
  notification: null,
  turboMode: false,
  haptics: true,
  setupName: 'Trader 1',
  theme: 'dark',

  setView: (view) => set({ view }),
  setRolling: (rolling) => set({ isRolling: rolling }),
  setShaking: (shaking) => set({ isShaking: shaking }),
  setFlashing: (flashing) => set({ isFlashing: flashing }),

  toggleSettings: () => set({ showSettings: !get().showSettings }),

  toggleTutorial: () => set({ showTutorial: !get().showTutorial }),
  setShowAchievements: (val: boolean) => set({ showAchievements: val }),

  openSaveManager: (mode) => set({ showSaveManager: { show: true, mode } }),
  closeSaveManager: () => set({ showSaveManager: { show: false, mode: 'LOAD' } }),

  setActiveEvent: (event) => set({ activeEvent: event }),
  setNotification: (notification) => set({ notification }),

  toggleTurbo: () => {
    const newMode = !get().turboMode;
    set({ turboMode: newMode });
    if (typeof window !== 'undefined') {
      localStorage.setItem('tickrBoom_turbo', newMode ? 'on' : 'off');
    }
  },

  toggleHaptics: () => {
    const newState = !get().haptics;
    set({ haptics: newState });
    if (typeof window !== 'undefined') {
      localStorage.setItem('tickrBoom_haptics', newState ? 'on' : 'off');
    }
  },

  setSetupName: (name) => {
    set({ setupName: name });
    if (typeof window !== 'undefined') {
      localStorage.setItem('tickrBoom_playerName', name);
    }
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('tickrBoom_theme', theme);
    }
  },

  loadSettings: () => {
    if (typeof window === 'undefined') return;
    const turbo = localStorage.getItem('tickrBoom_turbo') === 'on';
    const haptics = localStorage.getItem('tickrBoom_haptics') !== 'off';
    const name = localStorage.getItem('tickrBoom_playerName') || 'Trader 1';
    const theme = (localStorage.getItem('tickrBoom_theme') as ThemeMode) || 'dark';
    set({ turboMode: turbo, haptics, setupName: name, theme });
  },
}));
