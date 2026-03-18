import { ReactElement } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resetPhoneNavigationStore,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import { resetSettingsStore } from '@/features/settings/state/settings-store';
import { useApp } from '@/app/hooks/use-app';

const mocks = vi.hoisted(() => ({
  routing: null as ReactElement | null,
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useRoutes: () => mocks.routing,
  };
});

describe('useApp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetUiStore();
    resetSettingsStore();
    resetPhoneNavigationStore();
    mocks.routing = null;
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('shows levels only up to current logical navigation depth', () => {
    useUiStore.setState({
      firstLevel: 6,
      secondLevel: 2,
      thirdLevel: 2,
      fourthLevel: 2,
      fifthLevel: 2,
    });

    usePhoneNavigationStore.setState({
      stack: [
        '/',
        '/menu',
        '/settings',
        '/settings/general',
        '/settings/general/language',
      ],
    });

    const { result } = renderHook(() => useApp());

    expect(result.current.indicatorLevels).toEqual({
      firstLevel: 6,
      secondLevel: 2,
      thirdLevel: 2,
      fourthLevel: 2,
      fifthLevel: 0,
    });
  });

  it('hides third and deeper levels when logical depth is second level', () => {
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

    const { result } = renderHook(() => useApp());

    expect(result.current.indicatorLevels).toEqual({
      firstLevel: 6,
      secondLevel: 2,
      thirdLevel: 0,
      fourthLevel: 0,
      fifthLevel: 0,
    });
  });

  it('disables startup screen after timeout', () => {
    const { result } = renderHook(() => useApp());

    expect(result.current.firstRender).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.firstRender).toBe(false);
  });

  it('closes modal and navigates home on modal auto close', () => {
    useUiStore.getState().openModal();
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/settings'],
    });

    const { result } = renderHook(() => useApp());

    act(() => {
      result.current.handleModalAutoClose();
    });

    expect(usePhoneNavigationStore.getState().stack).toEqual(['/']);
    expect(useUiStore.getState().showModal).toBe(false);
    expect(useUiStore.getState().firstLevel).toBe(1);
  });
});
