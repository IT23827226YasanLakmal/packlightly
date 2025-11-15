import { create } from "zustand";
import { fetcherWithToken } from "@/utils/fetcher";
import { Product, Post } from "@/types";

interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalNews: number;
  totalPosts: number;
  avgEcoRating: number;
  pendingReviews: number;
  monthlyProductGrowth: Array<{ month: string; products: number }>;
  categoryEcoScores: Array<{ category: string; ecoScore: number }>;
  topEcoProducts: Array<{ name: string; ecoScore: number; category: string }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

interface AdminStore {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchAdminStats: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,

  fetchAdminStats: async () => {
    set({ loading: true, error: null });
    try {
      // If you have a dedicated admin stats endpoint, use it
      // const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
      
      // For now, we'll compute stats from individual endpoints
      const [productsRes, usersRes, newsRes, postsRes] = await Promise.all([
        fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/products`),
        fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/users`),
        fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/news`),
        fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
      ]);

      const products = Array.isArray(productsRes) ? productsRes : [];
      const users = Array.isArray(usersRes) ? usersRes : [];
      const news = Array.isArray(newsRes.news) ? newsRes.news : [];
      const posts = Array.isArray(postsRes) ? postsRes : [];

      // Calculate stats
      const totalProducts = products.length;
      const totalUsers = users.length;
      const totalNews = news.length;
      const totalPosts = posts.length;
      const avgEcoRating = products.length > 0 
        ? products.reduce((sum: number, product: Product) => sum + (product.eco || 0), 0) / products.length
        : 0;
      const pendingReviews = posts.filter((post: Post) => post.status === "Draft").length;

      // Generate monthly growth data
      const monthlyData: { [key: string]: number } = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      months.forEach(month => monthlyData[month] = 0);
      
      products.forEach((product: Product) => {
        if (product.createdAt) {
          const date = new Date(product.createdAt);
          const month = months[date.getMonth()];
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        }
      });

      const currentMonth = new Date().getMonth();
      const monthlyProductGrowth = [];
      for (let i = 6; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const month = months[monthIndex];
        monthlyProductGrowth.push({
          month: month,
          products: monthlyData[month] || 0
        });
      }

      // Generate category eco scores
      const categoryData: { [key: string]: { total: number; count: number } } = {};
      
      products.forEach((product: Product) => {
        const category = product.category || "Uncategorized";
        const ecoScore = product.eco || 0;
        
        if (!categoryData[category]) {
          categoryData[category] = { total: 0, count: 0 };
        }
        
        categoryData[category].total += ecoScore;
        categoryData[category].count += 1;
      });

      const categoryEcoScores = Object.entries(categoryData).map(([category, data]) => ({
        category: category,
        ecoScore: data.count > 0 ? Number((data.total / data.count).toFixed(1)) : 0
      })).sort((a, b) => b.ecoScore - a.ecoScore).slice(0, 8);

      // Get top eco products
      const topEcoProducts = products
        .filter((product: Product) => (product.eco || 0) > 0)
        .sort((a: Product, b: Product) => (b.eco || 0) - (a.eco || 0))
        .slice(0, 5)
        .map((product: Product) => ({
          name: product.name || "Unnamed Product",
          ecoScore: product.eco || 0,
          category: product.category || "Uncategorized"
        }));

      // Generate recent activity (mock data for now)
      const recentActivity = [
        { type: "product", description: `${totalProducts} total products in system`, timestamp: new Date().toISOString() },
        { type: "user", description: `${totalUsers} registered users`, timestamp: new Date().toISOString() },
        { type: "news", description: `${totalNews} news articles published`, timestamp: new Date().toISOString() },
        { type: "post", description: `${pendingReviews} posts pending review`, timestamp: new Date().toISOString() }
      ];

      const stats: AdminStats = {
        totalProducts,
        totalUsers,
        totalNews,
        totalPosts,
        avgEcoRating: Number(avgEcoRating.toFixed(1)),
        pendingReviews,
        monthlyProductGrowth,
        categoryEcoScores,
        topEcoProducts,
        recentActivity
      };

      set({ 
        stats, 
        loading: false, 
        lastUpdated: new Date() 
      });

    } catch {
      set({ 
        error: "Failed to fetch admin statistics", 
        loading: false 
      });
    }
  },

  refreshDashboard: async () => {
    await get().fetchAdminStats();
  }
}));