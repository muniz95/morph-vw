import { create } from 'zustand';

export interface HardwareInputHandlers {
  onLeft?: () => void;
  onRight?: () => void;
  onConfirm?: () => void;
}

interface HardwareInputState {
  handlers: HardwareInputHandlers;
  setHandlers: (handlers: HardwareInputHandlers) => void;
  clearHandlers: () => void;
  triggerLeft: () => void;
  triggerRight: () => void;
  triggerConfirm: () => void;
}

const emptyHandlers: HardwareInputHandlers = {};

export const useHardwareInputStore = create<HardwareInputState>((set, get) => ({
  handlers: emptyHandlers,
  setHandlers: (handlers) => set({ handlers }),
  clearHandlers: () => set({ handlers: emptyHandlers }),
  triggerLeft: () => {
    get().handlers.onLeft?.();
  },
  triggerRight: () => {
    get().handlers.onRight?.();
  },
  triggerConfirm: () => {
    get().handlers.onConfirm?.();
  },
}));

export const resetHardwareInputStore = () => {
  useHardwareInputStore.setState({
    handlers: emptyHandlers,
  });
};
