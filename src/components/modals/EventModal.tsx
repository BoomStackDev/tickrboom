'use client';

import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';

export function EventModal() {
  const activeEvent = useUIStore((s) => s.activeEvent);
  const setActiveEvent = useUIStore((s) => s.setActiveEvent);
  const haptic = useHaptics();

  if (!activeEvent) return null;

  const handleDismiss = () => {
    haptic();
    setActiveEvent(null);
  };

  const icon = activeEvent.type === 'danger'
    ? <AlertTriangle size={32} className="text-danger-red" />
    : <TrendingUp size={32} className="text-accent-green" />;

  const borderColor = activeEvent.type === 'danger' ? 'border-red-700' : activeEvent.type === 'profit' ? 'border-emerald-700' : 'border-blue-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className={`bg-card-bg border-2 ${borderColor} rounded-2xl p-6 w-full max-w-sm text-center animate-pop-in`}>
        <div className="mb-4">{icon}</div>
        <h2 className="text-xl font-black mb-3">{activeEvent.title}</h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">{activeEvent.message}</p>
        <button
          onClick={handleDismiss}
          className={`w-full py-3 rounded-lg font-bold min-h-[48px] ${
            activeEvent.type === 'danger'
              ? 'bg-red-900/50 border border-red-700 text-danger-red'
              : 'bg-accent-green text-black'
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
