"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WeatherCard from "@/components/dashboard/weathercard";
import ChecklistSection from "@/components/dashboard/checklistsection";
import { Leaf } from "lucide-react";

export default function PackingListOverviewPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("weather");
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [ecoScore, setEcoScore] = useState(78);

  const tabs = [
    { id: "weather", label: "Weather" },
    { id: "checklist", label: "Checklist" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f5f8f6] text-gray-800">

      {/* Animated Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl transition-shadow duration-500 hover:shadow-2xl relative overflow-hidden">
        
        {/* Background Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full bg-green-${400 + i * 50} animate-floating`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Left Section */}
        <div className="flex items-center gap-5 relative z-10">
          <button
            onClick={() => router.push("/dashboard/packinglists")}
            className="px-5 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 hover:animate-glow"
          >
            &larr; Dashboard
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 animate-slideIn animate-pulseGlow">
              Paris Trip
            </h1>
            <p className="text-sm text-green-600 mt-1 animate-fadeIn">
              Departure: July 15, 2024 | Duration: 7 Days
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-3 md:mt-0 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-500 whitespace-nowrap
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 text-white shadow-xl animate-gradient"
                  : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 shadow-sm"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes floating {
          0% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(10px); opacity: 1; }
          100% { transform: translateY(0) translateX(0); opacity: 0.6; }
        }
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(78, 151, 107, 0.5); }
          50% { text-shadow: 0 0 20px rgba(78, 151, 107, 0.8); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-floating { animation: floating 6s ease-in-out infinite; }
        .animate-pulseGlow { animation: pulseGlow 2s infinite; }
        .animate-glow { box-shadow: 0 0 20px rgba(78, 151, 107, 0.8); }
        .animate-gradient { background-size: 200% 200%; animation: gradientShift 4s ease infinite; }
      `}</style>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 md:px-12 py-6 gap-6">
        <AnimatePresence mode="wait">

          {/* Weather Tab */}
          {activeTab === "weather" && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WeatherCard
                location="Paris"
                tempRange="22°C - 28°C"
                description="Sunny with occasional showers"
                condition="sunny"
                highTemp="28°C"
                lowTemp="22°C"
                wind="12 km/h"
                humidity="60%"
                chanceRain="10%"
              />
            </motion.div>
          )}

          {/* Checklist Tab */}
          {activeTab === "checklist" && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Eco Score */}
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xl border border-gray-200">
                <div className="flex items-center gap-2 font-bold text-[#0e1b13]">
                  <Leaf size={28} className="text-green-600" />
                  Eco Score
                </div>
                <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ecoScore}%` }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-green-400 to-teal-500"
                  />
                </div>
                <p className="text-sm text-gray-700">{ecoScore}% eco items packed</p>
              </div>

              {/* Checklist Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                <ChecklistSection
                  title="Clothing"
                  items={[
                    { label: "3 x T-shirts (organic cotton)", eco: true },
                    { label: "1 x Lightweight jacket (recycled materials)", eco: true },
                    { label: "1 x Pair of jeans (water-efficient denim)" },
                    { label: "7 x Underwear (bamboo fabric)", eco: true },
                    { label: "7 x Socks (recycled polyester)", eco: true },
                  ]}
                  removedItems={removedItems}
                  setRemovedItems={setRemovedItems}
                  setEcoScore={setEcoScore}
                />
                <ChecklistSection
                  title="Essentials"
                  items={[
                    { label: "Passport & travel documents" },
                    { label: "Reusable water bottle", eco: true },
                    { label: "Portable charger" },
                    { label: "Travel adapter" },
                  ]}
                  removedItems={removedItems}
                  setRemovedItems={setRemovedItems}
                  setEcoScore={setEcoScore}
                />
                <ChecklistSection
                  title="Toiletries"
                  items={[
                    { label: "Solid shampoo bar (eco-friendly)", eco: true },
                    { label: "Refillable travel-sized containers", eco: true },
                    { label: "Bamboo toothbrush", eco: true },
                    { label: "Mineral sunscreen (reef-safe)", eco: true },
                  ]}
                  removedItems={removedItems}
                  setRemovedItems={setRemovedItems}
                  setEcoScore={setEcoScore}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
