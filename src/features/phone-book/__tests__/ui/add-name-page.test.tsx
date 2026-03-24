import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import '@/app/providers/i18n';
import AddNamePage from '@/features/phone-book/ui/pages/add-name-page';
import {
  resetHardwareInputStore,
  useHardwareInputStore,
} from '@/app/state/hardware-input-store';
import { resetUiStore, useUiStore } from '@/app/state/ui-store';
import { resetContactsStore } from '@/features/phone-book/state/contacts-store';
import {
  resetPhoneTextEntryStore,
  usePhoneTextEntryStore,
} from '@/app/state/phone-text-entry-store';

describe('PhoneBookAddName Component', () => {
  beforeEach(() => {
    resetHardwareInputStore();
    resetContactsStore();
    resetPhoneTextEntryStore();
    resetUiStore();
  });

  it('should render the input and button', () => {
    const { getByText, getByRole } = render(<AddNamePage />);
    expect(getByRole('textbox')).toBeTruthy();
    expect(getByText('save')).toBeTruthy();
  });

  it('should update the input value from phone numeric input', () => {
    const { getByRole } = render(<AddNamePage />);
    const input = getByRole('textbox') as HTMLInputElement;

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('5');
      usePhoneTextEntryStore.getState().triggerNumericKey('5');
    });

    expect(input.value).toBe('K');
  });

  it('should call saveContact on button click', () => {
    const { getByText } = render(<AddNamePage />);
    const button = getByText('save');
    fireEvent.click(button);
    // Add your assertions here
  });

  it('types text, moves down to save, and confirms through hardware input', () => {
    const { getByRole, getByText } = render(<AddNamePage />);
    const input = getByRole('textbox') as HTMLInputElement;
    const saveButton = getByText('save');

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('2');
    });

    expect(input.value).toBe('A');

    act(() => {
      useHardwareInputStore.getState().triggerDown();
    });

    expect(document.activeElement).toBe(saveButton);

    act(() => {
      useHardwareInputStore.getState().triggerConfirm();
    });

    expect(useUiStore.getState().showModal).toBe(true);
  });
});
