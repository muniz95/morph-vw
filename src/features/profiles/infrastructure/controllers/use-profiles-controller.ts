import { useCallback, useEffect } from 'react';
import vibration from '@/shared/lib/vibration';
import { useUiStore } from '@/app/state/ui-store';
import useProfilesData from '@/features/profiles/infrastructure/hooks/use-profiles-data';
import { useVerticalHardwareListNavigation } from '@/shared/hooks/use-vertical-hardware-list-navigation';

export const useProfilesController = () => {
  const setSecondLevel = useUiStore((state) => state.setSecondLevel);
  const openModal = useUiStore((state) => state.openModal);
  const { currentProfile, profiles, setCurrentProfile } = useProfilesData();

  useEffect(() => {
    setSecondLevel(0);
  }, [setSecondLevel]);

  const applyProfile = useCallback(
    (profile: (typeof profiles)[number]) => {
      setCurrentProfile(profile);
      vibration.success();
      openModal();
    },
    [openModal, setCurrentProfile]
  );

  const { selectedItem: selectedProfile, setSelectedIndex } =
    useVerticalHardwareListNavigation({
      items: profiles,
      initialIndex: profiles.findIndex(
        (profile) => profile.id === currentProfile.id
      ),
      onConfirm: applyProfile,
    });

  const selectProfile = useCallback(
    (profile: (typeof profiles)[number]) => {
      setSelectedIndex(
        profiles.findIndex((currentProfile) => currentProfile.id === profile.id)
      );
    },
    [profiles, setSelectedIndex]
  );

  return {
    profiles,
    selectedProfile,
    selectProfile,
    applyProfile,
  };
};
