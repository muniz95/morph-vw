import { usePwa } from '@/app/hooks/use-pwa';
import S from './styled';

const PwaUpdateButton = () => {
  const { updateAvailable, applyUpdate } = usePwa();

  return (
    <S.Button
      aria-label="Update app"
      disabled={!updateAvailable}
      type="button"
      onClick={applyUpdate}
    >
      !
    </S.Button>
  );
};

export default PwaUpdateButton;
