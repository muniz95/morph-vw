import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UiTextInput } from '@/shared/ui/controls';
import {
  MULTI_TAP_COMMIT_DELAY_MS,
  backspaceMultiTapTextEntry,
  commitMultiTapTextEntry,
  createMultiTapTextEntryState,
  getMultiTapVisibleValue,
  PhoneNumericKey,
  pressMultiTapKey,
} from '@/shared/lib/phone-text-entry';
import { usePhoneTextEntryStore } from '@/app/state/phone-text-entry-store';

interface IProps {
  autoFocus?: boolean;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
}

const setInputRef = (
  forwardedRef: ForwardedRef<HTMLInputElement>,
  element: HTMLInputElement | null
) => {
  if (typeof forwardedRef === 'function') {
    forwardedRef(element);
    return;
  }

  if (forwardedRef) {
    const mutableRef = forwardedRef as {
      current: HTMLInputElement | null;
    };
    mutableRef.current = element;
  }
};

const TextInput = forwardRef<HTMLInputElement, IProps>(
  ({ autoFocus = true, id, onValueChange, value }, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const entryIdRef = useRef(Symbol(id));
    const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [entryState, setEntryState] = useState(() =>
      createMultiTapTextEntryState(value)
    );
    const entryStateRef = useRef(entryState);
    const setActiveTextEntry = usePhoneTextEntryStore(
      (state) => state.setActiveTextEntry
    );
    const clearActiveTextEntry = usePhoneTextEntryStore(
      (state) => state.clearActiveTextEntry
    );

    const handleInputRef = useCallback(
      (element: HTMLInputElement | null) => {
        inputRef.current = element;
        setInputRef(forwardedRef, element);
      },
      [forwardedRef]
    );

    const clearCommitTimer = useCallback(() => {
      if (commitTimerRef.current !== null) {
        clearTimeout(commitTimerRef.current);
        commitTimerRef.current = null;
      }
    }, []);

    const scheduleCommit = useCallback(
      (nextState: typeof entryState) => {
        clearCommitTimer();

        if (!nextState.pendingKey) {
          return;
        }

        commitTimerRef.current = setTimeout(() => {
          const committedState = commitMultiTapTextEntry(entryStateRef.current);
          entryStateRef.current = committedState;
          setEntryState(committedState);
          commitTimerRef.current = null;
        }, MULTI_TAP_COMMIT_DELAY_MS);
      },
      [clearCommitTimer]
    );

    const applyEntryState = useCallback(
      (nextState: typeof entryState) => {
        const previousValue = getMultiTapVisibleValue(entryStateRef.current);
        const nextValue = getMultiTapVisibleValue(nextState);

        entryStateRef.current = nextState;
        setEntryState(nextState);
        scheduleCommit(nextState);

        if (nextValue !== previousValue) {
          onValueChange(nextValue);
        }
      },
      [onValueChange, scheduleCommit]
    );

    const commitPendingValue = useCallback(() => {
      const committedState = commitMultiTapTextEntry(entryStateRef.current);
      const previousValue = getMultiTapVisibleValue(entryStateRef.current);
      const nextValue = getMultiTapVisibleValue(committedState);

      clearCommitTimer();
      entryStateRef.current = committedState;
      setEntryState(committedState);

      if (nextValue !== previousValue) {
        onValueChange(nextValue);
      }
    }, [clearCommitTimer, onValueChange]);

    const handleNumericKey = useCallback(
      (key: PhoneNumericKey) => {
        const nextState = pressMultiTapKey(entryStateRef.current, key);

        if (nextState === entryStateRef.current) {
          return;
        }

        applyEntryState(nextState);
      },
      [applyEntryState]
    );

    const handleBack = useCallback(() => {
      const result = backspaceMultiTapTextEntry(entryStateRef.current);

      if (!result.consumed) {
        return false;
      }

      applyEntryState(result.state);
      return true;
    }, [applyEntryState]);

    const activateTextEntry = useCallback(() => {
      setActiveTextEntry({
        entryId: entryIdRef.current,
        onNumericKey: handleNumericKey,
        onBack: handleBack,
      });
    }, [handleBack, handleNumericKey, setActiveTextEntry]);

    const deactivateTextEntry = useCallback(() => {
      commitPendingValue();
      clearActiveTextEntry(entryIdRef.current);
    }, [clearActiveTextEntry, commitPendingValue]);

    useEffect(() => {
      const currentValue = getMultiTapVisibleValue(entryStateRef.current);

      if (value === currentValue) {
        return;
      }

      clearCommitTimer();
      const nextState = createMultiTapTextEntryState(value);
      entryStateRef.current = nextState;
      setEntryState(nextState);
    }, [clearCommitTimer, value]);

    useEffect(() => {
      if (!autoFocus) return;

      inputRef.current?.focus();
    }, [autoFocus]);

    useEffect(() => {
      return () => {
        commitPendingValue();
        clearActiveTextEntry(entryIdRef.current);
      };
    }, [clearActiveTextEntry, commitPendingValue]);

    return (
      <UiTextInput
        ref={handleInputRef}
        name={id}
        id={id}
        autoComplete="off"
        readOnly
        spellCheck={false}
        value={getMultiTapVisibleValue(entryState)}
        onBlur={deactivateTextEntry}
        onFocus={activateTextEntry}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
