import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LANGUAGE_OPTIONS } from '@/features/settings/domain/constants';
import { useSettingsStore } from '@/features/settings/state/settings-store';
import { useUiStore } from '@/app/state/ui-store';
import vibration from '@/shared/lib/vibration';
import { useVerticalHardwareListNavigation } from '@/shared/hooks/use-vertical-hardware-list-navigation';

export const useLanguageSettingsController = () => {
  const currentLanguage = useSettingsStore((state) => state.language);
  const saveLanguage = useSettingsStore((state) => state.setLanguage);
  const setFourthLevel = useUiStore((state) => state.setFourthLevel);
  const openModal = useUiStore((state) => state.openModal);
  const [language, setLanguage] = useState(currentLanguage);
  const optionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setFourthLevel(2);
  }, [setFourthLevel]);

  const save = useCallback(() => {
    if (!language) return;
    saveLanguage(language);
    vibration.success();
    openModal();
  }, [language, openModal, saveLanguage]);

  const options = useMemo(() => LANGUAGE_OPTIONS, []);

  const { selectedItem: selectedOption, setSelectedIndex } =
    useVerticalHardwareListNavigation({
      items: options,
      initialIndex: options.findIndex(
        (option) => option.iso639 === currentLanguage
      ),
      onConfirm: () => save(),
      onSelect: (option) => setLanguage(option.iso639),
    });

  const selectLanguage = useCallback(
    (nextLanguage: string) => {
      setSelectedIndex(
        options.findIndex((option) => option.iso639 === nextLanguage)
      );
    },
    [options, setSelectedIndex]
  );

  useEffect(() => {
    if (!selectedOption) return;

    optionRefs.current[selectedOption.iso639]?.scrollIntoView({
      block: 'nearest',
    });
  }, [selectedOption]);

  const registerOptionRef = useCallback(
    (iso639: string) => (element: HTMLDivElement | null) => {
      optionRefs.current[iso639] = element;
    },
    []
  );

  return {
    language,
    options,
    registerOptionRef,
    save,
    selectLanguage,
    selectedOption,
  };
};
