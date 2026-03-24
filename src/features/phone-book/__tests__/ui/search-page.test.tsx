import { act, render } from '@testing-library/react';
import { useSearchController } from '@/features/phone-book/infrastructure/controllers/use-search-controller';
import SearchPage from '@/features/phone-book/ui/pages/search-page';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from '@/features/phone-book/domain/contact';
import {
  resetPhoneTextEntryStore,
  usePhoneTextEntryStore,
} from '@/app/state/phone-text-entry-store';

vi.mock(
  '@/features/phone-book/infrastructure/controllers/use-search-controller'
);

describe('PhoneBookSearch', () => {
  const mockContacts: Contact[] = [
    { name: 'Alice', isServiceNumber: false, number: '123' },
    { name: 'Bob', isServiceNumber: false, number: '123' },
    { name: 'Charlie', isServiceNumber: false, number: '123' },
    { name: 'David', isServiceNumber: false, number: '123' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    resetPhoneTextEntryStore();

    vi.mocked(useSearchController).mockReturnValue({
      search: '',
      contacts: mockContacts,
      setSearch: vi.fn(),
    });
  });

  it('renders the TextInput component', () => {
    const { getByRole } = render(<SearchPage />);
    expect(getByRole('textbox')).toBeTruthy();
  });

  it('renders all contacts initially', () => {
    const { getByText } = render(<SearchPage />);
    mockContacts.forEach((contact) => {
      expect(getByText(contact.name)).toBeTruthy();
    });
  });

  it('renders contacts in top-to-down order with row gap in the list container', () => {
    const { getAllByTestId } = render(<SearchPage />);
    const renderedItems = getAllByTestId('list-item');
    const labels = renderedItems.map((item) => item.textContent);

    expect(labels).toEqual(['Alice', 'Bob', 'Charlie', 'David']);

    const resultsBox = renderedItems[0].parentElement as HTMLElement;
    const styles = window.getComputedStyle(resultsBox);
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    expect(styles.gap).toBe('8px');
  });

  it('calls setSearch when input changes through phone input', () => {
    const mockSetSearch = vi.fn();
    vi.mocked(useSearchController).mockReturnValue({
      search: '',
      contacts: mockContacts,
      setSearch: mockSetSearch,
    });

    render(<SearchPage />);

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('8');
    });

    expect(mockSetSearch).toHaveBeenCalledWith('T');
  });
});
