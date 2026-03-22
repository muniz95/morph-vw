import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import PwaUpdateButton from '@/shared/ui/pwa-update-button';

const hookMock = vi.hoisted(() => ({
  canInstall: false,
  updateAvailable: false,
  offlineReady: false,
  indicatorState: 'idle' as const,
  install: vi.fn().mockResolvedValue(undefined),
  applyUpdate: vi.fn(),
}));

vi.mock('@/app/hooks/use-pwa', () => ({
  usePwa: () => ({
    canInstall: hookMock.canInstall,
    updateAvailable: hookMock.updateAvailable,
    offlineReady: hookMock.offlineReady,
    indicatorState: hookMock.indicatorState,
    install: hookMock.install,
    applyUpdate: hookMock.applyUpdate,
  }),
}));

describe('PwaUpdateButton', () => {
  beforeEach(() => {
    hookMock.updateAvailable = false;
    hookMock.applyUpdate.mockClear();
  });

  it('renders disabled when no update is available', () => {
    const { getByRole } = render(<PwaUpdateButton />);
    const button = getByRole('button', {
      name: /update app/i,
    }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('enables the action and applies the update when clicked', () => {
    hookMock.updateAvailable = true;
    const { getByRole } = render(<PwaUpdateButton />);
    const button = getByRole('button', {
      name: /update app/i,
    }) as HTMLButtonElement;

    fireEvent.click(button);

    expect(button.disabled).toBe(false);
    expect(hookMock.applyUpdate).toHaveBeenCalledTimes(1);
  });
});
