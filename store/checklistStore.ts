import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToken } from '@/utils/fetcher';

export interface Item {
  name: string;
  qty?: number;
  checked?: boolean;
  eco?: boolean;
}

export interface Category {
  name: string;
  items: Item[];
}

// New interfaces for AI suggestions API response
interface AISuggestionItem {
  name: string;
  qty: number;
  checked: boolean;
  eco: boolean;
}

interface AISuggestionCategory {
  category: string;
  items: AISuggestionItem[];
}

interface AISuggestionsData {
  packingListId: string;
  tripId: string;
  tripDestination: string;
  suggestions: {
    title: string;
    categories: AISuggestionCategory[];
  };
  generatedAt: string;
}

interface AISuggestionsResponse {
  success: boolean;
  data: AISuggestionsData;
  message: string;
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
  // New method to load from server
  loadFromServer: (listId: string) => Promise<void>;
  // AI suggestions method
  getAISuggestions: (listId: string) => Promise<Record<string, Item[]>>;
  // Merge AI suggestions with existing checklist
  mergeAISuggestions: (aiSuggestions: Record<string, Item[]>) => void;
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

      // Item actions (same as before)
      addItem: (category, item) => {
        const { checklistCats } = get();
        const currentItems = checklistCats[category] || [];

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
          removedItems: [...removedItems, itemName] // Add to removed items
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

      // Updated API action
      saveToServer: async (listId, category) => {
        const { checklistCats, setSavingStatus, savingStatus } = get();
        const items = checklistCats[category] || [];

        // Update saving status
        setSavingStatus({ ...savingStatus, [category]: 'saving' });

        try {
          const token = await getToken();
          const response = await fetch(`http://localhost:5000/api/packinglists/${listId}/category/${category}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server returned ${response.status}`);
          }

          // Update saving status to success
          setSavingStatus({ ...savingStatus, [category]: 'saved' });

          // Clear saved status after 2 seconds
          setTimeout(() => {
            const { savingStatus: currentStatus } = get();
            const rest = Object.fromEntries(
              Object.entries(currentStatus).filter(([key]) => key !== category)
            );
            setSavingStatus(rest);
          }, 2000);

        } catch (error) {
          console.error('Error updating items:', error);
          setSavingStatus({ ...savingStatus, [category]: 'error' });

          // Auto-retry after 5 seconds on error
          setTimeout(() => {
            const { savingStatus: currentStatus } = get();
            if (currentStatus[category] === 'error') {
              get().saveToServer(listId, category);
            }
          }, 5000);
        }
      },

      // New method to load from server
      loadFromServer: async (listId) => {
        try {
          const token = await getToken();
          const response = await fetch(`http://localhost:5000/api/packinglists/${listId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) throw new Error('Failed to load packing list');

          const packingList = await response.json();

          // Transform the data to match our store structure
          const checklistCats: Record<string, Item[]> = {};

          packingList.categories.forEach((category: Category) => {
            checklistCats[category.name] = category.items;
          });

          set({ checklistCats, removedItems: [] });

        } catch (error) {
          console.error('Error loading packing list:', error);
          throw error;
        }
      },

      // AI suggestions method
      getAISuggestions: async (listId) => {
        try {
          const token = await getToken();
          console.log('🤖 Fetching AI suggestions for packing list:', listId);
          const response = await fetch(`http://localhost:5000/api/packinglists/${listId}/ai-suggestions`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('🌐 AI Suggestions Response Status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ API Error Details:', {
              status: response.status,
              statusText: response.statusText,
              errorData
            });
            throw new Error(errorData.error || `Failed to get AI suggestions: ${response.status} ${response.statusText}`);
          }

          const suggestionsResponse: AISuggestionsResponse = await response.json();
          console.log('🔍 Backend AI Response:', suggestionsResponse);
          
          // Handle the new API response format
          if (!suggestionsResponse.success) {
            throw new Error(suggestionsResponse.message || 'AI suggestions request failed');
          }

          const { data } = suggestionsResponse;
          if (!data || !data.suggestions || !data.suggestions.categories) {
            throw new Error('Invalid response format: missing suggestions data');
          }

          console.log('📦 Processing suggestions for trip:', data.tripDestination);
          console.log('📋 Title:', data.suggestions.title);
          console.log('🏷️ Categories found:', data.suggestions.categories.length);

          // Transform the AI suggestions to match our store structure
          const aiSuggestions: Record<string, Item[]> = {};
          
          data.suggestions.categories.forEach((category: AISuggestionCategory, index: number) => {
            console.log(`🏷️ Processing category ${index + 1}:`, category.category);
            console.log(`📝 Items count:`, category.items?.length || 0);
            
            if (category.category && category.items && Array.isArray(category.items)) {
              const categoryName = category.category;
              aiSuggestions[categoryName] = category.items.map((item: AISuggestionItem) => ({
                name: item.name,
                qty: item.qty || 1,
                checked: false, // Always start unchecked for UI
                eco: item.eco || false
              }));
              
              console.log(`✅ Transformed category "${categoryName}":`, aiSuggestions[categoryName].length, 'items');
              console.log(`📋 Sample items:`, aiSuggestions[categoryName].slice(0, 2));
            } else {
              console.warn(`⚠️ Skipping invalid category ${index}:`, category);
            }
          });

          console.log('🎯 Final AI Suggestions:', {
            totalCategories: Object.keys(aiSuggestions).length,
            categories: Object.keys(aiSuggestions),
            totalItems: Object.values(aiSuggestions).reduce((total, items) => total + items.length, 0)
          });

          return aiSuggestions;

        } catch (error) {
          console.error('❌ Error getting AI suggestions:', error);
          throw error;
        }
      },

      // Merge AI suggestions with existing checklist
      mergeAISuggestions: (aiSuggestions) => {
        const { checklistCats } = get();
        const mergedCats: Record<string, Item[]> = { ...checklistCats };

        Object.keys(aiSuggestions).forEach(categoryName => {
          const existingItems = mergedCats[categoryName] || [];
          const suggestedItems = aiSuggestions[categoryName] || [];
          
          // Filter out suggestions that already exist (case-insensitive)
          const newItems = suggestedItems.filter(suggestedItem => 
            !existingItems.some(existingItem => 
              existingItem.name.toLowerCase() === suggestedItem.name.toLowerCase()
            )
          );

          // Add new items to the category
          mergedCats[categoryName] = [...existingItems, ...newItems];
        });

        set({ checklistCats: mergedCats });
      }
    }),
    {
      name: 'checklist-storage',
    }
  )
);