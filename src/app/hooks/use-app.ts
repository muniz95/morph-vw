import { useCallback, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/app/routes';
import { useSettingsStore } from '@/features/settings/state/settings-store';
import { useUiStore } from '@/app/state/ui-store';
import { useInactivityBacklight } from '@/app/hooks/use-inactivity-backlight';
import { usePhoneNavigation } from '@/app/hooks/use-phone-navigation';

export const useApp = () => {
  const { currentPath, goHome, logicalDepth } = usePhoneNavigation();
  const routing = useRoutes([...routes], currentPath);

  const configuredBacklightLevel = useSettingsStore(
    (state) => state.backlightLevel
  );
  const inactivityTime = useSettingsStore((state) => state.inactivityTime);
  const color = useSettingsStore((state) => state.color);
  const showModal = useUiStore((state) => state.showModal);
  const closeModal = useUiStore((state) => state.closeModal);
  const firstLevel = useUiStore((state) => state.firstLevel);
  const secondLevel = useUiStore((state) => state.secondLevel);
  const thirdLevel = useUiStore((state) => state.thirdLevel);
  const fourthLevel = useUiStore((state) => state.fourthLevel);
  const fifthLevel = useUiStore((state) => state.fifthLevel);
  const [firstRender, setFirstRender] = useState(true);
  const backlightLevel = useInactivityBacklight(
    configuredBacklightLevel,
    inactivityTime
  );

  const handleModalAutoClose = useCallback(() => {
    closeModal();
    goHome();
  }, [closeModal, goHome]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFirstRender(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return {
    backlightLevel,
    color,
    routePath: currentPath,
    showModal,
    firstRender,
    handleModalAutoClose,
    routing,
    indicatorLevels: {
      firstLevel: logicalDepth >= 1 ? firstLevel : 0,
      secondLevel: logicalDepth >= 2 ? secondLevel : 0,
      thirdLevel: logicalDepth >= 3 ? thirdLevel : 0,
      fourthLevel: logicalDepth >= 4 ? fourthLevel : 0,
      fifthLevel: logicalDepth >= 5 ? fifthLevel : 0,
    },
  };
};
