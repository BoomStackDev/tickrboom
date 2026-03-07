'use client';

import { useCallback } from 'react';
import { platform } from '@/lib/platform/local';

export function useHaptics() {
  const trigger = useCallback((pattern: number | number[] = 10) => {
    const enabled = typeof window !== 'undefined'
      && localStorage.getItem('tickrBoom_haptics') !== 'off';
    if (enabled) {
      platform.triggerHaptic(pattern);
    }
  }, []);

  return trigger;
}
