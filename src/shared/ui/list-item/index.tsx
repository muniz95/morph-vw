import { ReactNode } from 'react';
import S from './styled';

interface ListItemProps {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
}

const ListItem = ({
  active = false,
  children,
  disabled = false,
  onClick,
  testId = 'list-item',
}: ListItemProps) => {
  if (onClick) {
    return (
      <S.Interactive
        type="button"
        aria-selected={active}
        data-testid={testId}
        $isActive={active}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </S.Interactive>
    );
  }

  return (
    <S.Static aria-selected={active} data-testid={testId} $isActive={active}>
      {children}
    </S.Static>
  );
};

export default ListItem;
