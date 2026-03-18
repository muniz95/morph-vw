import styled from 'styled-components';
import { layout } from '@/shared/styles/tokens';

interface AppShellProps {
  backgroundColor: string;
  backlightLevel: number;
}

const AppShell = styled.div<AppShellProps>`
  text-align: center;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  height: ${layout.appHeight};
  border-radius: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  background-image: ${({ backlightLevel }) =>
    `linear-gradient(rgb(0 0 0 / ${100 - backlightLevel}%) 0 0)`};
  transition: background-image 3000ms ease-in-out;
  box-shadow:
    inset 0 0 0 1px rgb(0 0 0 / 16%),
    inset 0 0 0 5px rgb(255 255 255 / 8%);
`;

const AppMainContainer = styled.div`
  width: ${layout.contentWidth};
  min-width: 0;
  flex: 0 0 ${layout.contentWidth};
  display: flex;
  flex-flow: column;
`;

const AppPageContainer = styled.div`
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  flex-flow: column;
`;

const S = {
  AppShell,
  AppMainContainer,
  AppPageContainer,
};

export default S;
