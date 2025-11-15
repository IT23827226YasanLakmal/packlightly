"use client";
import { motion } from "framer-motion";
import { BarChart3, Leaf, Newspaper, Users, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import StatCard from "@/components/admin/StatCard";
import EcoTable from "@/components/admin/SustainabilityIndexChart";
import NewsManager from "@/components/admin/CategoryComparisonRadarChart";
import TopEcoProducts from "@/components/admin/TopEcoProducts";
import { useAdminStore } from "@/store/adminStore";

export default function AdminDashboardPage() {
  // Admin store hook
  const { stats, loading, error, lastUpdated, fetchAdminStats, refreshDashboard } = useAdminStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  // Handle refresh
  const handleRefresh = async () => {
    await refreshDashboard();
  };

  // Show loading state
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-300 text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  // Show error state
  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }
  return (
    <>
      {/* Hero / Header */}
      <section className="px-6 lg:px-10 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl 
            bg-gradient-to-br from-emerald-900 via-black to-emerald-950  
            border border-green-700/40 shadow-lg shadow-emerald-900/40
            p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Leaf className="w-10 h-10 text-green-400 drop-shadow-lg" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
                  Eco Admin Dashboard
                </h1>
                <p className="text-sm text-green-300 font-medium">
                  Manage inventory, eco ratings, and news content in one place.
                </p>
                {lastUpdated && (
                  <p className="text-xs text-green-400 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
          icon={BarChart3} 
          label="Total Products" 
          value={loading ? "..." : (stats?.totalProducts?.toString() || "0")} 
          delta={loading ? "" : `${stats?.totalProducts || 0} products`} 
        />
        <StatCard 
          icon={Leaf} 
          label="Avg. Eco Rating" 
          value={loading ? "..." : (stats?.avgEcoRating?.toString() || "0.0")} 
          delta={loading ? "" : `★ ${stats?.avgEcoRating || 0}/5.0`} 
        />
        <StatCard 
          icon={Newspaper} 
          label="Published News" 
          value={loading ? "..." : (stats?.totalNews?.toString() || "0")} 
          delta={loading ? "" : `${stats?.totalNews || 0} articles`} 
        />
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={loading ? "..." : (stats?.totalUsers?.toString() || "0")} 
          delta={loading ? "" : `${stats?.totalUsers || 0} users`} 
        />
      </section>

      {/* Content Sections */}
      <section className="px-6 lg:px-10 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Eco Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2"
        >
          <EcoTable data={stats?.monthlyProductGrowth || []} loading={loading} />
        </motion.div>

        {/* Top Eco Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <TopEcoProducts products={stats?.topEcoProducts || []} loading={loading} />
        </motion.div>

        {/* News Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3"
        >
          <NewsManager data={stats?.categoryEcoScores || []} loading={loading} />
        </motion.div>
      </section>
    </>
  );
}
