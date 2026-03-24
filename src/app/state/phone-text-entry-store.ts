import { create } from 'zustand';
import { PhoneNumericKey } from '@/shared/lib/phone-text-entry';

export interface PhoneTextEntryRegistration {
  entryId: symbol;
  onNumericKey: (key: PhoneNumericKey) => void;
  onBack: () => boolean;
}

interface PhoneTextEntryState {
  activeTextEntry: PhoneTextEntryRegistration | null;
  setActiveTextEntry: (entry: PhoneTextEntryRegistration) => void;
  clearActiveTextEntry: (entryId: symbol) => void;
  triggerNumericKey: (key: PhoneNumericKey) => void;
  triggerBack: () => boolean;
}

const initialPhoneTextEntryState = {
  activeTextEntry: null as PhoneTextEntryRegistration | null,
};

export const usePhoneTextEntryStore = create<PhoneTextEntryState>(
  (set, get) => ({
    ...initialPhoneTextEntryState,
    setActiveTextEntry: (activeTextEntry) => set({ activeTextEntry }),
    clearActiveTextEntry: (entryId) =>
      set((state) =>
        state.activeTextEntry?.entryId === entryId
          ? { activeTextEntry: null }
          : state
      ),
    triggerNumericKey: (key) => {
      get().activeTextEntry?.onNumericKey(key);
    },
    triggerBack: () => get().activeTextEntry?.onBack() ?? false,
  })
);

export const resetPhoneTextEntryStore = () => {
  usePhoneTextEntryStore.setState(initialPhoneTextEntryState);
};
