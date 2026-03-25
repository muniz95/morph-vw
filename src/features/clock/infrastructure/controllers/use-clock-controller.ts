import { useEffect } from 'react';
import { useUiStore } from '@/app/state/ui-store';
import { useTimer } from '@/shared/hooks/use-timer';
import { formatClockTime } from '@/shared/utils/date-time.util';

export const useClockController = () => {
  const date = useTimer();
  const setSecondLevel = useUiStore((state) => state.setSecondLevel);

  useEffect(() => {
    setSecondLevel(1);
  }, [setSecondLevel]);

  return {
    timeLabel: formatClockTime(date),
  };
};
