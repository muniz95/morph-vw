import styled, { css } from 'styled-components';
import { colors } from '@/shared/styles/tokens';
import { UiButton } from '@/shared/ui/controls';

const listItemLayout = css`
  min-height: 10%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
`;

const activeListItem = css`
  font-weight: bold;
  background-color: ${colors.focusBackground};
  color: ${colors.textInverse};
`;

const Interactive = styled(UiButton)<{ $isActive?: boolean }>`
  ${listItemLayout}
  border: none;

  ${({ $isActive }) => $isActive && activeListItem}

  &:active,
  &:focus,
  &:focus-visible {
    ${activeListItem}
  }
`;

const Static = styled.div<{ $isActive?: boolean }>`
  ${listItemLayout}
  ${({ $isActive }) => $isActive && activeListItem}
`;

const S = {
  Interactive,
  Static,
};

export default S;
