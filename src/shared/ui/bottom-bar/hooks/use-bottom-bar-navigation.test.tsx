import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resetHardwareInputStore,
  useHardwareInputStore,
} from '@/app/state/hardware-input-store';
import {
  resetPhoneNavigationStore,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import { useBottomBarNavigation } from '@/shared/ui/bottom-bar/hooks/use-bottom-bar-navigation';

describe('useBottomBarNavigation', () => {
  beforeEach(() => {
    resetUiStore();
    resetPhoneNavigationStore();
    resetHardwareInputStore();
  });

  it('resets indicator levels and returns to standby when goHome is called', () => {
    useUiStore.setState({
      firstLevel: 6,
      secondLevel: 2,
      thirdLevel: 2,
      fourthLevel: 2,
      fifthLevel: 2,
    });
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/settings'],
    });

    const { result } = renderHook(() => useBottomBarNavigation());

    act(() => {
      result.current.goHome();
    });

    expect(usePhoneNavigationStore.getState().stack).toEqual(['/']);
    expect(useUiStore.getState().firstLevel).toBe(1);
    expect(useUiStore.getState().secondLevel).toBe(0);
    expect(useUiStore.getState().thirdLevel).toBe(0);
    expect(useUiStore.getState().fourthLevel).toBe(0);
    expect(useUiStore.getState().fifthLevel).toBe(0);
  });

  it('routes nav key actions through registered hardware handlers', () => {
    const onUp = vi.fn();
    const onDown = vi.fn();
    const onLeft = vi.fn();
    const onRight = vi.fn();
    const onConfirm = vi.fn();

    useHardwareInputStore.getState().setHandlers({
      onUp,
      onDown,
      onLeft,
      onRight,
      onConfirm,
    });

    const { result } = renderHook(() => useBottomBarNavigation());

    act(() => {
      result.current.moveUp();
      result.current.moveDown();
      result.current.moveLeft();
      result.current.moveRight();
      result.current.confirm();
    });

    expect(onUp).toHaveBeenCalledTimes(1);
    expect(onDown).toHaveBeenCalledTimes(1);
    expect(onLeft).toHaveBeenCalledTimes(1);
    expect(onRight).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
