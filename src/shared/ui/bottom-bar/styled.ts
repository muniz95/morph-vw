import styled, { css } from 'styled-components';
import { colors } from '@/shared/styles/tokens';
import { noSelect } from '@/shared/styles/mixins';

const BottomBarContainer = styled.div`
  ${noSelect}
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const HardwareDeck = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const SideColumn = styled.div`
  flex: 0 0 clamp(56px, 20%, 72px);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const buttonBase = (backgroundEndColor = '#8c949d') => css`
  border: none;
  color: ${colors.textPrimary};
  background: linear-gradient(180deg, #d5dae0 0%, ${backgroundEndColor} 100%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 70%),
    inset 0 -2px 4px rgb(0 0 0 / 18%),
    0 4px 10px rgb(0 0 0 / 18%);
  cursor: pointer;
  transition:
    transform 120ms ease-in-out,
    box-shadow 120ms ease-in-out,
    background-color 120ms ease-in-out;

  &:focus-visible:not(:disabled),
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 60%),
      inset 0 -1px 2px rgb(0 0 0 / 26%),
      0 2px 4px rgb(0 0 0 / 20%);
  }

  &:disabled {
    cursor: default;
    color: rgb(0 0 0 / 58%);
  }
`;

const ActionKey = styled.button<{ $backgroundColor?: string }>`
  ${({ $backgroundColor }) => buttonBase($backgroundColor)}
  min-height: 44px;
  border-radius: 16px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const NavigationPad = styled.div`
  --nav-outer-size: clamp(34px, 12vw, 48px);
  --nav-center-size: clamp(46px, 16vw, 62px);
  flex: 1 1 auto;
  display: grid;
  grid-template-columns:
    var(--nav-outer-size)
    var(--nav-center-size)
    var(--nav-outer-size);
  grid-template-rows:
    var(--nav-outer-size)
    var(--nav-center-size)
    var(--nav-outer-size);
  grid-template-areas:
    '. up .'
    'left center right'
    '. down .';
  gap: 8px;
  align-content: center;
  justify-content: center;
  align-items: stretch;
  justify-items: stretch;
`;

const NavKey = styled.button<{ $area: string; $isCenter?: boolean }>`
  ${buttonBase()}
  grid-area: ${({ $area }) => $area};
  width: 100%;
  height: 100%;
  border-radius: ${({ $isCenter }) => ($isCenter ? '22px' : '16px')};
  font-size: ${({ $isCenter }) => ($isCenter ? '18px' : '15px')};
`;

const NumericPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const NumericKey = styled.button`
  ${buttonBase()}
  width: 100%;
  min-height: 44px;
  border-radius: 18px;
  font-size: 18px;
`;

const S = {
  ActionKey,
  BottomBarContainer,
  HardwareDeck,
  NavKey,
  NavigationPad,
  NumericKey,
  NumericPad,
  SideColumn,
};

export default S;
