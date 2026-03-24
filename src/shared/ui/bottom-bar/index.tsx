import S from './styled';
import { useBottomBarNavigation } from './hooks/use-bottom-bar-navigation';
import { PhoneNumericKey } from '@/shared/lib/phone-text-entry';

const numericKeys: PhoneNumericKey[] = [
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
  '0',
  '#',
];

const BottomBar = () => {
  const {
    canConfirm,
    canGoBack,
    canGoHome,
    canMoveDown,
    canMoveLeft,
    canMoveRight,
    canMoveUp,
    canUseNumericKeys,
    confirm,
    goBack,
    goHome,
    moveDown,
    moveUp,
    moveLeft,
    moveRight,
    openMenu,
    pressNumericKey,
  } = useBottomBarNavigation();

  return (
    <S.BottomBarContainer role="group" aria-label="Phone keyboard">
      <S.HardwareDeck>
        <S.SideColumn>
          <S.ActionKey type="button" aria-label="Menu" onClick={openMenu}>
            Menu
          </S.ActionKey>
          <S.ActionKey type="button" $backgroundColor="#00ff00" disabled />
        </S.SideColumn>
        <S.NavigationPad>
          <S.NavKey
            type="button"
            aria-label="Up"
            disabled={!canMoveUp}
            $area="up"
            onClick={moveUp}
          >
            ^
          </S.NavKey>
          <S.NavKey
            type="button"
            aria-label="Left"
            disabled={!canMoveLeft}
            $area="left"
            onClick={moveLeft}
          >
            {'<'}
          </S.NavKey>
          <S.NavKey
            type="button"
            aria-label="OK"
            disabled={!canConfirm}
            $area="center"
            $isCenter
            onClick={confirm}
          >
            OK
          </S.NavKey>
          <S.NavKey
            type="button"
            aria-label="Right"
            disabled={!canMoveRight}
            $area="right"
            onClick={moveRight}
          >
            {'>'}
          </S.NavKey>
          <S.NavKey
            type="button"
            aria-label="Down"
            disabled={!canMoveDown}
            $area="down"
            onClick={moveDown}
          >
            v
          </S.NavKey>
        </S.NavigationPad>
        <S.SideColumn>
          <S.ActionKey
            type="button"
            aria-label="Upper Right"
            disabled={!canGoBack}
            onClick={goBack}
          >
            Back
          </S.ActionKey>
          <S.ActionKey
            type="button"
            aria-label="Lower Right"
            $backgroundColor="#ff0000"
            disabled={!canGoHome}
            onClick={goHome}
          >
            Home
          </S.ActionKey>
        </S.SideColumn>
      </S.HardwareDeck>
      <S.NumericPad>
        {numericKeys.map((key) => (
          <S.NumericKey
            type="button"
            key={key}
            disabled={!canUseNumericKeys}
            onClick={() => pressNumericKey(key)}
          >
            {key}
          </S.NumericKey>
        ))}
      </S.NumericPad>
    </S.BottomBarContainer>
  );
};

export default BottomBar;
