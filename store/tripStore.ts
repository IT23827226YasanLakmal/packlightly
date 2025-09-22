import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';
import { Trip } from '@/types'; // You should create proper types

interface TripStore {
  trips: Trip[];
  selectedTripId: string;
  loading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  setSelectedTripId: (id: string) => void;
  createTrip: (trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  updateTrip: (tripId: string, updates: Partial<Trip>) => Promise<void>;
}

export const useTripStore = create<TripStore>((set, get) => ({
  updateTrip: async (tripId: string, updates: Partial<Trip>) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      // Fetch updated trips list
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/trips`);
      set({ trips: data, loading: false });
    } catch {
      set({ error: 'Failed to update trip', loading: false });
    }
  },
  deleteTrip: async (tripId: string) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/trips/${tripId}`, {
        method: 'DELETE',
      });
      // Fetch updated trips list
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/trips`);
      set({ trips: data, loading: false });
    } catch {
      set({ error: 'Failed to delete trip', loading: false });
    }
  },
  createTrip: async (trip) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
        method: 'POST',
        body: JSON.stringify(trip),
      });
      // Fetch updated trips list
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/trips`);
      set({ trips: data, loading: false });
    } catch {
      set({ error: 'Failed to create trip', loading: false });
    }
  },
  trips: [],
  selectedTripId: '',
  loading: false,
  error: null,
  
  fetchTrips: async () => {
    set((state: TripStore) => {
      // If trips already loaded, skip fetch
      if (state.trips && state.trips.length > 0) {
        return { loading: false };
      }
      return { loading: true, error: null };
    });
    // Only fetch if not cached
    const current = useTripStore.getState();
    if (current.trips && current.trips.length > 0) return;
    try {
      const data = await fetcherWithToken('http://localhost:5000/api/trips');
      set({ trips: data, loading: false });
    } catch {
      set({ error: 'Failed to fetch trips', loading: false });
    }
  },
  
  setSelectedTripId: (id: string) => set({ selectedTripId: id }),
}));