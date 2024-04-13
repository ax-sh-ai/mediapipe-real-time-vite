import { create } from 'zustand';

interface AppState {
  mediaFilePath: Blob;
  addMediaFilePath: (by: Blob) => void;
  clearMediaFilePath: () => void;
  foo: () => void;
  url: () => string;
}
export const useAppStore = create<AppState>((set) => ({
  mediaFilePath: null as unknown as Blob,
  clearMediaFilePath: () => set({ mediaFilePath: null as unknown as Blob }),
  addMediaFilePath: (mediaFilePath) => set(() => ({ mediaFilePath })),
  url() {
    return URL.createObjectURL(this.mediaFilePath);
  },
  foo: () => set((state) => ({ mediaFilePath: state.mediaFilePath }))
}));
