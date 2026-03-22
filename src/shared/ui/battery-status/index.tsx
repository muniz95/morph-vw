import S from './styled';
import Blink from '@/shared/ui/blink';
import type { BatteryStatusModel } from './hooks/use-battery-status';

type BatteryStatusProps = {
  status: BatteryStatusModel;
};

const BatteryStatus = ({ status }: BatteryStatusProps) => {
  const { getInterval, getVisibility } = status;

  return (
    <S.BatteryStatus>
      <Blink interval={getInterval('full')}>
        <S.StatusBar isVisible={getVisibility('full')}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </S.StatusBar>
        <br />
      </Blink>
      <Blink interval={getInterval('halfFull')}>
        <S.StatusBar isVisible={getVisibility('halfFull')}>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </S.StatusBar>
        <br />
      </Blink>
      <Blink interval={getInterval('half')}>
        <S.StatusBar isVisible={getVisibility('half')}>
          &nbsp;&nbsp;&nbsp;
        </S.StatusBar>
        <br />
      </Blink>
      <Blink interval={getInterval('halfEmpty')}>
        <S.StatusBar isVisible={getVisibility('halfEmpty')}>
          &nbsp;&nbsp;
        </S.StatusBar>
        <br />
      </Blink>
      <Blink interval={getInterval('empty')}>
        <S.StatusBar isVisible={getVisibility('empty')}>&nbsp;</S.StatusBar>
        <br />
      </Blink>
      B
    </S.BatteryStatus>
  );
};

export default BatteryStatus;
