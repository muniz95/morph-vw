import { beforeEach, describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import '@/app/providers/i18n';
import {
  resetHardwareInputStore,
  useHardwareInputStore,
} from '@/app/state/hardware-input-store';
import {
  resetPhoneNavigationStore,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';
import { phoneBookModule } from '@/features/phone-book/module';
import PhoneBookPage from '@/features/phone-book/ui/pages/phone-book-page';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import { resetContactsStore } from '@/features/phone-book/state/contacts-store';

describe('phone-book module integration', () => {
  beforeEach(() => {
    resetUiStore();
    resetContactsStore();
    resetPhoneNavigationStore();
    resetHardwareInputStore();
  });

  it('exposes all expected routes', () => {
    const routePaths = phoneBookModule.routes
      .map((route) => route.path)
      .filter((path): path is string => Boolean(path));

    expect(routePaths).toEqual([
      '/phonebook/addname',
      '/phonebook/edit',
      '/phonebook/erase',
      '/phonebook/search',
      '/phonebook/servicenos',
      '/phonebook',
    ]);
  });

  it('pushes the selected phone-book route on hardware confirm', () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook'],
    });

    render(<PhoneBookPage />);

    act(() => {
      useHardwareInputStore.getState().triggerConfirm();
    });

    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/phonebook',
      '/phonebook/search',
    ]);
  });

  it('keeps second-level index when returning from a third-level page', () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook'],
    });

    render(<PhoneBookPage />);

    act(() => {
      useHardwareInputStore.getState().triggerRight();
      useHardwareInputStore.getState().triggerRight();
      useHardwareInputStore.getState().triggerConfirm();
    });

    act(() => {
      usePhoneNavigationStore.getState().goBack();
    });

    expect(useUiStore.getState().secondLevel).toBe(3);
    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/phonebook',
    ]);
  });
});
