import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { useHardwareInputRegistration } from '@/app/hooks/use-hardware-input-registration';

interface FocusNavigationItem {
  ref: RefObject<HTMLElement | null>;
  onConfirm?: () => void;
  isEnabled?: boolean;
}

interface UseVerticalHardwareFocusNavigationInput {
  items: FocusNavigationItem[];
  initialIndex?: number;
}

const clampEnabledIndex = (
  items: FocusNavigationItem[],
  candidateIndex: number
) => {
  if (items.length === 0) return -1;

  if (items[candidateIndex]?.isEnabled !== false) {
    return candidateIndex;
  }

  const nextEnabledIndex = items.findIndex((item) => item.isEnabled !== false);
  return nextEnabledIndex;
};

const findNextEnabledIndex = (
  items: FocusNavigationItem[],
  currentIndex: number,
  direction: -1 | 1
) => {
  let nextIndex = currentIndex + direction;

  while (nextIndex >= 0 && nextIndex < items.length) {
    if (items[nextIndex]?.isEnabled !== false) {
      return nextIndex;
    }

    nextIndex += direction;
  }

  return currentIndex;
};

export const useVerticalHardwareFocusNavigation = ({
  items,
  initialIndex = 0,
}: UseVerticalHardwareFocusNavigationInput) => {
  const normalizedItems = useMemo(() => items, [items]);
  const [selectedIndex, setSelectedIndex] = useState(() =>
    clampEnabledIndex(normalizedItems, initialIndex)
  );

  useEffect(() => {
    setSelectedIndex((currentIndex) => {
      const fallbackIndex = clampEnabledIndex(normalizedItems, initialIndex);

      if (currentIndex < 0 || currentIndex >= normalizedItems.length) {
        return fallbackIndex;
      }

      if (normalizedItems[currentIndex]?.isEnabled !== false) {
        return currentIndex;
      }

      return fallbackIndex;
    });
  }, [initialIndex, normalizedItems]);

  useEffect(() => {
    if (selectedIndex < 0) return;

    normalizedItems[selectedIndex]?.ref.current?.focus();
  }, [normalizedItems, selectedIndex]);

  const moveUp = useCallback(() => {
    if (selectedIndex < 0) return;

    setSelectedIndex((currentIndex) =>
      findNextEnabledIndex(normalizedItems, currentIndex, -1)
    );
  }, [normalizedItems, selectedIndex]);

  const moveDown = useCallback(() => {
    if (selectedIndex < 0) return;

    setSelectedIndex((currentIndex) =>
      findNextEnabledIndex(normalizedItems, currentIndex, 1)
    );
  }, [normalizedItems, selectedIndex]);

  const confirm = useCallback(() => {
    if (selectedIndex < 0) return;

    const item = normalizedItems[selectedIndex];
    if (!item || item.isEnabled === false) return;

    item.onConfirm?.();
  }, [normalizedItems, selectedIndex]);

  useHardwareInputRegistration({
    onUp: normalizedItems.length > 1 ? moveUp : undefined,
    onDown: normalizedItems.length > 1 ? moveDown : undefined,
    onConfirm: confirm,
  });

  return {
    selectedIndex,
    setSelectedIndex,
  };
};
