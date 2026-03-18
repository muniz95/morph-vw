import { usePhoneNavigation } from '@/app/hooks/use-phone-navigation';
import { useHardwareInputStore } from '@/app/state/hardware-input-store';

export const useBottomBarNavigation = () => {
  const handlers = useHardwareInputStore((state) => state.handlers);
  const triggerLeft = useHardwareInputStore((state) => state.triggerLeft);
  const triggerRight = useHardwareInputStore((state) => state.triggerRight);
  const triggerConfirm = useHardwareInputStore((state) => state.triggerConfirm);
  const { canGoBack, currentPath, goBack, goHome, openMenu } =
    usePhoneNavigation();

  return {
    canConfirm: Boolean(handlers.onConfirm),
    canGoBack,
    canGoHome: currentPath !== '/',
    canMoveLeft: Boolean(handlers.onLeft),
    canMoveRight: Boolean(handlers.onRight),
    confirm: triggerConfirm,
    goBack,
    goHome,
    moveLeft: triggerLeft,
    moveRight: triggerRight,
    openMenu,
  };
};
