import SwipeMenu from '@/shared/ui/swipe-menu';
import { useSettingsMenuController } from '@/features/settings/infrastructure/controllers/use-settings-menu-controller';

const SettingsPage = () => {
  const { currentLabel } = useSettingsMenuController();

  return <SwipeMenu label={currentLabel} />;
};

export default SettingsPage;
