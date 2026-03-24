import { usePhoneNavigation } from '@/app/hooks/use-phone-navigation';
import { useHardwareInputStore } from '@/app/state/hardware-input-store';
import { usePhoneTextEntryStore } from '@/app/state/phone-text-entry-store';
import { PhoneNumericKey } from '@/shared/lib/phone-text-entry';

export const useBottomBarNavigation = () => {
  const handlers = useHardwareInputStore((state) => state.handlers);
  const triggerUp = useHardwareInputStore((state) => state.triggerUp);
  const triggerDown = useHardwareInputStore((state) => state.triggerDown);
  const triggerLeft = useHardwareInputStore((state) => state.triggerLeft);
  const triggerRight = useHardwareInputStore((state) => state.triggerRight);
  const triggerConfirm = useHardwareInputStore((state) => state.triggerConfirm);
  const hasActiveTextEntry = usePhoneTextEntryStore(
    (state) => state.activeTextEntry !== null
  );
  const triggerNumericKey = usePhoneTextEntryStore(
    (state) => state.triggerNumericKey
  );
  const triggerTextEntryBack = usePhoneTextEntryStore(
    (state) => state.triggerBack
  );
  const { canGoBack, currentPath, goBack, goHome, openMenu } =
    usePhoneNavigation();

  return {
    canConfirm: Boolean(handlers.onConfirm),
    canGoBack: canGoBack || hasActiveTextEntry,
    canGoHome: currentPath !== '/',
    canMoveUp: Boolean(handlers.onUp),
    canMoveDown: Boolean(handlers.onDown),
    canMoveLeft: Boolean(handlers.onLeft),
    canMoveRight: Boolean(handlers.onRight),
    canUseNumericKeys: hasActiveTextEntry,
    confirm: triggerConfirm,
    goBack: () => {
      if (triggerTextEntryBack()) {
        return;
      }

      goBack();
    },
    goHome,
    moveUp: triggerUp,
    moveDown: triggerDown,
    moveLeft: triggerLeft,
    moveRight: triggerRight,
    openMenu,
    pressNumericKey: (key: PhoneNumericKey) => {
      triggerNumericKey(key);
    },
  };
};
