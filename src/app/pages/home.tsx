import { useEffect, useMemo } from 'react';
import useTranslation from '@/shared/hooks/use-translation';
import SwipeMenu from '@/shared/ui/swipe-menu';
import { useUiStore } from '@/app/state/ui-store';
import { buildHomeMenu } from '@/app/modules/home-menu';
import { usePhoneNavigation } from '@/app/hooks/use-phone-navigation';
import { useCircularMenuController } from '@/features/settings/infrastructure/controllers/use-circular-menu-controller';

const Home = () => {
  const { t } = useTranslation(['home']);
  const firstLevel = useUiStore((state) => state.firstLevel);
  const setFirstLevel = useUiStore((state) => state.setFirstLevel);
  const resetLevels = useUiStore((state) => state.resetLevels);
  const { push } = usePhoneNavigation();
  const menus = useMemo(() => buildHomeMenu(t), [t]);
  const { currentLabel } = useCircularMenuController({
    menuItems: menus,
    initialPosition: firstLevel > 0 ? firstLevel - 1 : 0,
    setLevel: (position) => setFirstLevel(position + 1),
    goTo: push,
  });

  useEffect(() => {
    resetLevels();
  }, [resetLevels]);

  return <SwipeMenu label={currentLabel} />;
};

export default Home;
