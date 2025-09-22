"use client";
import { motion } from "framer-motion";
import { BarChart3, Leaf, Newspaper, Settings } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import EcoTable from "@/components/admin/SustainabilityIndexChart";
import NewsManager from "@/components/admin/CategoryComparisonRadarChart";

export default function AdminDashboardPage() {
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
          <div className="flex items-center gap-4">
            <Leaf className="w-10 h-10 text-green-400 drop-shadow-lg" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
                Eco Admin Dashboard
              </h1>
              <p className="text-sm text-green-300 font-medium">
                Manage inventory, eco ratings, and news content in one place.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={BarChart3} label="Total Products" value="1,248" delta="+4.2%" />
        <StatCard icon={Leaf} label="Avg. Eco Rating" value="4.3" delta="+0.1" />
        <StatCard icon={Newspaper} label="Published News" value="36" delta="+3" />
        <StatCard icon={Settings} label="Pending Reviews" value="12" delta="-2" />
      </section>

      {/* Content Sections */}
      <section className="px-6 lg:px-10 py-6 grid grid-cols-1 xl:grid-cols-1 gap-6">
        {/* Eco Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2"
        >
          <EcoTable/>
        </motion.div>

        {/* News Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          
        >
          <NewsManager />
        </motion.div>
      </section>
    </>
  );
}
