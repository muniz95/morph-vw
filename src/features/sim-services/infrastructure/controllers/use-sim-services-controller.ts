import { useCallback, useEffect } from 'react';
import useSimNumbersData from '@/features/sim-services/infrastructure/hooks/use-sim-numbers-data';
import { say } from '@/shared/lib/sound';
import {
  getSelectedSimServiceMessage,
  hasSelectedSimService,
} from '@/features/sim-services/domain/use-cases';
import { useUiStore } from '@/app/state/ui-store';
import { useVerticalHardwareListNavigation } from '@/shared/hooks/use-vertical-hardware-list-navigation';

export const useSimServicesController = () => {
  const simNumbers = useSimNumbersData();
  const setSecondLevel = useUiStore((state) => state.setSecondLevel);

  useEffect(() => {
    setSecondLevel(0);
  }, [setSecondLevel]);

  const play = useCallback((simNumber?: (typeof simNumbers)[number] | null) => {
    const message = getSelectedSimServiceMessage(simNumber);
    if (!message) return;
    say(message);
  }, []);

  const { selectedItem: currentSimNumber, setSelectedIndex } =
    useVerticalHardwareListNavigation({
      items: simNumbers,
      onConfirm: play,
    });

  const setCurrentSimNumber = useCallback(
    (simNumber: (typeof simNumbers)[number]) => {
      setSelectedIndex(
        simNumbers.findIndex(
          (currentSimNumber) => currentSimNumber.id === simNumber.id
        )
      );
    },
    [setSelectedIndex, simNumbers]
  );

  return {
    simNumbers,
    currentSimNumber,
    setCurrentSimNumber,
    canPlay: hasSelectedSimService(currentSimNumber),
    play: () => play(currentSimNumber),
  };
};
