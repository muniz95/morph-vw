import S from '@/shared/ui/base';
import { UiButton } from '@/shared/ui/controls';
import ListItem from '@/shared/ui/list-item';
import useTranslation from '@/shared/hooks/use-translation';
import { useLanguageSettingsController } from '@/features/settings/infrastructure/controllers/use-language-settings-controller';

const LanguageSettingsPage = () => {
  const { t } = useTranslation();
  const {
    language,
    options,
    registerOptionRef,
    save,
    selectedOption,
    selectLanguage,
  } = useLanguageSettingsController();

  return (
    <>
      <S.MainContainer>
        {options.map(({ iso639, title }) => (
          <S.ResultsBox key={iso639} ref={registerOptionRef(iso639)}>
            <ListItem
              active={selectedOption?.iso639 === iso639}
              onClick={() => selectLanguage(iso639)}
            >
              {title}
            </ListItem>
          </S.ResultsBox>
        ))}
      </S.MainContainer>
      <S.ButtonContainer>
        <UiButton disabled={language === ''} onClick={save}>
          {t('save')}
        </UiButton>
      </S.ButtonContainer>
    </>
  );
};

export default LanguageSettingsPage;
