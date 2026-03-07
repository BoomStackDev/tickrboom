'use client';

import { useState } from 'react';
import { X, Save, Trash2, Check } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { useHaptics } from '@/hooks/useHaptics';

export function SaveManagerModal() {
  const { mode } = useUIStore((s) => s.showSaveManager);
  const closeSaveManager = useUIStore((s) => s.closeSaveManager);
  const setView = useUIStore((s) => s.setView);
  const setNotification = useUIStore((s) => s.setNotification);
  const manualSaves = useGameStore((s) => s.manualSaves);
  const manualSave = useGameStore((s) => s.manualSave);
  const manualLoad = useGameStore((s) => s.manualLoad);
  const deleteSave = useGameStore((s) => s.deleteSave);
  const haptic = useHaptics();

  const [saveName, setSaveName] = useState('');
  const [overwriteId, setOverwriteId] = useState<string | null>(null);

  const handleSave = () => {
    if (!saveName.trim()) return;
    haptic();
    manualSave(saveName.trim(), overwriteId);
    setNotification({ type: 'profit', msg: 'GAME SAVED!' });
    setTimeout(() => setNotification(null), 2000);
    setSaveName('');
    setOverwriteId(null);
    closeSaveManager();
  };

  const handleLoad = (save: typeof manualSaves[0]) => {
    haptic();
    manualLoad(save);
    setView('GAME');
    closeSaveManager();
  };

  const handleDelete = (id: string) => {
    haptic();
    if (confirm('Delete this save?')) {
      deleteSave(id);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatMoney = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(2)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`;
    return `$${dollars.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={closeSaveManager}>
      <div
        className="bg-card-bg border border-card-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">{mode === 'SAVE' ? 'SAVE GAME' : 'LOAD GAME'}</h2>
          <button onClick={closeSaveManager} className="p-2 hover:bg-slate-800 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        {/* Save input (only in SAVE mode) */}
        {mode === 'SAVE' && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Save name..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white min-h-[44px]"
              />
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="px-4 py-2.5 rounded-lg bg-accent-green text-black font-bold text-sm min-h-[44px] disabled:opacity-30"
              >
                <Save size={16} />
              </button>
            </div>
            {overwriteId && (
              <p className="text-xs text-yellow-400 mt-1">Overwriting existing save</p>
            )}
          </div>
        )}

        {/* Save list */}
        {manualSaves.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No saved games</p>
        ) : (
          <div className="space-y-2">
            {manualSaves.map((save) => (
              <div
                key={save.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{save.name}</div>
                  <div className="text-xs text-slate-400 font-[family-name:var(--font-mono)]">
                    {formatMoney(save.netWorth)} &middot; {formatDate(save.timestamp)}
                  </div>
                  {save.mode && (
                    <div className="text-[10px] text-slate-500">{save.mode.difficulty}</div>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  {mode === 'SAVE' && (
                    <button
                      onClick={() => { setOverwriteId(save.id); setSaveName(save.name); }}
                      className="p-2 hover:bg-slate-700 rounded min-w-[40px] min-h-[40px] flex items-center justify-center text-yellow-400"
                      title="Overwrite"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {mode === 'LOAD' && (
                    <button
                      onClick={() => handleLoad(save)}
                      className="px-3 py-1.5 bg-accent-green/20 border border-emerald-700 rounded text-accent-green text-xs font-bold min-h-[40px]"
                    >
                      LOAD
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(save.id)}
                    className="p-2 hover:bg-red-900/50 rounded min-w-[40px] min-h-[40px] flex items-center justify-center text-danger-red"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
