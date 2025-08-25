'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Check, CheckCheck } from 'lucide-react';
import WeatherCard from '@/components/dashboard/weathercard';
import ChecklistSection from '@/components/dashboard/checklistsection';
import { useChecklistStore } from '@/store/checklistStore';

// ... other imports
import useSWR from 'swr';
import { Types } from "mongoose";
import { fetcherWithToken, getToken } from "../../../../../utils/fetcher";

interface Trip {
  _id: Types.ObjectId,
  title: string,
  destination: string,
  description: string,
  startDate: Date,
  endDate: Date,
  durationDays: number,
  ownerUid: string,
  weather: {
    location: string,
    tempRange: string,
    description: string,
    condition: {
      type: string,
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'],
      default: 'sunny'
    },
    highTemp: string,
    lowTemp: string,
    wind: string,
    humidity: string,
    chanceRain: string
  }
}

type Item = {
  name: string,
  qty?: number,
  checked?: boolean, // Make checked optional to match the store type
  eco?: boolean      // Make eco optional to match the store type
};

type Category = {
  name: string;
  items: Item[];
  _id: Types.ObjectId;
}

type CategoryItems = {
  [key: string]: Item[];
};

interface PackingList {
  _id?: Types.ObjectId;
  tripId?: Types.ObjectId;
  ownerUid: string;
  title: string;
  categories: {
    name: "Clothing" | "Essentials" | "Toiletries" | "Electronics";
    items: {
      name: string;
      qty?: number;
      checked?: boolean;
      eco?: boolean;
    }[];
    _id: Types.ObjectId;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}





/** -----------------------------
 * Helpers
 * ----------------------------*/
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const generateSmartSuggestions = (trip?: Trip): CategoryItems => {
  if (!trip) return { Essentials: [], Clothing: [], Toiletries: [], Electronics: [] };
  const dest = trip.destination?.toLowerCase() || "";
  const warmWeather = /(paris|dubai|bali|miami|colombo)/.test(dest);
  const coldWeather = /(oslo|helsinki|zurich|moscow|reykjavik)/.test(dest);
  const longTrip = trip.durationDays >= 8;

  return {
    Essentials: [
      { name: "Reusable water bottle", qty: 1, checked: false, eco: true },
      { name: "Reusable shopping tote", qty: 1, checked: false, eco: true }
    ],
    Clothing: [
      { name: warmWeather ? "Sun hat" : coldWeather ? "Beanie & gloves" : "Light jacket", qty: 1, checked: false, eco: true },
      { name: longTrip ? "Laundry kit (eco detergent sheets)" : "Compact laundry bar", qty: 1, checked: false, eco: true },
      { name: "Packable rain jacket", qty: 1, checked: false, eco: true }
    ],
    Toiletries: [
      { name: "Solid conditioner bar", qty: 1, checked: false, eco: true },
      { name: "Safety razor (with guard)", qty: 1, checked: false, eco: true },
      { name: "Refillable travel containers", qty: 1, checked: false, eco: true }
    ],
    Electronics: [
      { name: "Universal travel adapter", qty: 1, checked: false, eco: true },
      { name: "Power bank", qty: 1, checked: false, eco: true },
      { name: "Cable organizer", qty: 1, checked: false, eco: true }
    ]
  };
};


export default function PackingListOverviewPage() {

  // Get state and actions from the store
  const {
    checklistCats,
    removedItems,
    activeCategory,
    setChecklistCats,
    setRemovedItems,
    setNewInputs,
    setActiveCategory,
    checkAllCategory,
    uncheckAllCategory,
  } = useChecklistStore();

  

  // ... other state and hooks (trips, lists, etc.)
  function useTrips() {
  const { data, error } = useSWR('http://localhost:5000/api/trips', fetcherWithToken);
  return { trips: data, loading: !data && !error, error };
}

function usePackingLists(tripId: string) {
  const { data, error } = useSWR('http://localhost:5000/api/packinglists', fetcherWithToken);
  const lists = data ? data.filter((pl: PackingList) => pl.tripId?.toString() === tripId) : [];
  return { lists, loading: !data && !error, error };
}


   const { trips } = useTrips();

  /** UI State */
  const [activeTab, setActiveTab] = useState<'weather' | 'checklist' | 'smart'>('weather');
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [selectedListId, setSelectedListId] = useState<string>('');

  /** Selected Trip */
  const currentTrip = useMemo(() => trips?.find((t: Trip) => t._id.toString() === selectedTripId), [trips, selectedTripId]);

  /** Initialize selectedTripId */
  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0]._id.toString());
    }
  }, [trips]);

  /** Packing Lists */
  const { lists } = usePackingLists(selectedTripId);

  /** Initialize selectedListId */
  useEffect(() => {
    if (lists && lists.length > 0 && !selectedListId) {
      setSelectedListId(lists[0]._id?.toString() || '');
    }
  }, [lists]);

  /** currentListSeed - FIXED: Use stringified version for comparison */
  const currentListSeed = useMemo(() => {
    const list = lists.find((p:PackingList) => p._id?.toString() === selectedListId);
    if (!list?.categories) return { Clothing: [], Essentials: [], Toiletries: [], Electronics: [] };
    return list.categories.reduce((acc: CategoryItems, cat: Category) => {
      acc[cat.name] = cat.items.map((i) => ({
        name: i.name,
        qty: i.qty ?? 1,
        checked: i.checked ?? false,
        eco: i.eco ?? false
      }));
      return acc;
    }, {} as CategoryItems);
  }, [lists, selectedListId]);

  // Create a stable reference for comparison
  const currentListSeedString = useMemo(() => 
    JSON.stringify(currentListSeed), 
    [currentListSeed]
  );

 

  const listsForTrip = useMemo(() => lists.filter((pl: PackingList) => pl.tripId?.toString() === selectedTripId), [lists, selectedTripId]);


  // Initialize checklistCats from the current list
  useEffect(() => {
    if (!currentListSeedString) return;
    
    const seedData = JSON.parse(currentListSeedString);
    setChecklistCats(seedData);
    setRemovedItems([]);
    setNewInputs({});
    const firstCat = Object.keys(seedData)[0];
    if (firstCat) setActiveCategory(firstCat);
  }, [currentListSeedString, setChecklistCats, setRemovedItems, setNewInputs, setActiveCategory]);

  // Eco Score calculation
  const ecoScore = useMemo(() => {
    let ecoItems = 0;
    let total = 0;
    Object.values(checklistCats).forEach((arr) => {
      arr.forEach((i) => {
        if (!removedItems.includes(i.name)) {
          total += 1;
          if (i.eco) ecoItems += 1;
        }
      });
    });
    return total ? Math.round((ecoItems / total) * 100) : 0;
  }, [checklistCats, removedItems]);

  // Packing Progress calculation
  const packingProgress = useMemo(() => {
    let checked = 0;
    let total = 0;
    Object.values(checklistCats).forEach((arr) => {
      arr.forEach((i) => {
        if (!removedItems.includes(i.name)) {
          total += 1;
          if (i.checked) checked += 1;
        }
      });
    });
    return { checked, total, progress: total ? Math.round((checked / total) * 100) : 0 };
  }, [checklistCats, removedItems]);


    /** Smart Suggestions */
  const [smartCats, setSmartCats] = useState<CategoryItems>({});
  const [smartRemoved, setSmartRemoved] = useState<string[]>([]);

  // Create stable trip reference
  const currentTripId = currentTrip?._id?.toString();

  useEffect(() => {
    if (!currentTrip) return;
    const newSuggestions = generateSmartSuggestions(currentTrip);
    setSmartCats(newSuggestions);
    setSmartRemoved([]);
  }, [currentTripId]); // Only depend on ID, not the whole trip object


  // NEW: Toggle item checked state
  const handleToggleItem = useCallback((category: string, itemName: string) => {
    const item = (checklistCats[category] || []).find((i) => i.name === itemName);
    if (!item) return;
    // Use store action for type safety
    useChecklistStore.getState().toggleItem(category, itemName, !(item.checked ?? false));
  }, []);

  // NEW: Check all items in category
  const handleCheckAllCategory = useCallback((category: string) => {
    checkAllCategory(category);
  }, [checkAllCategory]);

  // NEW: Uncheck all items in category
  const handleUncheckAllCategory = useCallback((category: string) => {
    uncheckAllCategory(category);
  }, [uncheckAllCategory]);

  const handleAddSuggestionToChecklist = useCallback((category: string, item: Item) => {
    setChecklistCats({
      ...checklistCats,
      [category]: [
        ...(checklistCats[category] || []),
        ...(checklistCats[category]?.find((i: Item) => i.name.toLowerCase() === item.name.toLowerCase()) ? [] : [item])
      ]
    });
  }, []);

  const handleRemoveSmart = useCallback((label: string) => {
    setSmartRemoved((prev) => (prev.includes(label) ? prev : [...prev, label]));
  }, []);

  /** Category Icons */
  const categoryIcons: Record<string, string> = {
    Clothing: '👕',
    Essentials: '🎒',
    Toiletries: '🧴',
    Electronics: '🔌',
  };

  
  /** Loading Check */
  if (!currentTrip) return <div>Loading trip...</div>;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f5f8f6] text-gray-800 p-4">
      {/* Animated Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl transition-shadow duration-500 hover:shadow-2xl overflow-hidden mb-4 rounded-xl">
        {/* Background Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300 animate-floating"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 animate-slideIn animate-pulseGlow">
              {trips.find((t: Trip) => t._id.toString() === selectedTripId)?.title}
            </h1>
            <p className="text-sm text-green-600 mt-1 animate-fadeIn">
              Destination: {currentTrip.destination} &nbsp;|&nbsp; {currentTrip.startDate} →{' '}
              {currentTrip.endDate} &nbsp;|&nbsp; {currentTrip.durationDays} days
            </p>
          </div>
        </div>

        {/* Right Section: Selectors + Tabs */}
        <div className="flex flex-col gap-3 md:items-end relative z-10">
          {/* Selectors */}
          <div className="flex gap-3">
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/80 border border-gray-200 shadow-sm hover:bg-white transition"
            >
              {trips.map((t: Trip) => (
                <option key={t._id.toString()} value={t._id.toString()}>
                  {t.title}
                </option>
              ))}
            </select>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/80 border border-gray-200 shadow-sm hover:bg-white transition"
            >
              {listsForTrip.map((pl: PackingList) => (
                <option key={pl._id?.toString()} value={pl._id?.toString()}>
                  {pl.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-1">
            {[
              { id: 'weather', label: 'Weather' },
              { id: 'checklist', label: 'Checklist' },
              { id: 'smart', label: 'Smart Packing' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-500 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 text-white shadow-xl animate-gradient'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 shadow-sm'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
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
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Weather Tab */}
          {activeTab === 'weather' && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WeatherCard weather={currentTrip.weather} />
            </motion.div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Progress & Eco Score Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Packing Progress */}
                <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center gap-2 font-bold text-[#0e1b13] mb-2">
                    <CheckCheck size={28} className="text-blue-600" />
                    Packing Progress
                  </div>
                  <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${packingProgress.progress}%` }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                    />
                  </div>
                  <p className="text-sm text-gray-700">
                    {packingProgress.checked}/{packingProgress.total} items packed ({packingProgress.progress}%)
                  </p>
                </div>

                {/* Eco Score */}
                <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center gap-2 font-bold text-[#0e1b13] mb-2">
                    <Leaf size={28} className="text-green-600" />
                    Eco Score
                  </div>
                  <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ecoScore}%` }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-green-400 to-teal-500"
                    />
                  </div>
                  <p className="text-sm text-gray-700">{ecoScore}% eco items packed</p>
                </div>
              </div>

              {/* Scrollable Category Navigation */}
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {Object.keys(checklistCats).map((cat) => {
                  const total = checklistCats[cat].length;
                  const checkedCount = checklistCats[cat].filter((i) => !removedItems.includes(i.name) && i.checked).length;
                  const ecoCount = checklistCats[cat].filter((i) => !removedItems.includes(i.name) && i.eco).length;
                  const isActive = cat === activeCategory;
                  const allChecked = total > 0 && checkedCount === total;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap
                        ${isActive
                          ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'}
                      `}
                    >
                      <span>{categoryIcons[cat] || '📌'}</span>
                      <span>{cat}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        allChecked ? 'bg-green-500 text-white' : 'bg-white/30'
                      }`}>
                        {checkedCount}/{total} ✓
                      </span>
                      {ecoCount > 0 && (
                        <span className="text-xs font-medium bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          {ecoCount} 🌿
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Category Actions */}
              {activeCategory && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCheckAllCategory(activeCategory)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Check All
                  </button>
                  <button
                    onClick={() => handleUncheckAllCategory(activeCategory)}
                    className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Uncheck All
                  </button>
                </div>
              )}

              {/* Animated Category Content */}
              <AnimatePresence mode="wait">
                {activeCategory && (
                    <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4"
                    >
                    <ChecklistSection
                      title={titleCase(activeCategory)}
                      category={activeCategory}
                      listId={selectedListId}
                    />
                    
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Smart Packing Tab */}
          {activeTab === 'smart' && (
            <motion.div
              key="smart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Header + Progress + Eco */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 md:col-span-2">
                  Smart Packing Suggestions
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-blue-700 font-semibold">
                    <CheckCheck size={20} /> Progress: {packingProgress.progress}%
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                    <Leaf size={20} /> Eco Score: {ecoScore}%
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Packing Progress</p>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${packingProgress.progress}%` }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Eco Progress</p>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ecoScore}%` }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-green-400 to-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Suggestions grouped by category */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.keys(smartCats).map((cat) => {
                  const items = (smartCats[cat] || []).filter((i) => !smartRemoved.includes(i.name));
                  if (!items.length) return null;
                  return (
                    <div key={`smart-${cat}`} className="bg-white rounded-2xl p-4 shadow border border-gray-100">
                      <h3 className="text-lg font-bold mb-3">{titleCase(cat)}</h3>
                      <ul className="space-y-2">
                        {items.map((it) => (
                          <li
                            key={`sug-${cat}-${it.name}`}
                            className="flex items-center justify-between gap-3 bg-emerald-50/60 rounded-xl px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleItem(cat, it.name)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                  ${it.checked 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 hover:border-green-400'
                                  }`}
                              >
                                {it.checked && <Check size={14} />}
                              </button>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800">{it.name}</span>
                                {it.eco && <span className="text-xs text-emerald-700">Eco-friendly</span>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRemoveSmart(it.name)}
                                className="text-red-500 hover:text-red-600 text-xs"
                                title="Hide suggestion"
                              >
                                Remove
                              </button>
                              <button
                                onClick={() => handleAddSuggestionToChecklist(cat, it)}
                                className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs hover:bg-emerald-600"
                                title="Add to Checklist"
                              >
                                Add
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );

}