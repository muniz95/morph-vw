import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '@/app/app';
import '@/app/providers/i18n';
import {
  resetHardwareInputStore,
  useHardwareInputStore,
} from '@/app/state/hardware-input-store';
import {
  resetPhoneNavigationStore,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';
import { resetUiStore } from '@/app/state/ui-store';
import {
  resetPhoneTextEntryStore,
  usePhoneTextEntryStore,
} from '@/app/state/phone-text-entry-store';
import {
  resetContactsStore,
  useContactsStore,
} from '@/features/phone-book/state/contacts-store';
import {
  resetSettingsStore,
  SETTINGS_STORAGE_KEY,
} from '@/features/settings/state/settings-store';
import { resetIndexedDbCache } from '@/shared/hooks/use-indexed-db';
import { useUiStore } from '@/app/state/ui-store';

const flushLazyRoute = async () => {
  await act(async () => {
    await vi.dynamicImportSettled();
    await Promise.resolve();
    await Promise.resolve();
  });
};

const renderPhoneApp = async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  act(() => {
    vi.advanceTimersByTime(3000);
  });

  await flushLazyRoute();
};

describe('phone-book text entry integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    const storage = globalThis.localStorage as Partial<Storage>;
    if (typeof storage?.removeItem === 'function') {
      storage.removeItem(SETTINGS_STORAGE_KEY);
      storage.removeItem('contacts');
    }

    resetIndexedDbCache();
    resetSettingsStore();
    resetUiStore();
    resetPhoneNavigationStore();
    resetHardwareInputStore();
    resetPhoneTextEntryStore();
    resetContactsStore();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('enters contact names through the on-screen numeric keypad and desktop digits', async () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook', '/phonebook/addname'],
    });

    await renderPhoneApp();

    const keyboard = screen.getByTestId('phone-shell-keyboard');
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.click(within(keyboard).getByRole('button', { name: '2' }));
    expect(input.value).toBe('A');

    fireEvent.keyDown(window, { key: '3' });
    expect(input.value).toBe('AD');
  });

  it('keeps numeric input active when clicking the keypad buttons', async () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook', '/phonebook/addname'],
    });

    await renderPhoneApp();

    const keyboard = screen.getByTestId('phone-shell-keyboard');
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const numericTwoButton = within(keyboard).getByRole('button', { name: '2' });

    expect(document.activeElement).toBe(input);

    fireEvent.mouseDown(numericTwoButton);
    fireEvent.click(numericTwoButton);

    expect(input.value).toBe('A');
    expect(document.activeElement).toBe(input);
    expect(usePhoneTextEntryStore.getState().activeTextEntry).not.toBeNull();
  });

  it('filters search results through multi-tap numeric input', async () => {
    useContactsStore.setState({
      hydrated: true,
      contacts: [
        { id: '1', name: 'ALICE', number: '111', isServiceNumber: false },
        { id: '2', name: 'BOB', number: '222', isServiceNumber: false },
      ],
    });
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook', '/phonebook/search'],
    });

    await renderPhoneApp();

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByText('ALICE')).toBeTruthy();
    expect(screen.queryByText('BOB')).toBeNull();
  });

  it('uses Back to delete text before falling back to navigation', async () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook', '/phonebook/addname'],
    });

    await renderPhoneApp();

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const backButton = screen.getByRole('button', { name: 'Upper Right' });

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(input.value).toBe('A');

    fireEvent.click(backButton);
    expect(input.value).toBe('');
    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/phonebook',
      '/phonebook/addname',
    ]);

    fireEvent.click(backButton);
    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/phonebook',
    ]);
  });

  it('moves focus from the text input to Save and confirms the action', async () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/phonebook', '/phonebook/addname'],
    });

    await renderPhoneApp();

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('2');
    });

    const saveButton = screen.getByText('save');

    act(() => {
      useHardwareInputStore.getState().triggerDown();
    });

    expect(document.activeElement).toBe(saveButton);
    expect(usePhoneTextEntryStore.getState().activeTextEntry).toBeNull();

    act(() => {
      useHardwareInputStore.getState().triggerConfirm();
    });

    expect(useUiStore.getState().showModal).toBe(true);
  });
});
