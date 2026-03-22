import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import PwaLedIndicator, {
  resolveLedIndicatorState,
} from '@/shared/ui/pwa-led-indicator';

describe('PwaLedIndicator', () => {
  it('does not render in the idle state', () => {
    const { queryByRole } = render(<PwaLedIndicator state="idle" />);

    expect(queryByRole('status')).toBeNull();
  });

  it('renders blue update-available status', () => {
    const { getByRole } = render(<PwaLedIndicator state="update-available" />);
    const indicator = getByRole('status', { name: /update available/i });

    expect(indicator.getAttribute('data-state')).toBe('update-available');
  });

  it('renders flashing yellow updating status', () => {
    const { getByRole } = render(<PwaLedIndicator state="updating" />);
    const indicator = getByRole('status', { name: /updating app/i });

    expect(indicator.getAttribute('data-state')).toBe('updating');
  });

  it('renders red error status', () => {
    const { getByRole } = render(<PwaLedIndicator state="error" />);
    const indicator = getByRole('status', { name: /pwa update error/i });

    expect(indicator.getAttribute('data-state')).toBe('error');
  });

  it('renders white status while charging', () => {
    const { getByRole } = render(<PwaLedIndicator state="charging" />);
    const indicator = getByRole('status', { name: /battery charging/i });

    expect(indicator.getAttribute('data-state')).toBe('charging');
  });

  it('renders red status for low battery', () => {
    const { getByRole } = render(<PwaLedIndicator state="battery-low" />);
    const indicator = getByRole('status', { name: /battery low/i });

    expect(indicator.getAttribute('data-state')).toBe('battery-low');
  });
});

describe('resolveLedIndicatorState', () => {
  it('prioritizes pwa states over battery states', () => {
    expect(
      resolveLedIndicatorState({
        pwaIndicatorState: 'update-available',
        isRecharging: true,
        batteryLevel: 10,
      })
    ).toBe('update-available');
  });

  it('shows white while charging', () => {
    expect(
      resolveLedIndicatorState({
        pwaIndicatorState: 'idle',
        isRecharging: true,
        batteryLevel: 10,
      })
    ).toBe('charging');
  });

  it('shows red when battery is at or below twenty percent', () => {
    expect(
      resolveLedIndicatorState({
        pwaIndicatorState: 'idle',
        isRecharging: false,
        batteryLevel: 20,
      })
    ).toBe('battery-low');
  });
});
