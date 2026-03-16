import styled from 'styled-components';

const shellColors = {
  bodyHighlight: '#cfd5db',
  bodyLight: '#9098a1',
  bodyMid: '#626971',
  bodyDark: '#323840',
  bodyShadow: '#171b20',
  speaker: '#1b2128',
};

const phoneWidth = 'min(360px, calc(100vw - 32px))';

const Container = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 16px 28px;
  box-sizing: border-box;
  background: radial-gradient(
    circle at top,
    #667180 0%,
    #2d343d 36%,
    #11141a 100%
  );
`;

const UpperContainer = styled.div`
  position: relative;
  width: ${phoneWidth};
  min-height: 78px;
  margin: 0 auto;
  border-radius: 34px 34px 18px 18px;
  background: linear-gradient(
    180deg,
    ${shellColors.bodyHighlight} 0%,
    ${shellColors.bodyLight} 24%,
    ${shellColors.bodyMid} 62%,
    ${shellColors.bodyDark} 100%
  );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 60%),
    inset 0 -4px 8px rgb(0 0 0 / 22%),
    0 12px 28px rgb(0 0 0 / 40%);

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50%;
    width: 110px;
    height: 14px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: linear-gradient(
      180deg,
      rgb(8 10 14 / 95%) 0%,
      ${shellColors.speaker} 100%
    );
    box-shadow:
      inset 0 2px 4px rgb(0 0 0 / 60%),
      0 1px 0 rgb(255 255 255 / 10%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 24px;
    left: calc(50% + 78px);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(
      circle at 35% 35%,
      #59616b 0%,
      #222831 55%,
      #0f1217 100%
    );
    box-shadow: inset 0 1px 1px rgb(255 255 255 / 12%);
  }
`;

const ScreenContainer = styled.div`
  position: relative;
  width: ${phoneWidth};
  height: clamp(320px, 52vh, 420px);
  margin: -8px auto 0;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  border-radius: 24px 24px 18px 18px;
  background: linear-gradient(180deg, #adb3bb 0%, #7a838d 32%, #565f69 100%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 70%),
    inset 0 -4px 8px rgb(0 0 0 / 20%),
    0 12px 26px rgb(0 0 0 / 36%);
`;

const KeyboardContainer = styled.div`
  position: relative;
  width: ${phoneWidth};
  margin: -10px auto 0;
  padding: 18px 18px 24px;
  box-sizing: border-box;
  border-radius: 20px 20px 34px 34px;
  background: linear-gradient(
    180deg,
    ${shellColors.bodyLight} 0%,
    ${shellColors.bodyMid} 36%,
    ${shellColors.bodyDark} 100%
  );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 55%),
    inset 0 -6px 10px rgb(0 0 0 / 24%),
    0 16px 32px rgb(0 0 0 / 45%);

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 68px;
    height: 4px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: rgb(0 0 0 / 24%);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 18%);
  }
`;

const PhoneShell = {
  Container,
  UpperContainer,
  ScreenContainer,
  KeyboardContainer,
};

export default PhoneShell;
