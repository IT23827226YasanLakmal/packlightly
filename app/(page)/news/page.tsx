"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export type NewsItem = {
  id: string;
  title: string;
  publishedAt: string;
  category: string;
  snippet: string;
  image: string;
};

const seed: NewsItem[] = [
  {
    id: "n1",
    title: "Eco-friendly travel tips for 2025",
    publishedAt: "2025-08-12",
    category: "Packing Tips",
    snippet: "Learn how to travel sustainably without compromising comfort...",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n2",
    title: "New carbon-neutral courier partnerships",
    publishedAt: "2025-08-20",
    category: "Sustainable Transport",
    snippet: "Companies are joining forces to reduce carbon emissions during deliveries...",
    image: "https://images.unsplash.com/photo-1517638851339-4bb56c69db68?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n3",
    title: "Top eco hotels to visit this year",
    publishedAt: "2025-08-22",
    category: "Eco Hotels",
    snippet: "Discover hotels that prioritize sustainability and environmental care...",
    image: "https://images.unsplash.com/photo-1501117716987-c8e1e70f1226?auto=format&fit=crop&w=800&q=80"
  },
];

const categories = ["All", "Packing Tips", "Sustainable Transport", "Eco Hotels", "Travel Policies"];

export default function EcoTravelNews() {
  const [items] = React.useState<NewsItem[]>(seed);
  const [selected, setSelected] = React.useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const filteredItems = activeCategory === "All" ? items : items.filter(n => n.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-green-50 via-green-100 to-green-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] flex items-center justify-center text-center overflow-hidden rounded-b-3xl shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
          alt="Eco Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-900 drop-shadow-lg">🌿 Eco Travel News</h1>
          <p className="mt-2 text-lg md:text-xl text-emerald-800 drop-shadow-sm">
            Discover sustainable destinations, eco tips, and green adventures
          </p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 my-8 px-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeCategory === cat
                ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Carousel */}
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl">
        <motion.div
          key={carouselIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full flex justify-center"
        >
          <div
            className="relative w-full h-64 md:h-80 rounded-2xl shadow-lg cursor-pointer overflow-hidden"
            onClick={() => setSelected(filteredItems[carouselIndex])}
          >
            <img
              src={filteredItems[carouselIndex]?.image}
              alt={filteredItems[carouselIndex]?.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <h2 className="text-xl md:text-2xl font-bold">{filteredItems[carouselIndex]?.title}</h2>
              <p className="text-sm md:text-base">{filteredItems[carouselIndex]?.snippet}</p>
            </div>
          </div>
        </motion.div>
        <button
          onClick={() => setCarouselIndex((carouselIndex - 1 + filteredItems.length) % filteredItems.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow hover:bg-white/70 transition"
        >
          <ArrowLeft className="w-6 h-6 text-green-700" />
        </button>
        <button
          onClick={() => setCarouselIndex((carouselIndex + 1) % filteredItems.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow hover:bg-white/70 transition"
        >
          <ArrowRight className="w-6 h-6 text-green-700" />
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto my-12 px-4">
        {filteredItems.map(n => (
          <motion.div
            key={n.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer relative"
            onClick={() => setSelected(n)}
          >
            <img src={n.image} alt={n.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 self-start">{n.category}</span>
              <h3 className="text-lg font-bold text-emerald-900">{n.title}</h3>
              <p className="text-green-700 text-sm">{n.snippet}</p>
              <div className="flex items-center gap-2 text-green-600 text-xs mt-2">
                <CalendarDays className="w-4 h-4" /> {n.publishedAt}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[700px] bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <img src={selected.image} alt={selected.title} className="w-full h-64 object-cover rounded-t-3xl" />
              <div className="p-6">
                <h2 className="text-3xl font-bold text-emerald-900 mb-2">{selected.title}</h2>
                <p className="text-green-700 text-sm mb-4">{selected.publishedAt} • {selected.category}</p>
                <p className="text-green-800 mb-6">
                  {selected.snippet} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec leo id libero bibendum elementum. Sed et magna eget purus fermentum dictum.
                </p>
                <div className="flex justify-end">
                  <button onClick={() => setSelected(null)} className="px-6 py-2 rounded-full bg-green-100 hover:bg-green-200 text-green-800 font-semibold transition">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
