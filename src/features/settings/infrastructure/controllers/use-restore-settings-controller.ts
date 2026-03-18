import { useCallback } from 'react';
import vibration from '@/shared/lib/vibration';
import { useSettingsStore } from '@/features/settings/state/settings-store';
import { useUiStore } from '@/app/state/ui-store';
import { usePhoneNavigation } from '@/app/hooks/use-phone-navigation';

export const useRestoreSettingsController = () => {
  const resetDefaults = useSettingsStore((state) => state.resetDefaults);
  const openModal = useUiStore((state) => state.openModal);
  const { goBack } = usePhoneNavigation();

  const resetData = useCallback(() => {
    resetDefaults();
    vibration.reset();
    openModal();
  }, [openModal, resetDefaults]);

  return {
    resetData,
    goBack,
  };
};
