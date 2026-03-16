import S from './styled';
import { useBottomBarNavigation } from './hooks/use-bottom-bar-navigation';

const numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const BottomBar = () => {
  const { goBack, goHome } = useBottomBarNavigation();

  return (
    <S.BottomBarContainer role="group" aria-label="Phone keyboard">
      <S.HardwareDeck>
        <S.SideColumn>
          <S.ActionKey type="button" disabled>
            Menu
          </S.ActionKey>
          <S.ActionKey type="button" disabled>
            Names
          </S.ActionKey>
        </S.SideColumn>
        <S.NavigationPad aria-hidden="true">
          <S.NavKey type="button" disabled $area="up">
            ^
          </S.NavKey>
          <S.NavKey type="button" disabled $area="left">
            {'<'}
          </S.NavKey>
          <S.NavKey type="button" disabled $area="center" $isCenter>
            OK
          </S.NavKey>
          <S.NavKey type="button" disabled $area="right">
            {'>'}
          </S.NavKey>
          <S.NavKey type="button" disabled $area="down">
            v
          </S.NavKey>
        </S.NavigationPad>
        <S.SideColumn>
          <S.ActionKey type="button" aria-label="Upper Right" onClick={goBack}>
            {'<'}
          </S.ActionKey>
          <S.ActionKey type="button" aria-label="Lower Right" onClick={goHome}>
            O
          </S.ActionKey>
        </S.SideColumn>
      </S.HardwareDeck>
      <S.NumericPad aria-hidden="true">
        {numericKeys.map((key) => (
          <S.NumericKey type="button" key={key} disabled>
            {key}
          </S.NumericKey>
        ))}
      </S.NumericPad>
    </S.BottomBarContainer>
  );
};

export default BottomBar;
