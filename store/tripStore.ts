import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';
import { Trip } from '@/types'; // You should create proper types

interface TripStore {
  trips: Trip[];
  selectedTripId: string;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalTrips: number;
  tripsPerPage: number;
  fetchTrips: (page?: number, limit?: number) => Promise<void>;
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
      // Refresh with current pagination settings
      const { currentPage, tripsPerPage } = get();
      await get().fetchTrips(currentPage, tripsPerPage);
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
      // Refresh with current pagination settings, handling edge case of empty page
      const { currentPage, tripsPerPage, trips } = get();
      const updatedTrips = trips.filter(trip => trip._id !== tripId);
      const shouldGoToPreviousPage = updatedTrips.length === 0 && currentPage > 1;
      const targetPage = shouldGoToPreviousPage ? currentPage - 1 : currentPage;
      await get().fetchTrips(targetPage, tripsPerPage);
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
      // Go to page 1 after creating a new trip
      const { tripsPerPage } = get();
      await get().fetchTrips(1, tripsPerPage);
    } catch {
      set({ error: 'Failed to create trip', loading: false });
    }
  },
  trips: [],
  selectedTripId: '',
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalTrips: 0,
  tripsPerPage: 10,
  
  fetchTrips: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/trips?page=${page}&limit=${limit}`);
      
      // Handle both paginated and non-paginated responses
      let trips: Trip[] = [];
      let totalPages = 1;
      let totalTrips = 0;
      
      if (Array.isArray(response)) {
        // Non-paginated response (fallback)
        trips = response;
        totalTrips = trips.length;
        totalPages = Math.ceil(totalTrips / limit);
      } else if (response && typeof response === 'object') {
        // Paginated response
        trips = response.trips || response.data || [];
        totalPages = response.totalPages || Math.ceil((response.total || trips.length) / limit);
        totalTrips = response.total || trips.length;
      }
      
      set({ 
        trips, 
        loading: false,
        currentPage: page,
        totalPages,
        totalTrips,
        tripsPerPage: limit
      });
    } catch {
      set({ error: 'Failed to fetch trips', loading: false });
    }
  },
  
  setSelectedTripId: (id: string) => set({ selectedTripId: id }),
}));