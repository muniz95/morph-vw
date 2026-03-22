import { beforeEach, describe, expect, it, vi } from 'vitest';
import BatteryStatus from '@/shared/ui/battery-status';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import type { BatteryStatusModel } from '@/shared/ui/battery-status/hooks/use-battery-status';

const statusMock = {
  batteryLevel: 42,
  isRecharging: false,
  getInterval: vi.fn(),
  getVisibility: vi.fn(),
} satisfies BatteryStatusModel;

vi.mock('@/shared/ui/blink', () => ({
  default: ({
    interval,
    children,
  }: {
    interval: number;
    children: ReactNode;
  }) => (
    <div data-testid="blink" data-interval={interval}>
      {children}
    </div>
  ),
}));

describe('BatteryStatus', () => {
  beforeEach(() => {
    statusMock.getInterval.mockImplementation(() => 0);
    statusMock.getVisibility.mockImplementation(() => true);
  });

  it('renders battery indicator container and label', () => {
    const { container } = render(<BatteryStatus status={statusMock} />);

    expect(container).toBeTruthy();
    expect(container.textContent).toContain('B');
  });

  it('renders five blink segments (one per battery level)', () => {
    const { getAllByTestId } = render(<BatteryStatus status={statusMock} />);

    expect(getAllByTestId('blink')).toHaveLength(5);
  });

  it('queries all indicator levels from the provided battery status model', () => {
    render(<BatteryStatus status={statusMock} />);

    expect(statusMock.getInterval).toHaveBeenCalledWith('full');
    expect(statusMock.getInterval).toHaveBeenCalledWith('halfFull');
    expect(statusMock.getInterval).toHaveBeenCalledWith('half');
    expect(statusMock.getInterval).toHaveBeenCalledWith('halfEmpty');
    expect(statusMock.getInterval).toHaveBeenCalledWith('empty');

    expect(statusMock.getVisibility).toHaveBeenCalledWith('full');
    expect(statusMock.getVisibility).toHaveBeenCalledWith('halfFull');
    expect(statusMock.getVisibility).toHaveBeenCalledWith('half');
    expect(statusMock.getVisibility).toHaveBeenCalledWith('halfEmpty');
    expect(statusMock.getVisibility).toHaveBeenCalledWith('empty');
  });

  it('passes interval values from hook to blink segments', () => {
    const intervalByLevel = {
      full: 1000,
      halfFull: 900,
      half: 800,
      halfEmpty: 700,
      empty: 600,
    } as const;

    statusMock.getInterval.mockImplementation(
      (level: keyof typeof intervalByLevel) => intervalByLevel[level]
    );

    const { getAllByTestId } = render(<BatteryStatus status={statusMock} />);

    const intervals = getAllByTestId('blink').map((node) =>
      Number(node.getAttribute('data-interval'))
    );

    expect(intervals).toEqual([1000, 900, 800, 700, 600]);
  });
});
