import { create } from 'zustand';
import { CategoryItems, Item } from '@/types'; // You should create proper types

interface SmartSuggestionsStore {
  smartCats: CategoryItems;
  smartRemoved: string[];
  setSmartCats: (cats: CategoryItems) => void;
  setSmartRemoved: (removed: string[]) => void;
  addSmartSuggestionToChecklist: (category: string, item: Item, checklistCats: CategoryItems) => void;
  removeSmartSuggestion: (label: string) => void;
}

export const useSmartSuggestionsStore = create<SmartSuggestionsStore>((set, get) => ({
  smartCats: { Essentials: [], Clothing: [], Toiletries: [], Electronics: [] },
  smartRemoved: [],
  
  setSmartCats: (cats: CategoryItems) => set({ smartCats: cats }),
  
  setSmartRemoved: (removed: string[]) => set({ smartRemoved: removed }),
  
  addSmartSuggestionToChecklist: (category: string, item: Item, checklistCats: CategoryItems) => {
    const currentChecklist = { ...checklistCats };
    
    if (!currentChecklist[category]) {
      currentChecklist[category] = [];
    }
    
    const itemExists = currentChecklist[category].some(
      (i: Item) => i.name.toLowerCase() === item.name.toLowerCase()
    );
    
    if (!itemExists) {
      currentChecklist[category].push(item);
      // You might want to update the checklist store here
      // or return the updated checklist to be used in the component
    }
    
    return currentChecklist;
  },
  
  removeSmartSuggestion: (label: string) => {
    set((state) => ({
      smartRemoved: state.smartRemoved.includes(label) 
        ? state.smartRemoved 
        : [...state.smartRemoved, label]
    }));
  },
}));