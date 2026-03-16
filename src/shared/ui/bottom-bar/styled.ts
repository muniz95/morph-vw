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

const buttonBase = css`
  border: none;
  color: ${colors.textPrimary};
  background: linear-gradient(180deg, #d5dae0 0%, #8c949d 100%);
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

const ActionKey = styled.button`
  ${buttonBase}
  min-height: 44px;
  border-radius: 16px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const NavigationPad = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-areas:
    '. up .'
    'left center right'
    '. down .';
  gap: 8px;
  align-items: center;
  justify-items: center;
`;

const NavKey = styled.button<{ $area: string; $isCenter?: boolean }>`
  ${buttonBase}
  grid-area: ${({ $area }) => $area};
  width: ${({ $isCenter }) => ($isCenter ? 'min(62px, 100%)' : 'min(48px, 100%)')};
  height: ${({ $isCenter }) => ($isCenter ? '62px' : '42px')};
  border-radius: ${({ $isCenter }) => ($isCenter ? '22px' : '16px')};
  font-size: ${({ $isCenter }) => ($isCenter ? '18px' : '15px')};
`;

const NumericPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const NumericKey = styled.button`
  ${buttonBase}
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
