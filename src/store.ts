import { create } from 'zustand';

interface AppState {
  bears: number;
  increase: (by: number) => void;
}
export const useAppStore = create<AppState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by }))
}));
