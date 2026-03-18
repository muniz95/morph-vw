import SwipeMenu from '@/shared/ui/swipe-menu';
import { usePhoneBookMenuController } from '@/features/phone-book/infrastructure/controllers/use-phone-book-menu-controller';

const PhoneBookPage = () => {
  const { label } = usePhoneBookMenuController();

  return <SwipeMenu label={label} />;
};

export default PhoneBookPage;
