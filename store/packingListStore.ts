"use client";

import { fetcherWithToken, getToken } from '@/utils/fetcher';
import { create } from "zustand";
import { PackingList } from "@/types/index";

interface PackingListStore {
  packingLists: PackingList[];
  loading: boolean;
  error: string | null;

  // Actions
  selectedPackingListId: string;
  fetchPackingLists: () => Promise<void>;
  setSelectedPackingListId: (id: string) => void;
  addPackingList: (packingList: Partial<PackingList>) => Promise<void>;
  deletePackingList: (listId: string) => Promise<void>;
  generatePackingListForTrip: (tripId: string) => Promise<void>;
}


export const usePackingListStore = create<PackingListStore>((set) => ({
  addPackingList: async (packingList) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packinglists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packingList),
      });
      // Refresh list after add
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/packinglists`);
      set({ packingLists: data, loading: false });
    } catch {
      set({ error: 'Failed to add packing list', loading: false });
    }
  },
  generatePackingListForTrip: async (tripId: string) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packinglists/${tripId}/ai-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to generate packing list');
      const generatedList = await response.json();
      set((state) => ({
        packingLists: [...state.packingLists, generatedList],
        loading: false,
      }));
    } catch {
      set({ error: 'Failed to generate packing list', loading: false });
    }
  },

  deletePackingList: async (listId) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packinglists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete packing list: ${response.status} ${response.statusText}`);
      }
      
      // Optimistically remove from local state instead of refetching
      set((state) => ({
        packingLists: state.packingLists.filter(list => 
          (list._id?.toString() || '') !== listId
        ),
        loading: false,
      }));
    } catch (error) {
      console.error('Delete packing list error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete packing list', 
        loading: false 
      });
    }
  },
  packingLists: [],
  loading: false,
  error: null,
  selectedPackingListId: '',

  fetchPackingLists: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/packinglists`);
      set({ packingLists: data, loading: false });
    } catch {
      set({ error: 'Failed to fetch packing lists', loading: false });
    }
  },

  setSelectedPackingListId: (id: string) => set({ selectedPackingListId: id }),
  
}));
