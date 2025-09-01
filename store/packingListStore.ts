"use client";

import { create } from "zustand";
import { PackingList } from "@/types/index";
import { Types } from "mongoose";

interface PackingListStore {
  packingLists: PackingList[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchPackingLists: (tripId: string) => Promise<void>;
  addPackingList: (tripId: string, title: string, categories?: PackingList["categories"]) => void;
  updatePackingList: (listId: string, updatedList: Partial<PackingList>) => void;
  deletePackingList: (listId: string) => void;
  resetStore: () => void;
}

export const usePackingListStore = create<PackingListStore>((set) => ({
  packingLists: [],
  loading: false,
  error: null,

  fetchPackingLists: async (tripId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const data: PackingList[] = JSON.parse(localStorage.getItem("packingLists") || "[]")
        .filter((p: PackingList) => p.tripId?.toString() === tripId);

      set({ packingLists: data, loading: false });
    } catch (err: unknown) {
      set({ error: (err as Error).message || "Failed to fetch packing lists", loading: false });
    }
  },

  addPackingList: (tripId, title, categories) => {
    const newList: PackingList = {
      tripId: new Types.ObjectId(tripId),
      ownerUid: "currentUser", // replace with real user UID
      title,
      categories: categories || [
        { name: "Clothing", items: [] },
        { name: "Toiletries", items: [] },
        { name: "Electronics", items: [] },
        { name: "Documents", items: [] },
        { name: "Miscellaneous", items: [] },
      ],
    };

    set((state) => {
      const updated = [...state.packingLists, newList];
      localStorage.setItem("packingLists", JSON.stringify(updated));
      return { packingLists: updated };
    });
  },

  updatePackingList: (listId, updatedList) => {
    set((state) => {
      const updated = state.packingLists.map((list) =>
        (list as PackingList)._id?.toString() === listId ? { ...list, ...updatedList } : list
      );
      localStorage.setItem("packingLists", JSON.stringify(updated));
      return { packingLists: updated };
    });
  },

  deletePackingList: (listId) => {
    set((state) => {
      const updated = state.packingLists.filter((list) => (list as PackingList)._id?.toString() !== listId);
      localStorage.setItem("packingLists", JSON.stringify(updated));
      return { packingLists: updated };
    });
  },

  resetStore: () => set({ packingLists: [], loading: false, error: null }),
}));
