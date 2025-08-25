import { create } from 'zustand';
import { fetcherWithToken } from '@/utils/fetcher';
import { Trip } from '@/types'; // You should create proper types

interface TripStore {
  trips: Trip[];
  selectedTripId: string;
  loading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  setSelectedTripId: (id: string) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  selectedTripId: '',
  loading: false,
  error: null,
  
  fetchTrips: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken('http://localhost:5000/api/trips');
      set({ trips: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch trips', loading: false });
    }
  },
  
  setSelectedTripId: (id: string) => set({ selectedTripId: id }),
}));