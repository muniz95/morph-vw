import { useMemo, useRef } from 'react';
import useTranslation from '@/shared/hooks/use-translation';
import { useVerticalHardwareFocusNavigation } from '@/shared/hooks/use-vertical-hardware-focus-navigation';
import S from '@/shared/ui/base';
import { UiButton } from '@/shared/ui/controls';
import ListItem from '@/shared/ui/list-item';
import TextInput from '@/shared/ui/text-input';
import { useEditController } from '@/features/phone-book/infrastructure/controllers/use-edit-controller';

const EditPage = () => {
  const { t } = useTranslation();
  const { contacts, name, saveContact, selectContact, setName } =
    useEditController();
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
      <S.ResultsBox>
        {contacts.map((contact) => (
          <ListItem
            key={contact.id ?? `${contact.name}-${contact.number}`}
            onClick={() => selectContact(contact)}
          >
            {contact.name}
          </ListItem>
        ))}
      </S.ResultsBox>
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

export default EditPage;
