import { create } from "zustand";
import { fetcherWithToken, fetcherWithTokenConfig } from "@/utils/fetcher";

// ===================
// Types
// ===================
export interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: "Draft" | "Published";
  date: string;
  comments: Comment[];
  imageUrl: string;
}

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  createPost: (post: Partial<Post>) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;

  addComment: (postId: number, text: string) => Promise<void>;
}

// ===================
// Store
// ===================
export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  // Fetch all posts
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      set({ posts: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch posts", loading: false });
    }
  },

  // Create a new post
  createPost: async (post) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        body: JSON.stringify(post),
      });
      await get().fetchPosts(); // Refresh posts
    } catch {
      set({ error: "Failed to create post", loading: false });
    }
  },

  // Update existing post
  updatePost: async (id, post) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(post),
      });
      await get().fetchPosts(); // Refresh posts
    } catch {
      set({ error: "Failed to update post", loading: false });
    }
  },

  // Delete a post
  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "DELETE",
      });
      set({ posts: get().posts.filter(p => p.id !== id), loading: false });
    } catch {
      set({ error: "Failed to delete post", loading: false });
    }
  },

  // Add a comment to a post
  addComment: async (postId, text) => {
    if (!text) return;
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      await get().fetchPosts(); // Refresh posts with new comment
    } catch {
      set({ error: "Failed to add comment", loading: false });
    }
  },
}));
