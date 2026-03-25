import styled from 'styled-components';
import HomeScreen from '@/shared/ui/home-screen';
import { useTimer } from '@/shared/hooks/use-timer';
import { useSettingsStore } from '@/features/settings/state/settings-store';
import { formatClockTime, formatDateTime } from '@/shared/utils/date-time.util';

const StandbyBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TimeLabel = styled.h1`
  margin: 0;
  font-size: 32px;
`;

const DateLabel = styled.div`
  font-size: 13px;
  text-transform: uppercase;
`;

const HintLabel = styled.div`
  margin-top: 10px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const resolveLocale = (language: string) =>
  language === 'pt' ? 'pt-BR' : 'en-US';

const StandbyPage = () => {
  const date = useTimer();
  const language = useSettingsStore((state) => state.language);
  const locale = resolveLocale(language);

  return (
    <HomeScreen>
      <StandbyBody>
        <TimeLabel>{formatClockTime(date, { locale })}</TimeLabel>
        <DateLabel>{formatDateTime(date, { locale })}</DateLabel>
        <HintLabel>Press Menu</HintLabel>
      </StandbyBody>
    </HomeScreen>
  );
};

export default StandbyPage;
