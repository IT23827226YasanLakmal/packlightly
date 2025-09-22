// /store/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  activeTab: 'weather' | 'checklist' | 'smart';
  setActiveTab: (tab: 'weather' | 'checklist' | 'smart') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'weather',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));