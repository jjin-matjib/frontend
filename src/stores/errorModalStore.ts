import { create } from "zustand";

interface ErrorModalState {
  message: string | null;
  show: (message: string) => void;
  close: () => void;
}

export const useErrorModalStore = create<ErrorModalState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  close: () => set({ message: null }),
}));
