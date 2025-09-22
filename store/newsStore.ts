import { create } from "zustand";
import { fetcherWithToken, fetcherWithTokenConfig } from "@/utils/fetcher";
import { NewsArticle } from "@/types";

interface NewsStore {
  news: NewsArticle[];
  loading: boolean;
  error: string | null;
  fetchNews: () => Promise<void>;
  createNews: (article: Partial<NewsArticle>) => Promise<void>;
  updateNews: (id: string, article: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
}

export const useNewsStore = create<NewsStore>((set) => ({
  news: [],
  loading: false,
  error: null,

fetchNews: async () => {
  set({ loading: true, error: null });
  try {
    const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/news`);
    
    // response has { success, news }
    const articles = Array.isArray(response.news) ? response.news : [];
    
    // Convert _id to string for React
    const normalized = articles.map((n: NewsArticle) => ({ ...n, _id: n._id?.toString() }));

    set({ news: normalized, loading: false });
  } catch (err) {
    set({ error: "Failed to fetch news", loading: false });
  }
},

  createNews: async (article) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        method: "POST",
        body: JSON.stringify(article),
      });
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/news`);
      set({ news: data, loading: false });
    } catch {
      set({ error: "Failed to create news", loading: false });
    }
  },

  updateNews: async (id, article) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(article),
      });
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/news`);
      set({ news: data, loading: false });
    } catch {
      set({ error: "Failed to update news", loading: false });
    }
  },

  deleteNews: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
        method: "DELETE",
      });
      set((state) => ({ news: state.news.filter((n) => n._id !== id), loading: false }));
    } catch {
      set({ error: "Failed to delete news", loading: false });
    }
  },
}));
