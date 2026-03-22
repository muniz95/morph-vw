import type { PwaIndicatorState } from '@/app/lib/pwa';
import S from './styled';

export type LedIndicatorState =
  | PwaIndicatorState
  | 'charging'
  | 'battery-low';

type ResolveLedIndicatorStateArgs = {
  pwaIndicatorState: PwaIndicatorState;
  isRecharging: boolean;
  batteryLevel: number;
};

const labels = {
  'update-available': 'Update available',
  updating: 'Updating app',
  error: 'PWA update error',
  charging: 'Battery charging',
  'battery-low': 'Battery low',
} as const;

export const resolveLedIndicatorState = ({
  pwaIndicatorState,
  isRecharging,
  batteryLevel,
}: ResolveLedIndicatorStateArgs): LedIndicatorState => {
  if (pwaIndicatorState !== 'idle') {
    return pwaIndicatorState;
  }

  if (isRecharging) {
    return 'charging';
  }

  if (batteryLevel <= 20) {
    return 'battery-low';
  }

  return 'idle';
};

type PwaLedIndicatorProps = {
  state: LedIndicatorState;
};

const PwaLedIndicator = ({ state }: PwaLedIndicatorProps) => {
  if (state === 'idle') {
    return null;
  }

  return (
    <S.Container
      aria-label={labels[state]}
      aria-live="polite"
      data-state={state}
      role="status"
      $state={state}
    />
  );
};

export default PwaLedIndicator;
