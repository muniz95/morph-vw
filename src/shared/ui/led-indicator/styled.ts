import styled, { css, keyframes } from 'styled-components';
import type { LedIndicatorState } from '.';

type ActiveIndicatorState = Exclude<LedIndicatorState, 'idle'>;

const blink = keyframes`
  0%,
  100% {
    opacity: 0.25;
  }

  50% {
    opacity: 1;
  }
`;

const ledStyles = {
  'update-available': css`
    background: radial-gradient(
      circle at 30% 30%,
      #d7eeff 0%,
      #3f9bff 45%,
      #0b356d 100%
    );
    box-shadow:
      0 0 10px rgb(63 155 255 / 85%),
      0 0 18px rgb(63 155 255 / 45%),
      inset 0 1px 2px rgb(255 255 255 / 40%);
  `,
  updating: css`
    background: radial-gradient(
      circle at 30% 30%,
      #fff6c2 0%,
      #ffd548 45%,
      #7d5600 100%
    );
    box-shadow:
      0 0 10px rgb(255 213 72 / 80%),
      0 0 18px rgb(255 213 72 / 45%),
      inset 0 1px 2px rgb(255 255 255 / 40%);
    animation: ${blink} 0.85s steps(2, end) infinite;
  `,
  error: css`
    background: radial-gradient(
      circle at 30% 30%,
      #ffc8c8 0%,
      #ef4444 45%,
      #6d1010 100%
    );
    box-shadow:
      0 0 10px rgb(239 68 68 / 85%),
      0 0 18px rgb(239 68 68 / 45%),
      inset 0 1px 2px rgb(255 255 255 / 35%);
  `,
  charging: css`
    background: radial-gradient(
      circle at 30% 30%,
      #ffffff 0%,
      #eef4ff 45%,
      #6f7889 100%
    );
    box-shadow:
      0 0 12px rgb(255 255 255 / 88%),
      0 0 20px rgb(216 228 255 / 55%),
      inset 0 1px 2px rgb(255 255 255 / 55%);
  `,
  'battery-low': css`
    background: radial-gradient(
      circle at 30% 30%,
      #ffc8c8 0%,
      #ef4444 45%,
      #6d1010 100%
    );
    box-shadow:
      0 0 10px rgb(239 68 68 / 85%),
      0 0 18px rgb(239 68 68 / 45%),
      inset 0 1px 2px rgb(255 255 255 / 35%);
  `,
} satisfies Record<ActiveIndicatorState, ReturnType<typeof css>>;

const Container = styled.div<{ $state: ActiveIndicatorState }>`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid rgb(0 0 0 / 35%);

  ${({ $state }) => ledStyles[$state]}
`;

const S = {
  Container,
};

export default S;
