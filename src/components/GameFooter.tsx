'use client';

import { Save, RotateCcw, Settings } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { useHaptics } from '@/hooks/useHaptics';

export function GameFooter() {
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const openSaveManager = useUIStore((s) => s.openSaveManager);
  const setView = useUIStore((s) => s.setView);
  const autoSave = useGameStore((s) => s.autoSave);
  const haptic = useHaptics();

  const handleMainMenu = () => {
    haptic();
    autoSave();
    setView('MENU');
  };

  return (
    <div className="flex gap-2 px-4 mt-4 mb-20 md:mb-8">
      <button
        onClick={() => { haptic(); openSaveManager('SAVE'); }}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card-bg border border-card-border text-slate-300 hover:bg-slate-800 font-bold text-sm min-h-[48px] transition-colors"
      >
        <Save size={16} />
        SAVE
      </button>
      <button
        onClick={handleMainMenu}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card-bg border border-card-border text-slate-300 hover:bg-slate-800 font-bold text-sm min-h-[48px] transition-colors"
      >
        <RotateCcw size={16} />
        MENU
      </button>
      <button
        onClick={() => { haptic(); toggleSettings(); }}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-card-bg border border-card-border text-slate-300 hover:bg-slate-800 font-bold text-sm min-h-[48px] transition-colors"
      >
        <Settings size={16} />
        SETTINGS
      </button>
    </div>
  );
}
