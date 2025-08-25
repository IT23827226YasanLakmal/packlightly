import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Item {
  name: string;
  qty?: number;
  checked?: boolean;
  eco?: boolean;
}

interface ChecklistState {
  // State
  checklistCats: Record<string, Item[]>;
  removedItems: string[];
  newInputs: Record<string, string>;
  activeCategory: string;
  savingStatus: Record<string, 'saving' | 'saved' | 'error'>;
  
  // Actions
  setChecklistCats: (checklistCats: Record<string, Item[]>) => void;
  setRemovedItems: (removedItems: string[]) => void;
  setNewInputs: (newInputs: Record<string, string>) => void;
  setActiveCategory: (activeCategory: string) => void;
  setSavingStatus: (savingStatus: Record<string, 'saving' | 'saved' | 'error'>) => void;
  
  // Item actions
  addItem: (category: string, item: Item) => void;
  removeItem: (category: string, itemName: string) => void;
  toggleItem: (category: string, itemName: string, checked: boolean) => void;
  updateItem: (category: string, itemName: string, updates: Partial<Item>) => void;
  checkAllCategory: (category: string) => void;
  uncheckAllCategory: (category: string) => void;
  
  // API actions
  saveToServer: (listId: string, category: string) => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      // Initial state
      checklistCats: {},
      removedItems: [],
      newInputs: {},
      activeCategory: '',
      savingStatus: {},
      
      // Setters
      setChecklistCats: (checklistCats) => set({ checklistCats }),
      setRemovedItems: (removedItems) => set({ removedItems }),
      setNewInputs: (newInputs) => set({ newInputs }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSavingStatus: (savingStatus) => set({ savingStatus }),
      
      // Item actions
      addItem: (category, item) => {
        const { checklistCats } = get();
        const currentItems = checklistCats[category] || [];
        
        // Check if item already exists
        if (currentItems.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
          return;
        }
        
        set({
          checklistCats: {
            ...checklistCats,
            [category]: [...currentItems, item]
          }
        });
      },
      
      removeItem: (category, itemName) => {
        const { checklistCats, removedItems } = get();
        const currentItems = checklistCats[category] || [];
        
        set({
          checklistCats: {
            ...checklistCats,
            [category]: currentItems.filter(i => i.name !== itemName)
          },
          removedItems: [...removedItems.filter(name => name !== itemName)]
        });
      },
      
      toggleItem: (category, itemName, checked) => {
        const { checklistCats } = get();
        const currentItems = checklistCats[category] || [];
        
        set({
          checklistCats: {
            ...checklistCats,
            [category]: currentItems.map(item =>
              item.name === itemName ? { ...item, checked } : item
            )
          }
        });
      },
      
      updateItem: (category, itemName, updates) => {
        const { checklistCats } = get();
        const currentItems = checklistCats[category] || [];
        
        set({
          checklistCats: {
            ...checklistCats,
            [category]: currentItems.map(item =>
              item.name === itemName ? { ...item, ...updates } : item
            )
          }
        });
      },
      
      checkAllCategory: (category) => {
        const { checklistCats } = get();
        const currentItems = checklistCats[category] || [];
        
        set({
          checklistCats: {
            ...checklistCats,
            [category]: currentItems.map(item => ({ ...item, checked: true }))
          }
        });
      },
      
      uncheckAllCategory: (category) => {
        const { checklistCats } = get();
        const currentItems = checklistCats[category] || [];
        
        set({
          checklistCats: {
            ...checklistCats,
            [category]: currentItems.map(item => ({ ...item, checked: false }))
          }
        });
      },
      
      // API action
      saveToServer: async (listId, category) => {
        const { checklistCats, setSavingStatus, savingStatus } = get();
        const items = checklistCats[category] || [];
        
        // Update saving status
        setSavingStatus({ ...savingStatus, [category]: 'saving' });
        
        try {
            const response = await fetch(`http://localhost:5000/api/packinglists/?id=${encodeURIComponent(listId)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              category,
              items
            })
            });
          
          if (!response.ok) throw new Error('Failed to update items');
          
          // Update saving status to success
          setSavingStatus({ ...savingStatus, [category]: 'saved' });
          
          // Clear saved status after 2 seconds
          setTimeout(() => {
            const { savingStatus: currentStatus } = get();
            const { [category]: _, ...rest } = currentStatus;
            setSavingStatus(rest);
          }, 2000);
          
        } catch (error) {
          console.error('Error updating items:', error);
          setSavingStatus({ ...savingStatus, [category]: 'error' });
        }
      }
    }),
    {
      name: 'checklist-storage', // name of the item in the storage (must be unique)
      // You can also partialize the state to only persist certain parts
      // partialize: (state) => ({ checklistCats: state.checklistCats, removedItems: state.removedItems }),
    }
  )
);