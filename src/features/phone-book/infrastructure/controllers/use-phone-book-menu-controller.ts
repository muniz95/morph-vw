import { useMemo } from 'react';
import useTranslation from '@/shared/hooks/use-translation';
import { buildPhoneBookMenu } from '@/features/phone-book/application/menus';
import { useUiStore } from '@/app/state/ui-store';
import { useCircularMenuController } from '@/features/settings/infrastructure/controllers/use-circular-menu-controller';
import { usePhoneNavigation } from '@/app/hooks/use-phone-navigation';

export const usePhoneBookMenuController = () => {
  const { t } = useTranslation(['phonebook']);
  const { push } = usePhoneNavigation();
  const secondLevel = useUiStore((state) => state.secondLevel);
  const setSecondLevel = useUiStore((state) => state.setSecondLevel);
  const setThirdLevel = useUiStore((state) => state.setThirdLevel);
  const menuItems = useMemo(() => buildPhoneBookMenu(t), [t]);
  const { currentLabel } = useCircularMenuController({
    menuItems,
    initialPosition: secondLevel > 0 ? secondLevel - 1 : 0,
    setLevel: (position) => {
      setSecondLevel(position + 1);
      setThirdLevel(0);
    },
    goTo: push,
  });

  return {
    label: currentLabel,
  };
};
