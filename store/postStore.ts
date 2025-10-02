// store/postStore.ts
import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';
import { Post, Comment } from '@/types';

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  fetchMyPosts: () => Promise<void>;
  createPost: (post: Partial<Post>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, text: string, user?: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data: Post[] = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      set({ posts: data, loading: false });
    } catch {
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },

  fetchMyPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data: Post[] = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts/my`);
      set({ posts: data, loading: false });
    } catch {
      set({ error: 'Failed to fetch your posts', loading: false });
    }
  },

  createPost: async (post) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
      });

      await get().fetchPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
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

      await get().fetchPosts();
    } catch {
      set({ error: 'Failed to update post', loading: false });
    }
  },

  deletePost: async (id) => {
    if (!id) {
      set({ error: 'Invalid post ID for deletion', loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
        set({ posts: get().posts.filter(p => p._id !== id), loading: false });
    } catch {
      set({ error: 'Failed to delete post', loading: false });
    }
  },

  addComment: async (postId, text, user = 'Anonymous') => {
    set({ loading: true, error: null });
    try {
      const comment: Partial<Comment> = { text, user };
  await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
      });
      await get().fetchPosts();
    } catch {
      set({ error: 'Failed to add comment', loading: false });
    }
  },

  toggleLike: async (postId) => {
    try {
      // Optimistic update
      const currentPosts = get().posts;
      const updatedPosts = currentPosts.map(post => {
        if (post._id === postId) {
          const currentLikes = post.likeCount || 0;
          return {
            ...post,
            likeCount: currentLikes + 1 // For now, just increment
          };
        }
        return post;
      });
      set({ posts: updatedPosts });

      // API call - adjust endpoint based on your API
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
        method: 'POST',
      });
      
      // Refresh posts to get the latest data
      await get().fetchPosts();
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      await get().fetchPosts();
      set({ error: 'Failed to like post' });
    }
  },
}));
