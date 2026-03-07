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

  const handleMainMenu = () => { haptic(); autoSave(); setView('MENU'); };

  return (
    <div className="flex gap-1.5 px-3 lg:px-4 mt-3 mb-16 md:mb-6">
      <button
        onClick={() => { haptic(); openSaveManager('SAVE'); }}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg tb-card border tb-border tb-text-secondary hover:bg-[var(--tb-hover)] font-bold text-xs min-h-[40px] transition-colors"
      >
        <Save size={13} />
        Save
      </button>
      <button
        onClick={handleMainMenu}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg tb-card border tb-border tb-text-secondary hover:bg-[var(--tb-hover)] font-bold text-xs min-h-[40px] transition-colors"
      >
        <RotateCcw size={13} />
        Menu
      </button>
      <button
        onClick={() => { haptic(); toggleSettings(); }}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg tb-card border tb-border tb-text-secondary hover:bg-[var(--tb-hover)] font-bold text-xs min-h-[40px] transition-colors"
      >
        <Settings size={13} />
        Settings
      </button>
    </div>
  );
}
