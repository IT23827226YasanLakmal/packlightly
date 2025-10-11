// store/postStore.ts
import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';
import { Post, Comment } from '@/types';

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  likingPosts: Set<string>; // Track which posts are currently being liked/unliked

  fetchPosts: () => Promise<void>;
  fetchMyPosts: () => Promise<void>;
  createPost: (post: Partial<Post>, refreshFn?: () => Promise<void>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>, refreshFn?: () => Promise<void>) => Promise<void>;
  deletePost: (id: string, refreshFn?: () => Promise<void>) => Promise<void>;
  addComment: (postId: string, text: string, user?: string) => Promise<void>;
  toggleLike: (postId: string, userId?: string) => Promise<void>;
  isLikingPost: (postId: string) => boolean;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  likingPosts: new Set<string>(),

  isLikingPost: (postId: string) => {
    return get().likingPosts.has(postId);
  },

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data: Post[] = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      
      // Ensure all posts have the required fields for the like functionality
      const sanitizedPosts = (data || []).map(post => ({
        ...post,
        title: post.title || '', // Ensure title is always a string
        description: post.description || '', // Ensure description is always a string
        tags: post.tags || [], // Ensure tags is always an array
        likedBy: post.likedBy || [], // Ensure likedBy is always an array
        likeCount: post.likeCount || 0, // Ensure likeCount is always a number
        comments: post.comments || [] // Ensure comments is always an array
      })).filter(post => post.title && post.description); // Filter out posts without title/description
      
      console.log('PostStore: Fetched and sanitized posts:', sanitizedPosts);
      set({ posts: sanitizedPosts, loading: false });
    } catch (error) {
      console.error('PostStore: Failed to fetch posts:', error);
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

  createPost: async (post, refreshFn) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
      });

      // Use the provided refresh function or default to fetchPosts
      const refresh = refreshFn || get().fetchPosts;
      await refresh();
    } catch (err) {
      console.error('Failed to create post:', err);
      set({ error: 'Failed to create post', loading: false });
    }
  },

  updatePost: async (id, post, refreshFn) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
      });

      // Use the provided refresh function or default to fetchPosts
      const refresh = refreshFn || get().fetchPosts;
      await refresh();
    } catch {
      set({ error: 'Failed to update post', loading: false });
    }
  },

  deletePost: async (id, refreshFn) => {
    if (!id) {
      set({ error: 'Invalid post ID for deletion', loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      
      // If a refresh function is provided, use it, otherwise just remove from local state
      if (refreshFn) {
        await refreshFn();
      } else {
        set({ posts: get().posts.filter(p => p._id !== id), loading: false });
      }
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

  toggleLike: async (postId, userId) => {
    if (!userId) {
      console.error('No user ID provided for like operation');
      set({ error: 'User ID required for liking posts' });
      return;
    }

    if (!postId) {
      console.error('No post ID provided for like operation');
      set({ error: 'Post ID required for liking posts' });
      return;
    }

    // Check if this post is already being liked/unliked
    const currentLikingPosts = get().likingPosts;
    if (currentLikingPosts.has(postId)) {
      console.log('Post is already being liked/unliked, ignoring request');
      return;
    }

    console.log('Toggling like for post:', postId, 'by user:', userId);

    // Add to liking posts set
    const newLikingPosts = new Set(currentLikingPosts);
    newLikingPosts.add(postId);
    set({ likingPosts: newLikingPosts, error: null });

    try {
      // First, check current like status
      const likeStatusResponse = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like-status`);
      const { hasLiked } = likeStatusResponse;
      
      console.log('Current like status from server:', hasLiked);

      let updatedPost;
      
      if (hasLiked) {
        // User has liked the post, so unlike it
        console.log('Unliking post...');
        updatedPost = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/unlike`, {
          method: 'POST',
        });
      } else {
        // User hasn't liked the post, so like it
        console.log('Liking post...');
        updatedPost = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
          method: 'POST',
        });
      }

      // Update the local state with the response from the server
      if (updatedPost) {
        const currentPosts = get().posts;
        const updatedPosts = currentPosts.map(post => 
          post._id === postId ? { ...post, ...updatedPost } : post
        );
        
        set({ posts: updatedPosts });
        console.log('Post updated successfully:', updatedPost);
      }
      
    } catch (error: unknown) {
      console.error('Error toggling like:', error);
      
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes('400')) {
        if (errorMessage.includes('already liked')) {
          set({ error: 'You have already liked this post' });
        } else if (errorMessage.includes('not liked')) {
          set({ error: 'You have not liked this post yet' });
        } else {
          set({ error: 'Invalid like operation' });
        }
      } else {
        set({ error: 'Failed to update like status' });
      }
    } finally {
      // Remove from liking posts set
      const currentLikingPostsAfter = get().likingPosts;
      const newLikingPostsAfter = new Set(currentLikingPostsAfter);
      newLikingPostsAfter.delete(postId);
      set({ likingPosts: newLikingPostsAfter });
    }
  },
}));
