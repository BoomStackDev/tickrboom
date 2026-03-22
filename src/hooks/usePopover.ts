'use client';

import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function usePopover(id: string) {
  const activePopover = useUIStore((s) => s.activePopover);
  const setActivePopover = useUIStore((s) => s.setActivePopover);
  const isOpen = activePopover === id;

  const open = useCallback(() => {
    setActivePopover(id);
  }, [id, setActivePopover]);

  const close = useCallback(() => {
    if (useUIStore.getState().activePopover === id) {
      setActivePopover(null);
    }
  }, [id, setActivePopover]);

  const toggle = useCallback(() => {
    if (useUIStore.getState().activePopover === id) {
      setActivePopover(null);
    } else {
      setActivePopover(id);
    }
  }, [id, setActivePopover]);

  // Close on outside click (1-frame delay to prevent open tap from immediately closing)
  useEffect(() => {
    if (!isOpen) return;
    let frame: number;
    const handler = () => { close(); };
    frame = requestAnimationFrame(() => {
      document.addEventListener('click', handler);
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('click', handler);
    };
  }, [isOpen, close]);

  return { isOpen, open, close, toggle };
}
