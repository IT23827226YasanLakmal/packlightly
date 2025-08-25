import { create } from 'zustand';
import { fetcherWithToken } from '@/utils/fetcher';
import { PackingList } from '@/types'; // You should create proper types

interface PackingListStore {
  lists: PackingList[];
  selectedListId: string;
  loading: boolean;
  error: string | null;
  fetchPackingLists: (tripId: string) => Promise<void>;
  setSelectedListId: (id: string) => void;
}

export const usePackingListStore = create<PackingListStore>((set) => ({
  lists: [],
  selectedListId: '',
  loading: false,
  error: null,
  
  fetchPackingLists: async (tripId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken('http://localhost:5000/api/packinglists');
      const filteredLists = data.filter((pl: PackingList) => pl.tripId?.toString() === tripId);
      set({ lists: filteredLists, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch packing lists', loading: false });
    }
  },
  
  setSelectedListId: (id: string) => set({ selectedListId: id }),
}));