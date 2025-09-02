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

  deletePackingList: async (listId) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packinglists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh list after delete
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/packinglists`);
      set({ packingLists: data, loading: false });
    } catch {
      set({ error: 'Failed to delete packing list', loading: false });
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
