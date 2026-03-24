import { useEffect } from 'react';
import { PhoneNumericKey } from '@/shared/lib/phone-text-entry';
import { usePhoneTextEntryStore } from '@/app/state/phone-text-entry-store';

const NUMERIC_KEYS = new Set<PhoneNumericKey>([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '*',
  '#',
]);

export const usePhoneKeyboardInput = () => {
  const hasActiveTextEntry = usePhoneTextEntryStore(
    (state) => state.activeTextEntry !== null
  );
  const triggerNumericKey = usePhoneTextEntryStore(
    (state) => state.triggerNumericKey
  );
  const triggerBack = usePhoneTextEntryStore((state) => state.triggerBack);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (NUMERIC_KEYS.has(event.key as PhoneNumericKey) && hasActiveTextEntry) {
        triggerNumericKey(event.key as PhoneNumericKey);
        event.preventDefault();
        return;
      }

      if (event.key === 'Backspace' && hasActiveTextEntry) {
        if (triggerBack()) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasActiveTextEntry, triggerBack, triggerNumericKey]);
};
