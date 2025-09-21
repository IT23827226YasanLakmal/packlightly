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
  createPost: (post: Partial<Post>, imageFile?: File) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>, imageFile?: File) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, text: string, user?: string) => Promise<void>;
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

  createPost: async (post, imageFile) => {
    set({ loading: true, error: null });
    try {
      const postData: Partial<Post> = { ...post };

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        alert('Uploading image...');
        const imageRes = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        console.log('Image upload response:', imageRes);
        alert('Image upload response: ' + JSON.stringify(imageRes));
        if (imageRes && imageRes.url) {
          postData.imageUrl = imageRes.url;
        } else {
          alert('Image upload failed or did not return a url: ' + JSON.stringify(imageRes));
          console.error('Image upload failed or did not return a url:', imageRes);
        }
      }

      if (!postData.imageUrl && imageFile) {
        alert('Image upload failed, post not created');
        set({ error: 'Image upload failed, post not created', loading: false });
        return;
      }

      console.log('Creating post with data:', postData);
      alert('Creating post with data: ' + JSON.stringify(postData));
      const postRes = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      alert('Post creation response: ' + JSON.stringify(postRes));

      await get().fetchPosts();
    } catch (err) {
      alert('Failed to create post: ' + err);
      console.error('Failed to create post:', err);
      set({ error: 'Failed to create post', loading: false });
    }
  },

  updatePost: async (id, post, imageFile) => {
    set({ loading: true, error: null });
    try {
      const postData: Partial<Post> = { ...post };

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const imageRes = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formData, 
        });
        postData.imageUrl = imageRes.url;
      }

  await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
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
}));
