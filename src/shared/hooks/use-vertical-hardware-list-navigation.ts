import { useCallback, useEffect, useState } from 'react';
import { useHardwareInputRegistration } from '@/app/hooks/use-hardware-input-registration';

interface UseVerticalHardwareListNavigationInput<T> {
  items: readonly T[];
  initialIndex?: number;
  isEnabled?: boolean;
  onConfirm?: (item: T, index: number) => void;
  onSelect?: (item: T, index: number) => void;
}

const clampIndex = (index: number, length: number) => {
  if (length <= 0) return -1;
  if (index < 0) return 0;
  if (index > length - 1) return length - 1;
  return index;
};

export const useVerticalHardwareListNavigation = <T>({
  items,
  initialIndex = 0,
  isEnabled = true,
  onConfirm,
  onSelect,
}: UseVerticalHardwareListNavigationInput<T>) => {
  const [selectedIndex, setSelectedIndex] = useState(() =>
    clampIndex(initialIndex, items.length)
  );

  useEffect(() => {
    setSelectedIndex(clampIndex(initialIndex, items.length));
  }, [initialIndex, items.length]);

  const selectedItem =
    selectedIndex >= 0 && selectedIndex < items.length
      ? items[selectedIndex]
      : null;

  useEffect(() => {
    if (!selectedItem) return;
    onSelect?.(selectedItem, selectedIndex);
  }, [onSelect, selectedIndex, selectedItem]);

  const moveUp = useCallback(() => {
    if (!isEnabled || items.length === 0) return;
    setSelectedIndex((current) => clampIndex(current - 1, items.length));
  }, [isEnabled, items.length]);

  const moveDown = useCallback(() => {
    if (!isEnabled || items.length === 0) return;
    setSelectedIndex((current) => clampIndex(current + 1, items.length));
  }, [isEnabled, items.length]);

  const confirm = useCallback(() => {
    if (!isEnabled || !selectedItem) return;
    onConfirm?.(selectedItem, selectedIndex);
  }, [isEnabled, onConfirm, selectedIndex, selectedItem]);

  useHardwareInputRegistration({
    onUp: isEnabled && items.length > 0 ? moveUp : undefined,
    onDown: isEnabled && items.length > 0 ? moveDown : undefined,
    onConfirm: isEnabled && items.length > 0 && onConfirm ? confirm : undefined,
  });

  return {
    selectedIndex,
    selectedItem,
    setSelectedIndex,
  };
};
