import { useEffect } from 'react';
import {
  HardwareInputHandlers,
  useHardwareInputStore,
} from '@/app/state/hardware-input-store';

export const useHardwareInputRegistration = (
  handlers: HardwareInputHandlers
) => {
  const setHandlers = useHardwareInputStore((state) => state.setHandlers);
  const clearHandlers = useHardwareInputStore((state) => state.clearHandlers);

  useEffect(() => {
    setHandlers(handlers);

    return () => {
      clearHandlers();
    };
  }, [clearHandlers, handlers, setHandlers]);
};
