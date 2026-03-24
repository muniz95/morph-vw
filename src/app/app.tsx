import { Suspense } from 'react';
import BatteryStatus from '@/shared/ui/battery-status';
import BottomBar from '@/shared/ui/bottom-bar';
import Modal from '@/shared/ui/modal';
import LedIndicator from '@/shared/ui/led-indicator';
import PwaUpdateButton from '@/shared/ui/pwa-update-button';
import SignalStatus from '@/shared/ui/signal-status';
import TopBar from '@/shared/ui/top-bar';
import PageIndicator from '@/shared/ui/page-indicator';
import RouteLoading from '@/shared/ui/route-loading';
import Startup from '@/shared/ui/startup';
import { useBatteryStatus } from '@/shared/ui/battery-status/hooks/use-battery-status';
import GlobalStyle from '@/shared/styles/global-style';
import { usePwa } from '@/app/hooks/use-pwa';
import S from '@/app/ui/app-shell';
import PhoneShell from '@/app/ui/phone-shell';
import RouteErrorBoundary from '@/app/ui/route-error-boundary';
import { useApp } from '@/app/hooks/use-app';
import { resolveLedIndicatorState } from '@/shared/ui/led-indicator';

const App = () => {
  const { indicatorState } = usePwa();
  const batteryStatus = useBatteryStatus();
  const {
    backlightLevel,
    color,
    routePath,
    showModal,
    firstRender,
    handleModalAutoClose,
    routing,
    indicatorLevels,
  } = useApp();
  const ledState = resolveLedIndicatorState({
    pwaIndicatorState: indicatorState,
    isRecharging: batteryStatus.isRecharging,
    batteryLevel: batteryStatus.batteryLevel,
  });

  return (
    <PhoneShell.Container>
      <GlobalStyle />
      <PhoneShell.UpperContainer data-testid="phone-shell-upper">
        <LedIndicator state={ledState} />
        <PwaUpdateButton />
      </PhoneShell.UpperContainer>
      <PhoneShell.ScreenContainer data-testid="phone-shell-screen">
        <S.AppShell
          backgroundColor={color}
          backlightLevel={backlightLevel}
          data-testid="phone-screen-surface"
        >
          {firstRender ? (
            <Startup color={color} />
          ) : (
            <>
              <SignalStatus />
              <S.AppMainContainer>
                <TopBar
                  pageIndicator={
                    <PageIndicator
                      firstLevel={indicatorLevels.firstLevel}
                      secondLevel={indicatorLevels.secondLevel}
                      thirdLevel={indicatorLevels.thirdLevel}
                      fourthLevel={indicatorLevels.fourthLevel}
                      fifthLevel={indicatorLevels.fifthLevel}
                    />
                  }
                />

                <S.AppPageContainer>
                  <RouteErrorBoundary resetKey={routePath}>
                    <Suspense fallback={<RouteLoading />}>{routing}</Suspense>
                  </RouteErrorBoundary>
                </S.AppPageContainer>
              </S.AppMainContainer>
              <BatteryStatus status={batteryStatus} />
            </>
          )}
          <Modal
            color={color}
            backlightLevel={backlightLevel}
            isOpen={showModal}
            onAutoClose={handleModalAutoClose}
          />
        </S.AppShell>
      </PhoneShell.ScreenContainer>
      <PhoneShell.KeyboardContainer data-testid="phone-shell-keyboard">
        <BottomBar />
      </PhoneShell.KeyboardContainer>
    </PhoneShell.Container>
  );
};

export default App;
