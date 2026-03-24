import { describe, expect, it } from 'vitest';
import {
  backspaceMultiTapTextEntry,
  createMultiTapTextEntryState,
  getMultiTapVisibleValue,
  pressMultiTapKey,
} from '@/shared/lib/phone-text-entry';

describe('phone text entry engine', () => {
  it('cycles through the E.161 characters on the same key', () => {
    let state = createMultiTapTextEntryState();

    state = pressMultiTapKey(state, '2');
    expect(getMultiTapVisibleValue(state)).toBe('A');

    state = pressMultiTapKey(state, '2');
    expect(getMultiTapVisibleValue(state)).toBe('B');

    state = pressMultiTapKey(state, '2');
    expect(getMultiTapVisibleValue(state)).toBe('C');

    state = pressMultiTapKey(state, '2');
    expect(getMultiTapVisibleValue(state)).toBe('A');
  });

  it('cycles through four-letter keys', () => {
    let state = createMultiTapTextEntryState();

    state = pressMultiTapKey(state, '7');
    state = pressMultiTapKey(state, '7');
    state = pressMultiTapKey(state, '7');
    state = pressMultiTapKey(state, '7');

    expect(getMultiTapVisibleValue(state)).toBe('S');
  });

  it('maps zero to a space', () => {
    const state = pressMultiTapKey(createMultiTapTextEntryState('ABC'), '0');

    expect(getMultiTapVisibleValue(state)).toBe('ABC ');
  });

  it('ignores unsupported keys in v1', () => {
    const initialState = createMultiTapTextEntryState('ABC');

    expect(getMultiTapVisibleValue(pressMultiTapKey(initialState, '1'))).toBe(
      'ABC'
    );
    expect(getMultiTapVisibleValue(pressMultiTapKey(initialState, '*'))).toBe(
      'ABC'
    );
    expect(getMultiTapVisibleValue(pressMultiTapKey(initialState, '#'))).toBe(
      'ABC'
    );
  });

  it('commits the current character when a different key is pressed', () => {
    let state = createMultiTapTextEntryState();

    state = pressMultiTapKey(state, '2');
    state = pressMultiTapKey(state, '2');
    state = pressMultiTapKey(state, '3');

    expect(getMultiTapVisibleValue(state)).toBe('BD');
  });

  it('deletes pending and committed characters correctly', () => {
    let state = createMultiTapTextEntryState();

    state = pressMultiTapKey(state, '2');

    const pendingDelete = backspaceMultiTapTextEntry(state);
    expect(pendingDelete.consumed).toBe(true);
    expect(getMultiTapVisibleValue(pendingDelete.state)).toBe('');

    state = pressMultiTapKey(createMultiTapTextEntryState('A'), '3');
    const committedDelete = backspaceMultiTapTextEntry(
      backspaceMultiTapTextEntry(state).state
    );

    expect(committedDelete.consumed).toBe(true);
    expect(getMultiTapVisibleValue(committedDelete.state)).toBe('');
  });
});
