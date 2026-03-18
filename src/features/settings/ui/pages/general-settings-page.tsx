import SwipeMenu from '@/shared/ui/swipe-menu';
import { useGeneralSettingsMenuController } from '@/features/settings/infrastructure/controllers/use-general-settings-menu-controller';

const GeneralSettingsPage = () => {
  const { currentLabel } = useGeneralSettingsMenuController();

  return <SwipeMenu label={currentLabel} />;
};

export default GeneralSettingsPage;
