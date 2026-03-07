'use client';

import { X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';

export function SettingsModal() {
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const turboMode = useUIStore((s) => s.turboMode);
  const haptics = useUIStore((s) => s.haptics);
  const toggleTurbo = useUIStore((s) => s.toggleTurbo);
  const toggleHaptics = useUIStore((s) => s.toggleHaptics);
  const resetData = useGameStore((s) => s.resetData);
  const setView = useUIStore((s) => s.setView);

  const handleReset = () => {
    if (confirm('Reset all data? This will clear your high score, saved games, and settings.')) {
      resetData();
      setView('MENU');
      toggleSettings();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={toggleSettings}>
      <div
        className="bg-card-bg border border-card-border rounded-2xl p-6 w-full max-w-sm animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">SETTINGS</h2>
          <button onClick={toggleSettings} className="p-2 hover:bg-slate-800 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Turbo Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">Turbo Mode</div>
              <div className="text-xs text-slate-400">Faster dice rolling</div>
            </div>
            <button
              onClick={toggleTurbo}
              className={`w-12 h-7 rounded-full transition-colors relative ${turboMode ? 'bg-accent-green' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${turboMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">Haptics</div>
              <div className="text-xs text-slate-400">Vibration feedback</div>
            </div>
            <button
              onClick={toggleHaptics}
              className={`w-12 h-7 rounded-full transition-colors relative ${haptics ? 'bg-accent-green' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${haptics ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Support */}
          <div className="pt-4 border-t border-card-border">
            <div className="text-xs text-slate-500 text-center mb-3">
              Support: tickrboom@example.com
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-lg bg-red-900/30 border border-red-700 text-danger-red font-bold text-sm hover:bg-red-900/50 min-h-[48px] transition-colors"
          >
            RESET ALL DATA
          </button>
        </div>
      </div>
    </div>
  );
}
