import { Types } from "mongoose";
// types/index.ts

// Weather Interface
export interface Weather {
  location: string;
  tempRange: string;
  description: string;
  condition: string;
  highTemp: string;
  lowTemp: string;
  wind: string;
  humidity: string;
  chanceRain: string;
}

// Item Interface
export interface Item {
  name: string;
  qty?: number;
  checked?: boolean;
  eco?: boolean;
}

// Category Interface
export interface Category {
  name: string;
  items: Item[];
  _id: Types.ObjectId;
}

// Category Items Type
export type CategoryItems = {
  [key: string]: Item[];
};

// Trip Interface
export interface Trip {
  _id?: string;
  ownerUid: string;
  title: string;
  type: "Solo" | "Couple" | "Family" | "Group";
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  passengers: {
    adults: number;
    children: number;
    total: number;
  };
  budget: number;
  weather: Weather;
  packingLists?: Array<{ id: string; title: string; itemsCount: number }>;
}
// Packing List Interface
export interface PackingList {
  _id?: {type: Types.ObjectId, required:false};
  tripId?: string | Types.ObjectId;
  ownerUid: string;
  title: string;
  categories: {
    name: 'Clothing' | 'Toiletries' | 'Electronics' | 'Documents' | 'Miscellaneous';
    items: Item[];
  }[];
} 
export interface Product {
  _id?: {type: Types.ObjectId, required:false};
  name: string;
  category: string;
  eco: number; // 1-5
  description: string;
  availableLocation: string;
  createdAt?: string;
  updatedAt?: string;
}

// Store Types
export interface ChecklistStore {
  checklistCats: CategoryItems;
  removedItems: string[];
  newInputs: { [key: string]: string };
  activeCategory: string | null;
  setChecklistCats: (categories: CategoryItems) => void;
  setRemovedItems: (items: string[]) => void;
  setNewInputs: (inputs: { [key: string]: string }) => void;
  setActiveCategory: (category: string | null) => void;
  checkAllCategory: (category: string) => void;
  uncheckAllCategory: (category: string) => void;
  toggleItem: (category: string, itemName: string, checked: boolean) => void;
  addItem: (category: string, item: Item) => void;
  removeItem: (category: string, itemName: string) => void;
}

export interface TripStore {
  trips: Trip[];
  selectedTripId: string;
  loading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  setSelectedTripId: (id: string) => void;
}

export interface PackingListStore {
  lists: PackingList[];
  selectedListId: string;
  loading: boolean;
  error: string | null;
  fetchPackingLists: (tripId: string) => Promise<void>;
  setSelectedListId: (id: string) => void;
}

export interface SmartSuggestionsStore {
  smartCats: CategoryItems;
  smartRemoved: string[];
  setSmartCats: (cats: CategoryItems) => void;
  setSmartRemoved: (removed: string[]) => void;
  addSmartSuggestionToChecklist: (category: string, item: Item, checklistCats: CategoryItems) => CategoryItems;
  removeSmartSuggestion: (label: string) => void;
}

export interface UIStore {
  activeTab: 'weather' | 'checklist' | 'smart';
  setActiveTab: (tab: 'weather' | 'checklist' | 'smart') => void;
}