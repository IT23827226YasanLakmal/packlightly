import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  role: 'user' | 'admin';
  disabled: boolean;
  providerData?: unknown[];
  lastLoginAt?: string;
  createdAt?: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (user: Omit<User, '_id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  patchUser: (id: string, partial: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      set({ users: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },
  createUser: async (user) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(user),
      });
      await useUserStore.getState().fetchUsers();
      set({ loading: false });
    } catch {
      set({ error: 'Failed to create user', loading: false });
    }
  },
  updateUser: async (user) => {
    set({ loading: true, error: null });
    try {
      // Only send allowed fields for update
  const allowed = ['displayName', 'photoURL', 'phoneNumber', 'role', 'bio', 'preferences'];
  const filtered: Record<string, unknown> = {};
      for (const key of allowed) {
        if (user[key as keyof typeof user] !== undefined) {
          filtered[key] = user[key as keyof typeof user];
        }
      }
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}`, {
        method: 'PUT',
        body: JSON.stringify(filtered),
      });
      await useUserStore.getState().fetchUsers();
      set({ loading: false });
    } catch {
      set({ error: 'Failed to update user', loading: false });
    }
  },
  patchUser: async (id, partial) => {
    set({ loading: true, error: null });
    try {
      // Only send allowed fields for patch
  const allowed = ['displayName', 'photoURL', 'phoneNumber', 'role', 'bio', 'preferences'];
  const filtered: Record<string, unknown> = {};
      for (const key of allowed) {
        if (partial[key as keyof typeof partial] !== undefined) {
          filtered[key] = partial[key as keyof typeof partial];
        }
      }
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(filtered),
      });
      await useUserStore.getState().fetchUsers();
      set({ loading: false });
    } catch {
      set({ error: 'Failed to patch user', loading: false });
    }
  },
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      await useUserStore.getState().fetchUsers();
      set({ loading: false });
    } catch {
      set({ error: 'Failed to delete user', loading: false });
    }
  },
}));
