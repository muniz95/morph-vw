import { useCallback } from 'react';
import { useUiStore } from '@/app/state/ui-store';
import {
  getCurrentPath,
  getLogicalDepth,
  MAIN_MENU_PATH,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';

export const usePhoneNavigation = () => {
  const stack = usePhoneNavigationStore((state) => state.stack);
  const push = usePhoneNavigationStore((state) => state.push);
  const replace = usePhoneNavigationStore((state) => state.replace);
  const storeGoBack = usePhoneNavigationStore((state) => state.goBack);
  const storeGoHome = usePhoneNavigationStore((state) => state.goHome);
  const storeOpenMenu = usePhoneNavigationStore((state) => state.openMenu);
  const firstLevel = useUiStore((state) => state.firstLevel);
  const setFirstLevel = useUiStore((state) => state.setFirstLevel);
  const resetLevels = useUiStore((state) => state.resetLevels);

  const goHome = useCallback(() => {
    setFirstLevel(1);
    resetLevels();
    storeGoHome();
  }, [resetLevels, setFirstLevel, storeGoHome]);

  const openMenu = useCallback(() => {
    if (firstLevel === 0) {
      setFirstLevel(1);
    }
    resetLevels();
    storeOpenMenu();
  }, [firstLevel, resetLevels, setFirstLevel, storeOpenMenu]);

  return {
    currentPath: getCurrentPath(stack),
    logicalDepth: getLogicalDepth(stack),
    canGoBack: stack.length > 1,
    isMainMenu: getCurrentPath(stack) === MAIN_MENU_PATH,
    push,
    replace,
    goBack: storeGoBack,
    goHome,
    openMenu,
  };
};
