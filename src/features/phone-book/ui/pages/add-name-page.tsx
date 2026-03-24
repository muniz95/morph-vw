import useTranslation from '@/shared/hooks/use-translation';
import S from '@/shared/ui/base';
import { UiButton } from '@/shared/ui/controls';
import TextInput from '@/shared/ui/text-input';
import { useAddNameController } from '@/features/phone-book/infrastructure/controllers/use-add-name-controller';

const AddNamePage = () => {
  const { t } = useTranslation();
  const { name, saveContact, setName } = useAddNameController();

  return (
    <S.MainContainer>
      <div>
        <TextInput id="name" value={name} onValueChange={setName} />
      </div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>
        <UiButton onClick={saveContact}>{t('save')}</UiButton>
      </div>
    </S.MainContainer>
  );
};

export default AddNamePage;
