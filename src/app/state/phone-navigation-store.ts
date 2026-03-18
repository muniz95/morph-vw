import { create } from 'zustand';

const STANDBY_PATH = '/';
const MAIN_MENU_PATH = '/menu';

export const getCurrentPath = (stack: string[]) =>
  stack[stack.length - 1] ?? STANDBY_PATH;

export const getLogicalDepth = (stack: string[]) =>
  Math.max(stack.length - 1, 0);

interface PhoneNavigationState {
  stack: string[];
  push: (path: string) => void;
  replace: (path: string) => void;
  goBack: () => void;
  goHome: () => void;
  openMenu: () => void;
}

const initialStack = [STANDBY_PATH];

export const usePhoneNavigationStore = create<PhoneNavigationState>((set) => ({
  stack: initialStack,
  push: (path) =>
    set((state) => ({
      stack:
        getCurrentPath(state.stack) === path
          ? state.stack
          : [...state.stack, path],
    })),
  replace: (path) =>
    set((state) => ({
      stack: [...state.stack.slice(0, -1), path],
    })),
  goBack: () =>
    set((state) => ({
      stack: state.stack.length > 1 ? state.stack.slice(0, -1) : state.stack,
    })),
  goHome: () => set({ stack: initialStack }),
  openMenu: () => set({ stack: [STANDBY_PATH, MAIN_MENU_PATH] }),
}));

export const resetPhoneNavigationStore = () => {
  usePhoneNavigationStore.setState({
    stack: initialStack,
  });
};

export { MAIN_MENU_PATH, STANDBY_PATH };
