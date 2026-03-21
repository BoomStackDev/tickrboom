'use client';

import { AlertTriangle, TrendingUp, Newspaper } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useHaptics } from '@/hooks/useHaptics';

export function EventModal() {
  const activeEvent = useUIStore((s) => s.activeEvent);
  const setActiveEvent = useUIStore((s) => s.setActiveEvent);
  const haptic = useHaptics();

  if (!activeEvent) return null;

  const handleDismiss = () => { haptic(); setActiveEvent(null); };

  const isBreaking = !!activeEvent.label;

  const icon = isBreaking
    ? <Newspaper size={28} className={activeEvent.type === 'danger' ? 'text-danger-red' : activeEvent.type === 'profit' ? 'tb-green-text' : 'text-blue-400'} />
    : activeEvent.type === 'danger'
      ? <AlertTriangle size={28} className="text-danger-red" />
      : <TrendingUp size={28} className="tb-green-text" />;

  const borderColor = activeEvent.type === 'danger' ? 'border-red-500' : activeEvent.type === 'profit' ? 'border-emerald-500' : 'border-blue-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tb-overlay p-4">
      <div className={`tb-card card-elevated border-2 ${borderColor} rounded-2xl p-6 w-full max-w-sm text-center animate-pop-in`}>
        {isBreaking && (
          <div className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 ${
            activeEvent.type === 'danger' ? 'bg-red-500/20 text-danger-red' : activeEvent.type === 'profit' ? 'bg-emerald-500/20 tb-green-text' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {activeEvent.label}
          </div>
        )}
        <div className={isBreaking ? 'mb-2' : 'mb-3'}>{icon}</div>
        <h2 className="text-lg font-black tb-text mb-2">{activeEvent.title}</h2>
        <p className="tb-text-secondary text-xs mb-5 leading-relaxed whitespace-pre-line">{activeEvent.message}</p>
        <button
          onClick={handleDismiss}
          className={`w-full py-2.5 rounded-lg font-bold text-sm min-h-[44px] ${
            activeEvent.type === 'danger'
              ? 'bg-red-500/10 border border-red-500/30 text-danger-red'
              : 'bg-accent-green text-black'
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
