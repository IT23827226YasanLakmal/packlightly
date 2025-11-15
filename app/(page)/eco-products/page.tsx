"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "../../../components/Header";
import ProductGrid from "../../../components/product/ProductGrid";
import Footer from "../../../components/Footer";
import { useProductStore } from "@/store/productStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 50 } },
};
const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 80, damping: 10 } },
};

export default function EcoInventoryPage() {
  const categories = ["All", "Bags", "Bottles", "Toiletries", "Clothing", "Accessories"];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ecoRating, setEcoRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesEco = !ecoRating || product.eco === Number(ecoRating);
    return matchesSearch && matchesCategory && matchesEco;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, ecoRating]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fcfa] overflow-x-hidden" >
      <Header />

      {/* Hero Section with Minimal Animations */}
      <section className="w-full px-6 lg:px-40 py-16 bg-white rounded-b-2xl shadow-sm">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[#0e1b13] text-3xl md:text-4xl font-bold leading-snug"
          >
            Eco-Friendly Travel Products
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-2 text-[#4e976b] text-base md:text-lg font-medium"
          >
            Discover sustainable essentials to reduce your environmental impact.
          </motion.p>

          {/* Search & Filter */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-col sm:flex-row justify-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className="relative w-full sm:w-80"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition"
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-green-600" />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-white font-medium shadow-sm hover:bg-green-700 transition"
              // Placeholder for future advanced filters
            >
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </motion.button>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            variants={containerVariants}
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                variants={pillVariants}
                whileHover={{ scale: 1.1, backgroundColor: "#d4f3de" }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat ? "bg-green-200 text-green-900" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>

          {/* Eco Rating Dropdown */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex justify-center relative"
            initial={{ y: -2, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <select
              className="appearance-none rounded-xl border border-gray-300 bg-gray-50 py-3 px-4 pr-10 text-gray-800 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition"
              value={ecoRating}
              onChange={(e) => setEcoRating(e.target.value)}
            >
              <option value="">Sort by Eco Rating</option>
              <option value="5">★★★★★ - Top Rated</option>
              <option value="4">★★★★☆ - Excellent</option>
              <option value="3">★★★☆☆ - Good</option>
              <option value="2">★★☆☆☆ - Fair</option>
              <option value="1">★☆☆☆☆ - Basic</option>
            </select>
            <ChevronDown className="absolute right-10 w-4 h-4 text-green-600 pointer-events-none" />
          </motion.div>
        </motion.div>
      </section>

      {/* Content Section */}
      <main className="px-6 lg:px-40 flex flex-1 justify-center py-12">
        <div className="flex flex-col w-full max-w-[1280px] gap-8">
          <ProductGrid products={currentProducts} />
          
          {/* Pagination Controls - After Products */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-4 my-8 px-4">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-full font-semibold transition text-sm md:text-base ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex gap-1 md:gap-2">
                {(() => {
                  const pagesToShow = [];
                  const maxVisiblePages = 5;
                  
                  if (totalPages <= maxVisiblePages) {
                    for (let i = 1; i <= totalPages; i++) {
                      pagesToShow.push(i);
                    }
                  } else {
                    pagesToShow.push(1);
                    
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
                    if (start > 2) {
                      pagesToShow.push('...');
                    }
                    
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pagesToShow.push(i);
                      }
                    }
                    
                    if (end < totalPages - 1) {
                      pagesToShow.push('...');
                    }
                    
                    if (totalPages > 1) {
                      pagesToShow.push(totalPages);
                    }
                  }
                  
                  return pagesToShow.map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-green-600">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full font-semibold transition text-sm md:text-base ${
                          currentPage === page
                            ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ));
                })()}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-full font-semibold transition text-sm md:text-base ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Items per page info and page navigation */}
          {filteredProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-green-700 text-sm mb-8 px-4">
              <div>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              {totalPages > 5 && (
                <div className="flex items-center gap-2">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 border border-green-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <span>of {totalPages}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
             
}
