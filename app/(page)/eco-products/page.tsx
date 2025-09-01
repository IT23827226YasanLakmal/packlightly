"use client"

import React from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Leaf, ChevronDown } from "lucide-react";
import Header from "../../../components/Header";
import FilterBar from "../../../components/product/FilterBar";
import ProductGrid from "../../../components/product/ProductGrid";
import Footer from "../../../components/Footer";

export default function EcoInventoryPage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gradient-to-b from-[#f8fcfa] to-[#e9f7f0] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative w-full px-6 lg:px-40 py-12 lg:py-16 bg-[#f0fdf4] rounded-b-3xl shadow-sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="flex justify-center mb-4">
              <Leaf className="text-[#4e976b] w-10 h-10" />
            </div>
            <h1 className="text-[#0e1b13] text-4xl md:text-5xl font-extrabold leading-tight">
              Eco-Friendly Travel Products
            </h1>
            <p className="mt-3 text-[#4e976b] text-lg font-medium">
              Discover sustainable essentials to minimize your environmental impact 🌱
            </p>

            {/* Search, Category Navigation, and Filter Controls */}
            <div className="mt-6 flex flex-col gap-4">
              {/* Search and Filters Row */}
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full rounded-2xl border border-[#cde7d6] bg-white py-3 pl-10 pr-4 shadow-sm focus:border-[#4e976b] focus:ring-2 focus:ring-[#4e976b] outline-none"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-[#4e976b]" />
                </div>
                <button className="flex items-center gap-2 rounded-2xl bg-[#4e976b] px-5 py-3 text-white font-semibold shadow-md hover:bg-[#3b7754] transition-all">
                  <SlidersHorizontal className="w-5 h-5" /> Filters
                </button>
              </div>

              {/* Category Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-3 mt-2"
              >
                {["All", "Bags", "Bottles", "Toiletries", "Clothing", "Accessories"].map((cat, i) => (
                  <button
                    key={cat}
                    className="px-5 py-2 rounded-full bg-white border border-[#cde7d6] text-[#0e1b13] font-medium shadow-sm hover:bg-[#e6f5ec] transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* Eco Rating Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative flex justify-center mt-2"
              >
                <select
                  className="appearance-none rounded-2xl border border-[#cde7d6] bg-white py-3 px-5 pr-10 shadow-sm text-[#0e1b13] font-medium focus:border-[#4e976b] focus:ring-2 focus:ring-[#4e976b] outline-none"
                >
                  <option value="">Sort by Eco Rating</option>
                  <option value="5">★★★★★ - Top Rated</option>
                  <option value="4">★★★★☆ - Excellent</option>
                  <option value="3">★★★☆☆ - Good</option>
                  <option value="2">★★☆☆☆ - Fair</option>
                  <option value="1">★☆☆☆☆ - Basic</option>
                </select>
                <ChevronDown className="absolute right-5 top-4 w-5 h-5 text-[#4e976b] pointer-events-none" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Content Section */}
        <main className="px-6 lg:px-40 flex flex-1 justify-center py-10">
          <div className="layout-content-container flex flex-col w-full max-w-[1280px] gap-6">
            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FilterBar />
            </motion.div>

            {/* Product Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ProductGrid />
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
