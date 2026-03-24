import { useMemo, useRef } from 'react';
import useTranslation from '@/shared/hooks/use-translation';
import { useVerticalHardwareFocusNavigation } from '@/shared/hooks/use-vertical-hardware-focus-navigation';
import S from '@/shared/ui/base';
import { UiButton } from '@/shared/ui/controls';
import TextInput from '@/shared/ui/text-input';
import { useAddNameController } from '@/features/phone-book/infrastructure/controllers/use-add-name-controller';

const AddNamePage = () => {
  const { t } = useTranslation();
  const { name, saveContact, setName } = useAddNameController();
  const inputRef = useRef<HTMLInputElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const focusItems = useMemo(
    () => [{ ref: inputRef }, { ref: saveButtonRef, onConfirm: saveContact }],
    [saveContact]
  );

  useVerticalHardwareFocusNavigation({
    items: focusItems,
  });

  return (
    <S.MainContainer>
      <div>
        <TextInput
          ref={inputRef}
          id="name"
          value={name}
          onValueChange={setName}
        />
      </div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>
        <UiButton ref={saveButtonRef} onClick={saveContact}>
          {t('save')}
        </UiButton>
      </div>
    </S.MainContainer>
  );
};

export default AddNamePage;
