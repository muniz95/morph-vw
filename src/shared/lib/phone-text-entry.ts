export type PhoneNumericKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '*'
  | '#';

type MultiTapLetterKey = Extract<
  PhoneNumericKey,
  '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
>;

export interface MultiTapTextEntryState {
  committedValue: string;
  pendingKey: MultiTapLetterKey | null;
  pendingIndex: number;
}

const MULTI_TAP_LAYOUT: Record<MultiTapLetterKey, string> = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
};

export const MULTI_TAP_COMMIT_DELAY_MS = 1000;

export const createMultiTapTextEntryState = (
  value: string = ''
): MultiTapTextEntryState => ({
  committedValue: value,
  pendingKey: null,
  pendingIndex: 0,
});

export const getMultiTapCharacters = (key: PhoneNumericKey) =>
  key in MULTI_TAP_LAYOUT
    ? MULTI_TAP_LAYOUT[key as MultiTapLetterKey]
    : key === '0'
      ? ' '
      : '';

export const getMultiTapVisibleValue = (state: MultiTapTextEntryState) => {
  if (!state.pendingKey) {
    return state.committedValue;
  }

  return `${state.committedValue}${MULTI_TAP_LAYOUT[state.pendingKey][state.pendingIndex]}`;
};

export const commitMultiTapTextEntry = (state: MultiTapTextEntryState) => {
  if (!state.pendingKey) {
    return state;
  }

  return {
    committedValue: getMultiTapVisibleValue(state),
    pendingKey: null,
    pendingIndex: 0,
  };
};

export const pressMultiTapKey = (
  state: MultiTapTextEntryState,
  key: PhoneNumericKey
) => {
  if (key === '0') {
    return {
      committedValue: `${getMultiTapVisibleValue(state)} `,
      pendingKey: null,
      pendingIndex: 0,
    } satisfies MultiTapTextEntryState;
  }

  const characters = getMultiTapCharacters(key);

  if (!characters) {
    return state;
  }

  if (state.pendingKey === key) {
    return {
      ...state,
      pendingIndex: (state.pendingIndex + 1) % characters.length,
    };
  }

  return {
    committedValue: getMultiTapVisibleValue(state),
    pendingKey: key as MultiTapLetterKey,
    pendingIndex: 0,
  };
};

export const backspaceMultiTapTextEntry = (state: MultiTapTextEntryState) => {
  if (state.pendingKey) {
    return {
      consumed: true,
      state: {
        committedValue: state.committedValue,
        pendingKey: null,
        pendingIndex: 0,
      } satisfies MultiTapTextEntryState,
    };
  }

  if (!state.committedValue) {
    return {
      consumed: false,
      state,
    };
  }

  return {
    consumed: true,
    state: {
      committedValue: state.committedValue.slice(0, -1),
      pendingKey: null,
      pendingIndex: 0,
    } satisfies MultiTapTextEntryState,
  };
};
