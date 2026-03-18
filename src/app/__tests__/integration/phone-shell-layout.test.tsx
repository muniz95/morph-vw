import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '@/app/app';
import '@/app/providers/i18n';
import { resetHardwareInputStore } from '@/app/state/hardware-input-store';
import { resetPhoneNavigationStore } from '@/app/state/phone-navigation-store';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import {
  resetSettingsStore,
  SETTINGS_STORAGE_KEY,
} from '@/features/settings/state/settings-store';

const flushLazyRoute = async () => {
  await act(async () => {
    await vi.dynamicImportSettled();
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('phone shell layout integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    const storage = globalThis.localStorage as Partial<Storage>;
    if (typeof storage?.removeItem === 'function') {
      storage.removeItem(SETTINGS_STORAGE_KEY);
    }

    resetSettingsStore();
    resetUiStore();
    resetPhoneNavigationStore();
    resetHardwareInputStore();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders the phone shell rows and keeps routed content inside the screen', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await flushLazyRoute();

    const screenSurface = screen.getByTestId('phone-screen-surface');

    expect(screen.getByTestId('phone-shell-upper')).toBeTruthy();
    expect(screen.getByTestId('phone-shell-screen')).toBeTruthy();
    expect(screen.getByTestId('phone-shell-keyboard')).toBeTruthy();
    expect(screenSurface.contains(screen.getByText(/Press Menu/i))).toBe(true);
    expect(screen.getByRole('button', { name: 'Upper Right' }).textContent).toBe(
      'Back'
    );
    expect(screen.getByRole('button', { name: 'Lower Right' }).textContent).toBe(
      'Home'
    );
    expect(screen.getByRole('button', { name: 'Menu' })).toBeTruthy();
  });

  it('keeps startup and modal overlays inside the screen surface', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const screenSurface = screen.getByTestId('phone-screen-surface');

    expect(screenSurface.contains(screen.getByTestId('startup-overlay'))).toBe(
      true
    );
    expect(screen.getByTestId('phone-shell-upper')).toBeTruthy();
    expect(screen.getByTestId('phone-shell-keyboard')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await flushLazyRoute();

    act(() => {
      useUiStore.getState().openModal();
    });

    expect(screenSurface.contains(screen.getByTestId('modal-overlay'))).toBe(
      true
    );
    expect(screen.getByText('Done!')).toBeTruthy();
  });
});
