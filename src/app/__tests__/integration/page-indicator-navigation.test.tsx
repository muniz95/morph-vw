import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

const labels = {
  phoneBook: /Phone Book|Agenda|phonebookTitle/i,
  messages: /Messages|Mensagens|messagesTitle/i,
  chat: /Chat|Conversas|chatTitle/i,
  callRegister: /Call Register|Registro de chamadas|callregisterTitle/i,
  tones: /Tones|Toques|tonesTitle/i,
  settings: /Settings|Configurações|settingsTitle/i,
  callSettings: /Call Settings|Configurações de Chamada|callTitle/i,
  generalSettings: /General Settings|Configurações Gerais|general\.title/i,
  colorSettings: /Color Settings|Configurações de Cor|general\.color\.title/i,
  languageSettings:
    /Language Settings|Configurações de Idioma|general\.languageTitle/i,
};

const getIndicator = () => screen.getByRole('heading', { level: 6 });

const expectIndicator = (value: string) => {
  expect(getIndicator().textContent).toBe(value);
};

const expectNoFifthSegment = () => {
  const indicator = getIndicator().textContent ?? '';
  expect(indicator.split('-').length).toBeLessThanOrEqual(4);
  expect(useUiStore.getState().fifthLevel).toBe(0);
};

const pressMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
};

const pressLeft = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Left' }));
};

const pressRight = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Right' }));
};

const pressOk = () => {
  fireEvent.click(screen.getByRole('button', { name: 'OK' }));
};

const pressBack = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Upper Right' }));
};

const pressHome = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Lower Right' }));
};

const advancePastStartup = () => {
  act(() => {
    vi.advanceTimersByTime(3000);
  });
};

const flushLazyRoute = async () => {
  await act(async () => {
    await vi.dynamicImportSettled();
    await Promise.resolve();
    await Promise.resolve();
  });
};

const renderApp = async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  advancePastStartup();
  await flushLazyRoute();
  expect(screen.getByText(/Press Menu/i)).toBeTruthy();
  expectIndicator('');
};

const openMainMenu = async () => {
  pressMenu();
  await flushLazyRoute();
  expect(screen.getByText(labels.phoneBook)).toBeTruthy();
  expectIndicator('1');
};

const navigateHomeToSettings = () => {
  pressRight();
  expect(screen.getByText(labels.messages)).toBeTruthy();
  pressRight();
  expect(screen.getByText(labels.chat)).toBeTruthy();
  pressRight();
  expect(screen.getByText(labels.callRegister)).toBeTruthy();
  pressRight();
  expect(screen.getByText(labels.tones)).toBeTruthy();
  pressRight();
  expect(screen.getByText(labels.settings)).toBeTruthy();
  expectIndicator('6');
  expectNoFifthSegment();
};

const openSettingsPage = async () => {
  pressOk();
  await flushLazyRoute();
  expect(screen.getByText(labels.callSettings)).toBeTruthy();
  expectIndicator('6-1');
  expectNoFifthSegment();
};

const openGeneralSettingsPage = async () => {
  pressRight();
  expect(screen.getByText(labels.generalSettings)).toBeTruthy();
  expectIndicator('6-2');
  pressOk();
  await flushLazyRoute();
  expect(screen.getByText(labels.colorSettings)).toBeTruthy();
  expectIndicator('6-2-1');
  expectNoFifthSegment();
};

const navigateToLanguagePage = async () => {
  await openMainMenu();
  navigateHomeToSettings();
  await openSettingsPage();
  await openGeneralSettingsPage();
  pressRight();
  expect(screen.getByText(labels.languageSettings)).toBeTruthy();
  expectIndicator('6-2-2');
  pressOk();
  await flushLazyRoute();
  expectIndicator('6-2-2-2');
};

describe('page indicator navigation integration', () => {
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

  it('requires Menu to enter the main menu from standby', async () => {
    await renderApp();
    await openMainMenu();
    expectNoFifthSegment();
  });

  it('composes indicator while drilling down from level 1 to level 4', async () => {
    await renderApp();
    await navigateToLanguagePage();
    expectNoFifthSegment();
  });

  it('moves backward through the app-owned stack with the back key', async () => {
    await renderApp();
    await navigateToLanguagePage();

    pressBack();
    expect(screen.getByText(labels.languageSettings)).toBeTruthy();
    expectIndicator('6-2-2');

    pressBack();
    expect(screen.getByText(labels.generalSettings)).toBeTruthy();
    expectIndicator('6-2');

    pressBack();
    expect(screen.getByText(labels.settings)).toBeTruthy();
    expectIndicator('6');
    expectNoFifthSegment();
  });

  it('returns to standby with the home key', async () => {
    await renderApp();
    await navigateToLanguagePage();

    pressHome();
    await flushLazyRoute();

    expect(screen.getByText(/Press Menu/i)).toBeTruthy();
    expectIndicator('');
    expect(useUiStore.getState().firstLevel).toBe(1);
    expect(useUiStore.getState().secondLevel).toBe(0);
    expect(useUiStore.getState().thirdLevel).toBe(0);
    expect(useUiStore.getState().fourthLevel).toBe(0);
    expect(useUiStore.getState().fifthLevel).toBe(0);
  });

  it('resets to the main menu with the Menu key from deeper screens', async () => {
    await renderApp();
    await navigateToLanguagePage();

    pressMenu();
    await flushLazyRoute();

    expect(screen.getByText(labels.settings)).toBeTruthy();
    expectIndicator('6');
    expectNoFifthSegment();
  });

  it('moves left and right through circular menu items', async () => {
    await renderApp();
    await openMainMenu();

    pressRight();
    expect(screen.getByText(labels.messages)).toBeTruthy();
    expectIndicator('2');

    pressLeft();
    expect(screen.getByText(labels.phoneBook)).toBeTruthy();
    expectIndicator('1');
  });
});
