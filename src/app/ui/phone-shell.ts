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
const upperHeight = '78px';

const Container = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 24px 16px 28px;
  box-sizing: border-box;
  background: radial-gradient(
    circle at center,
    #667180 0%,
    #2d343d 36%,
    #11141a 100%
  );
`;

const UpperContainer = styled.div`
  position: relative;
  width: ${phoneWidth};
  flex: 0 0 ${upperHeight};
  height: ${upperHeight};
  margin: 0 auto;
  border-radius: 34px 34px 0px 0px;
  background-color: ${shellColors.bodyDark};

  &::before {
    content: '';
    position: absolute;
    bottom: 15px;
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
    bottom: 15px;
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
  flex: 1 1 auto;
  min-height: 0;
  margin: -8px auto 0;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  background-color: ${shellColors.bodyDark};
`;

const KeyboardContainer = styled.div`
  position: relative;
  width: ${phoneWidth};
  flex: 0 0 auto;
  padding: 18px 18px 24px;
  box-sizing: border-box;
  border-radius: 0px 0px 34px 34px;
  background-color: ${shellColors.bodyDark};

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
