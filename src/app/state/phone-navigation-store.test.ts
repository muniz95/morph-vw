import { beforeEach, describe, expect, it } from 'vitest';
import {
  getCurrentPath,
  getLogicalDepth,
  MAIN_MENU_PATH,
  resetPhoneNavigationStore,
  STANDBY_PATH,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';

describe('phone navigation store', () => {
  beforeEach(() => {
    resetPhoneNavigationStore();
  });

  it('tracks push, replace, back, home, and menu navigation', () => {
    usePhoneNavigationStore.getState().openMenu();
    expect(usePhoneNavigationStore.getState().stack).toEqual([
      STANDBY_PATH,
      MAIN_MENU_PATH,
    ]);

    usePhoneNavigationStore.getState().push('/settings');
    usePhoneNavigationStore.getState().push('/settings/general');
    expect(usePhoneNavigationStore.getState().stack).toEqual([
      STANDBY_PATH,
      MAIN_MENU_PATH,
      '/settings',
      '/settings/general',
    ]);

    usePhoneNavigationStore.getState().replace('/settings/general/language');
    expect(getCurrentPath(usePhoneNavigationStore.getState().stack)).toBe(
      '/settings/general/language'
    );

    usePhoneNavigationStore.getState().goBack();
    expect(getCurrentPath(usePhoneNavigationStore.getState().stack)).toBe(
      '/settings'
    );

    usePhoneNavigationStore.getState().goHome();
    expect(usePhoneNavigationStore.getState().stack).toEqual([STANDBY_PATH]);
  });

  it('computes logical depth from standby-aware stack length', () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/settings', '/settings/general'],
    });

    expect(getLogicalDepth(usePhoneNavigationStore.getState().stack)).toBe(3);
  });

  it('keeps standby as the minimum stack entry when going back', () => {
    usePhoneNavigationStore.getState().goBack();

    expect(usePhoneNavigationStore.getState().stack).toEqual([STANDBY_PATH]);
  });
});
