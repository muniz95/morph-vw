import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import TextInput from '@/shared/ui/text-input';
import {
  resetPhoneTextEntryStore,
  usePhoneTextEntryStore,
} from '@/app/state/phone-text-entry-store';

const TextInputHarness = () => {
  const [value, setValue] = useState('');

  return <TextInput id="name" value={value} onValueChange={setValue} />;
};

describe('phone text input', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetPhoneTextEntryStore();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders a controlled read-only textbox', () => {
    const { getByRole } = render(<TextInput id="name" value="ABC" onValueChange={vi.fn()} />);
    const input = getByRole('textbox') as HTMLInputElement;

    expect(input.value).toBe('ABC');
    expect(input.readOnly).toBe(true);
  });

  it('updates the textbox through numeric hardware input and auto-commits after the delay', () => {
    const { getByRole } = render(<TextInputHarness />);
    const input = getByRole('textbox') as HTMLInputElement;

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('2');
    });
    expect(input.value).toBe('A');

    act(() => {
      vi.advanceTimersByTime(1000);
      usePhoneTextEntryStore.getState().triggerNumericKey('3');
    });

    expect(input.value).toBe('AD');
  });

  it('uses Back to delete text from the active entry', () => {
    const { getByRole } = render(<TextInputHarness />);
    const input = getByRole('textbox') as HTMLInputElement;

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('2');
      usePhoneTextEntryStore.getState().triggerBack();
    });
    expect(input.value).toBe('');

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('2');
      vi.advanceTimersByTime(1000);
      usePhoneTextEntryStore.getState().triggerBack();
    });

    expect(input.value).toBe('');
  });

  it('commits pending text and deactivates text entry on blur', () => {
    const { getByRole } = render(
      <>
        <TextInputHarness />
        <button type="button">Next</button>
      </>
    );
    const input = getByRole('textbox') as HTMLInputElement;
    const button = getByRole('button', { name: 'Next' });

    act(() => {
      usePhoneTextEntryStore.getState().triggerNumericKey('2');
    });

    expect(input.value).toBe('A');

    act(() => {
      button.focus();
    });

    expect(input.value).toBe('A');
    expect(usePhoneTextEntryStore.getState().activeTextEntry).toBeNull();
  });
});
