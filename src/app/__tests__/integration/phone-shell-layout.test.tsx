import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '@/app/app';
import '@/app/providers/i18n';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import {
  resetSettingsStore,
  SETTINGS_STORAGE_KEY,
} from '@/features/settings/state/settings-store';

const labels = {
  phoneBook: /Phone Book|Agenda|phonebookTitle/i,
};

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
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders the phone shell rows and keeps routed content inside the screen', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await flushLazyRoute();

    const screenSurface = screen.getByTestId('phone-screen-surface');
    const phoneBook = screen.getByText(labels.phoneBook);

    expect(screen.getByTestId('phone-shell-upper')).toBeTruthy();
    expect(screen.getByTestId('phone-shell-screen')).toBeTruthy();
    expect(screen.getByTestId('phone-shell-keyboard')).toBeTruthy();
    expect(screenSurface.contains(phoneBook)).toBe(true);
    expect(screen.getByRole('button', { name: 'Upper Right' }).textContent).toBe(
      '<'
    );
    expect(screen.getByRole('button', { name: 'Lower Right' }).textContent).toBe(
      'O'
    );
  });

  it('keeps startup and modal overlays inside the screen surface', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
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
