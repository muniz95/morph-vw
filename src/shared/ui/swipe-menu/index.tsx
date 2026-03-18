import HomeScreen from '@/shared/ui/home-screen';

interface SwipeMenuProps {
  label: string;
}

const SwipeMenu = ({ label }: SwipeMenuProps) => {
  return <HomeScreen>{label}</HomeScreen>;
};

export default SwipeMenu;
