import { useCallback, useEffect, useRef, useState } from 'react';

const DIMMED_BACKLIGHT_LEVEL = 10;

export const useInactivityBacklight = (
  backlightLevel: number,
  inactivityTimeInSeconds: number
) => {
  const [effectiveBacklightLevel, setEffectiveBacklightLevel] =
    useState(backlightLevel);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const scheduleDim = useCallback(() => {
    clearInactivityTimer();

    if (inactivityTimeInSeconds <= 0) {
      return;
    }

    inactivityTimerRef.current = setTimeout(() => {
      setEffectiveBacklightLevel(DIMMED_BACKLIGHT_LEVEL);
    }, inactivityTimeInSeconds * 1000);
  }, [clearInactivityTimer, inactivityTimeInSeconds]);

  const handleActivity = useCallback(() => {
    setEffectiveBacklightLevel(backlightLevel);
    scheduleDim();
  }, [backlightLevel, scheduleDim]);

  useEffect(() => {
    setEffectiveBacklightLevel(backlightLevel);

    if (inactivityTimeInSeconds <= 0) {
      clearInactivityTimer();
      return;
    }

    scheduleDim();
  }, [
    backlightLevel,
    clearInactivityTimer,
    inactivityTimeInSeconds,
    scheduleDim,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('pointerdown', handleActivity, {
      passive: true,
    });
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInactivityTimer();
    };
  }, [clearInactivityTimer, handleActivity]);

  return effectiveBacklightLevel;
};

export { DIMMED_BACKLIGHT_LEVEL };
