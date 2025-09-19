// stores/postStore.ts
import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';

// Types
export interface Comment {
  user: string;
  avatar: string;
  time: string;
  content: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'Draft' | 'Published';
  tags: string[];
  comments: Comment[];
  imageUrl: string;
  lastEdited: string;
}

interface PostStore {
  posts: Post[];
  selectedPostId: number | null;
  loading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  setSelectedPostId: (id: number | null) => void;
  createPost: (post: Partial<Post>) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  selectedPostId: null,
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      set({ posts: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },

  setSelectedPostId: (id) => set({ selectedPostId: id }),

  createPost: async (post) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
      });
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      set({ posts: data, loading: false });
    } catch {
      set({ error: 'Failed to create post', loading: false });
    }
  },

  updatePost: async (id, post) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
      });
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      set({ posts: data, loading: false });
    } catch {
      set({ error: 'Failed to update post', loading: false });
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      set({ posts: data, loading: false });
    } catch {
      set({ error: 'Failed to delete post', loading: false });
    }
  },
}));
