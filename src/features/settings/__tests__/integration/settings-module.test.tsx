import { beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@/app/providers/i18n';
import {
  resetHardwareInputStore,
  useHardwareInputStore,
} from '@/app/state/hardware-input-store';
import {
  resetPhoneNavigationStore,
  usePhoneNavigationStore,
} from '@/app/state/phone-navigation-store';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import { settingsModule } from '@/features/settings/module';
import SettingsPage from '@/features/settings/ui/pages/settings-page';
import GeneralSettingsPage from '@/features/settings/ui/pages/general-settings-page';
import ColorSettingsPage from '@/features/settings/ui/pages/color-settings-page';
import LanguageSettingsPage from '@/features/settings/ui/pages/language-settings-page';
import LightSettingsPage from '@/features/settings/ui/pages/light-settings-page';
import SoundSettingsPage from '@/features/settings/ui/pages/sound-settings-page';
import RestoreFactorySettingsPage from '@/features/settings/ui/pages/restore-factory-settings-page';
import {
  resetSettingsStore,
  SETTINGS_STORAGE_KEY,
  useSettingsStore,
} from '@/features/settings/state/settings-store';
import { DEFAULT_SETTINGS } from '@/features/settings/domain/constants';

describe('settings module integration', () => {
  beforeEach(() => {
    const storage = globalThis.localStorage as Partial<Storage>;
    if (typeof storage?.removeItem === 'function') {
      storage.removeItem(SETTINGS_STORAGE_KEY);
    }
    resetSettingsStore();
    resetUiStore();
    resetPhoneNavigationStore();
    resetHardwareInputStore();
  });

  it('exposes all expected routes', () => {
    const routePaths = settingsModule.routes
      .map((route) => route.path)
      .filter((path): path is string => Boolean(path));

    expect(routePaths).toEqual([
      '/settings',
      '/settings/general',
      '/settings/general/color',
      '/settings/general/language',
      '/settings/general/light',
      '/settings/general/sound',
      '/settings/restore',
    ]);
  });

  it('pushes the selected settings route on hardware confirm', () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/settings'],
    });

    render(<SettingsPage />);

    act(() => {
      useHardwareInputStore.getState().triggerConfirm();
    });

    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/settings',
      '/settings/call',
    ]);
  });

  it('pushes the selected general settings route on hardware confirm', () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/settings', '/settings/general'],
    });

    render(<GeneralSettingsPage />);

    act(() => {
      useHardwareInputStore.getState().triggerConfirm();
    });

    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/settings',
      '/settings/general',
      '/settings/general/color',
    ]);
  });

  it('keeps third-level index when returning from a fourth-level page', () => {
    usePhoneNavigationStore.setState({
      stack: ['/', '/menu', '/settings', '/settings/general'],
    });

    render(<GeneralSettingsPage />);

    act(() => {
      useHardwareInputStore.getState().triggerRight();
      useHardwareInputStore.getState().triggerRight();
      useHardwareInputStore.getState().triggerConfirm();
    });

    act(() => {
      usePhoneNavigationStore.getState().goBack();
    });

    expect(useUiStore.getState().thirdLevel).toBe(3);
    expect(usePhoneNavigationStore.getState().stack).toEqual([
      '/',
      '/menu',
      '/settings',
      '/settings/general',
    ]);
  });

  it('updates light settings sliders and persists values on save', () => {
    const { getAllByRole, getByLabelText, getByRole, getByTestId, getByText } =
      render(
        <MemoryRouter initialEntries={['/settings/general/light']}>
          <LightSettingsPage />
        </MemoryRouter>
      );

    const sliders = getAllByRole('slider') as HTMLInputElement[];
    expect(sliders).toHaveLength(2);
    expect(sliders[0].min).toBe('20');
    expect(sliders[0].max).toBe('100');
    expect(sliders[0].step).toBe('10');
    expect(sliders[1].min).toBe('30');
    expect(sliders[1].max).toBe('300');
    expect(sliders[1].step).toBe('30');

    const controls = getByTestId('light-controls');
    expect(window.getComputedStyle(controls).gap).toBe('16px');
    expect(getByText('80%')).toBeTruthy();
    expect(getByText('1m')).toBeTruthy();

    fireEvent.change(
      getByLabelText(
        /Backlight level|general\.light\.backlightLevel|Nível de luz de fundo/i
      ),
      {
        target: { value: '30', valueAsNumber: 30 },
      }
    );
    fireEvent.change(
      getByLabelText(
        /Inactive after|general\.light\.inactiveAfter|Inativo após/i
      ),
      {
        target: { value: '120', valueAsNumber: 120 },
      }
    );

    expect(getByText('30%')).toBeTruthy();
    expect(getByText('2m')).toBeTruthy();

    fireEvent.click(getByRole('button', { name: /Save|Salvar|save/i }));

    expect(useSettingsStore.getState().backlightLevel).toBe(30);
    expect(useSettingsStore.getState().inactivityTime).toBe(120);
  });

  it('saves updated values through store-backed pages', () => {
    const { getAllByText, getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={['/settings/restore']}>
        <ColorSettingsPage />
        <LanguageSettingsPage />
        <LightSettingsPage />
        <SoundSettingsPage />
        <RestoreFactorySettingsPage />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Blue|general\.color\.blue/i));
    fireEvent.click(getAllByText(/Save|save|Salvar/i)[0]);
    expect(useSettingsStore.getState().color).toBe('#0d48eb');

    fireEvent.click(getByText('Português'));
    fireEvent.click(getAllByText(/Save|save|Salvar/i)[1]);
    expect(useSettingsStore.getState().language).toBe('pt');

    fireEvent.change(
      getByLabelText(
        /Backlight level|general\.light\.backlightLevel|Nível de luz de fundo/i
      ),
      {
        target: { value: '20', valueAsNumber: 20 },
      }
    );
    fireEvent.change(
      getByLabelText(
        /Inactive after|general\.light\.inactiveAfter|Inativo após/i
      ),
      {
        target: { value: '300', valueAsNumber: 300 },
      }
    );
    fireEvent.click(getAllByText(/Save|save|Salvar/i)[2]);
    expect(useSettingsStore.getState().backlightLevel).toBe(20);
    expect(useSettingsStore.getState().inactivityTime).toBe(300);

    fireEvent.change(
      getByLabelText(/Notification|general\.sound\.notification|Notificação/i),
      {
        target: { value: '30', valueAsNumber: 30 },
      }
    );
    fireEvent.change(getByLabelText(/Alarm|general\.sound\.alarm|Alarme/i), {
      target: { value: '40', valueAsNumber: 40 },
    });
    fireEvent.change(getByLabelText(/Ring|general\.sound\.ring|Toque/i), {
      target: { value: '50', valueAsNumber: 50 },
    });
    fireEvent.click(getAllByText(/Save|save|Salvar/i)[3]);
    expect(useSettingsStore.getState().notificationLevel).toBe(30);
    expect(useSettingsStore.getState().alarmLevel).toBe(40);
    expect(useSettingsStore.getState().ringLevel).toBe(50);

    fireEvent.click(getByText(/Yes|yes|Sim/i));

    const settings = useSettingsStore.getState();
    expect(settings.color).toBe(DEFAULT_SETTINGS.color);
    expect(settings.language).toBe(DEFAULT_SETTINGS.language);
    expect(settings.notificationLevel).toBe(DEFAULT_SETTINGS.notificationLevel);
    expect(settings.alarmLevel).toBe(DEFAULT_SETTINGS.alarmLevel);
    expect(settings.ringLevel).toBe(DEFAULT_SETTINGS.ringLevel);
    expect(settings.backlightLevel).toBe(DEFAULT_SETTINGS.backlightLevel);
    expect(settings.inactivityTime).toBe(DEFAULT_SETTINGS.inactivityTime);
  });
});
