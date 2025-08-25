// types/index.ts
import { Types } from "mongoose";

// Weather Condition Types

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
  _id: Types.ObjectId;
  title: string;
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  ownerUid: string;
  weather: Weather;
}

// Packing List Interface
export interface PackingList {
  _id?: Types.ObjectId;
  tripId?: Types.ObjectId;
  ownerUid: string;
  title: string;
  categories: {
    name: "Clothing" | "Essentials" | "Toiletries" | "Electronics";
    items: Item[];
    _id: Types.ObjectId;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
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