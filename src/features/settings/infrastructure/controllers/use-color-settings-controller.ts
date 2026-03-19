import { useCallback, useEffect, useMemo, useState } from 'react';
import { COLOR_OPTIONS } from '@/features/settings/domain/constants';
import { useSettingsStore } from '@/features/settings/state/settings-store';
import { useUiStore } from '@/app/state/ui-store';
import vibration from '@/shared/lib/vibration';
import { useVerticalHardwareListNavigation } from '@/shared/hooks/use-vertical-hardware-list-navigation';

export const useColorSettingsController = () => {
  const currentColor = useSettingsStore((state) => state.color);
  const [color, setColor] = useState(currentColor);
  const saveColor = useSettingsStore((state) => state.setColor);
  const setFourthLevel = useUiStore((state) => state.setFourthLevel);
  const openModal = useUiStore((state) => state.openModal);

  useEffect(() => {
    setFourthLevel(1);
  }, [setFourthLevel]);

  const save = useCallback(() => {
    if (!color) return;
    saveColor(color);
    vibration.success();
    openModal();
  }, [color, openModal, saveColor]);

  const options = useMemo(() => COLOR_OPTIONS, []);

  const { selectedItem: selectedOption, setSelectedIndex } =
    useVerticalHardwareListNavigation({
      items: options,
      initialIndex: options.findIndex((option) => option.rgb === currentColor),
      onConfirm: () => save(),
      onSelect: (option) => setColor(option.rgb),
    });

  const selectColor = useCallback(
    (nextColor: string) => {
      setSelectedIndex(options.findIndex((option) => option.rgb === nextColor));
    },
    [options, setSelectedIndex]
  );

  return {
    color,
    selectedOption,
    selectColor,
    save,
    options,
  };
};
