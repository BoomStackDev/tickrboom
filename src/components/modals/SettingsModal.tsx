'use client';

import { useState } from 'react';
import { X, Moon, Sun, Monitor } from 'lucide-react';
import { useUIStore, type ThemeMode } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { useAchievementStore } from '@/stores/achievementStore';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Moon }[] = [
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
];

export function SettingsModal() {
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const turboMode = useUIStore((s) => s.turboMode);
  const haptics = useUIStore((s) => s.haptics);
  const theme = useUIStore((s) => s.theme);
  const toggleTurbo = useUIStore((s) => s.toggleTurbo);
  const toggleHaptics = useUIStore((s) => s.toggleHaptics);
  const setTheme = useUIStore((s) => s.setTheme);
  const resetData = useGameStore((s) => s.resetData);
  const resetAchievements = useAchievementStore((s) => s.resetAchievements);
  const setView = useUIStore((s) => s.setView);

  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleReset = () => {
    resetData();
    resetAchievements();
    setConfirmingReset(false);
    setView('MENU');
    toggleSettings();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tb-overlay p-4" onClick={toggleSettings}>
      <div
        className="tb-card border tb-border rounded-2xl p-6 w-full max-w-sm animate-pop-in card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black tb-text">SETTINGS</h2>
          <button onClick={toggleSettings} className="p-2 hover:bg-[var(--tb-hover)] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center tb-text-secondary">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Theme */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] tb-text-muted font-bold mb-2">Theme</div>
            <div className="grid grid-cols-3 gap-1.5">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`
                    flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all border
                    ${theme === value
                      ? 'bg-accent-green/10 border-accent-green tb-green-text'
                      : 'tb-card tb-border tb-text-secondary hover:bg-[var(--tb-hover)]'
                    }
                  `}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Turbo Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-xs tb-text">Turbo Mode</div>
              <div className="text-[10px] tb-text-muted">Faster dice rolling</div>
            </div>
            <button
              onClick={toggleTurbo}
              className={`w-10 h-6 rounded-full transition-colors relative ${turboMode ? 'bg-accent-green' : 'bg-[var(--tb-border)]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${turboMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-xs tb-text">Haptics</div>
              <div className="text-[10px] tb-text-muted">Vibration feedback</div>
            </div>
            <button
              onClick={toggleHaptics}
              className={`w-10 h-6 rounded-full transition-colors relative ${haptics ? 'bg-accent-green' : 'bg-[var(--tb-border)]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${haptics ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="pt-3 border-t tb-border">
            <div className="text-[10px] tb-text-muted text-center mb-3">
              Support: tickrboom@example.com
            </div>
          </div>

          {confirmingReset ? (
            <div className="tb-card border border-red-500/30 rounded-lg p-3 space-y-2">
              <p className="text-xs text-danger-red font-bold text-center">Reset all data? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmingReset(false)}
                  className="flex-1 py-2 rounded-lg tb-card border tb-border tb-text-secondary font-bold text-xs min-h-[40px] hover:bg-[var(--tb-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-danger-red font-bold text-xs min-h-[40px] hover:bg-red-500/30 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingReset(true)}
              className="w-full py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-danger-red font-bold text-xs hover:bg-red-500/20 min-h-[44px] transition-colors"
            >
              RESET ALL DATA
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
