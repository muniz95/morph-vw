import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  id: string;
  value: string;
  onValueChange: (value: string) => void;
}

const TextInput = ({ id, onValueChange, value }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const entryId = entryIdRef.current;

    setActiveTextEntry({
      entryId,
      onNumericKey: handleNumericKey,
      onBack: handleBack,
    });

    return () => {
      clearCommitTimer();
      clearActiveTextEntry(entryId);
    };
  }, [
    clearActiveTextEntry,
    clearCommitTimer,
    handleBack,
    handleNumericKey,
    setActiveTextEntry,
  ]);

  return (
    <UiTextInput
      ref={inputRef}
      name={id}
      id={id}
      autoComplete="off"
      readOnly
      spellCheck={false}
      value={getMultiTapVisibleValue(entryState)}
    />
  );
};

export default TextInput;
