import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyPwaUpdate,
  getPwaState,
  initPwa,
  installPwa,
  registerServiceWorkerForTests,
  resetPwaStateForTests,
  setWaitingServiceWorkerForTests,
} from '@/app/lib/pwa';

const createBeforeInstallPromptEvent = () => {
  const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
  const prompt = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(event, 'prompt', {
    value: prompt,
    configurable: true,
  });
  Object.defineProperty(event, 'userChoice', {
    value: Promise.resolve({
      outcome: 'accepted' as const,
      platform: 'web',
    }),
    configurable: true,
  });

  return {
    event,
    prompt,
  };
};

describe('pwa service', () => {
  beforeEach(() => {
    resetPwaStateForTests();
  });

  it('enables install when beforeinstallprompt is fired and prompts on install', async () => {
    initPwa();

    const { event, prompt } = createBeforeInstallPromptEvent();
    window.dispatchEvent(event);

    expect(getPwaState().canInstall).toBe(true);

    await installPwa();

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(getPwaState().canInstall).toBe(false);
  });

  it('tracks and applies waiting service worker updates', () => {
    const postMessage = vi.fn();

    setWaitingServiceWorkerForTests({ postMessage });
    expect(getPwaState().updateAvailable).toBe(true);
    expect(getPwaState().indicatorState).toBe('update-available');

    applyPwaUpdate();

    expect(postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(getPwaState().updateAvailable).toBe(false);
    expect(getPwaState().indicatorState).toBe('updating');
  });

  it('sets an error indicator when service worker registration fails', async () => {
    const register = vi.fn().mockRejectedValue(new Error('boom'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register,
        addEventListener: vi.fn(),
      },
    });

    await registerServiceWorkerForTests();

    expect(register).toHaveBeenCalledWith('/sw.js');
    expect(getPwaState().indicatorState).toBe('error');

    consoleError.mockRestore();
  });

  it('keeps all flags disabled when no install/update events are emitted', () => {
    initPwa();

    expect(getPwaState()).toEqual({
      canInstall: false,
      updateAvailable: false,
      offlineReady: false,
      indicatorState: 'idle',
    });
  });
});
