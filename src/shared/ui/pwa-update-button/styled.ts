import styled from 'styled-components';
import { UiButton } from '@/shared/ui/controls';

const Button = styled(UiButton)`
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 1;
  min-width: auto;
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 10px;
  line-height: 1.1;
  background: linear-gradient(
    180deg,
    rgb(255 255 255 / 18%) 0%,
    rgb(0 0 0 / 12%) 100%
  );
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:disabled {
    background: linear-gradient(
      180deg,
      rgb(255 255 255 / 6%) 0%,
      rgb(0 0 0 / 14%) 100%
    );
  }
`;

const S = {
  Button,
};

export default S;
