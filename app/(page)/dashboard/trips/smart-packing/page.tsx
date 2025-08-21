'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Plus } from 'lucide-react';
import WeatherCard from '@/components/dashboard/weathercard';
import ChecklistSection from '@/components/dashboard/checklistsection';
import useSWR from 'swr';
import { Types } from "mongoose";
import { fetcherWithToken } from "../../../../../utils/fetcher";

/** -----------------------------
 * Types
 * ----------------------------*/
type Item = { label: string; eco?: boolean };
type CategoryItems = Record<string, Item[]>;

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
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'], // restrict to common types
      default: 'sunny'
    },
    highTemp: string,
    lowTemp: string,
    wind: string,
    humidity: string,
    chanceRain: string
  }
}

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
    }[];
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

/** -----------------------------
 * Hooks
 * ----------------------------*/
function useTrips() {
  const { data, error } = useSWR('http://localhost:5000/api/trips', fetcherWithToken);
  return { trips: data, loading: !data && !error, error };
}

function usePackingLists(tripId: string) {
  const { data, error } = useSWR('http://localhost:5000/api/packinglists', fetcherWithToken);
  const lists = data ? data.filter((pl: PackingList) => pl.tripId?.toString() === tripId) : [];
  return { lists, loading: !data && !error, error };
}

/** -----------------------------
 * Helpers
 * ----------------------------*/
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const deepCloneCategories = (src: CategoryItems): CategoryItems =>
  Object.fromEntries(
    Object.entries(src).map(([k, arr]) => [k, arr.map((i) => ({ ...i }))])
  );

const countEco = (cats: CategoryItems, removed: string[]) => {
  let ecoItems = 0;
  let total = 0;
  Object.values(cats).forEach((arr) => {
    arr.forEach((i) => {
      if (!removed.includes(i.label)) {
        total += 1;
        if (i.eco) ecoItems += 1;
      }
    });
  });
  return { ecoItems, total, score: total ? Math.round((ecoItems / total) * 100) : 0 };
};

/** -----------------------------
 * Smart Suggestions
 * ----------------------------*/
const generateSmartSuggestions = (trip?: Trip): CategoryItems => {
  if (!trip) {
    return {
      Essentials: [],
      Clothing: [],
      Toiletries: [],
      Electronics: []
    };
  }

  const dest = trip.destination?.toLowerCase() || "";
  const warmWeather = /(paris|dubai|bali|miami|colombo)/.test(dest);
  const coldWeather = /(oslo|helsinki|zurich|moscow|reykjavik)/.test(dest);
  const longTrip = trip.durationDays >= 8;

  return {
    Essentials: [
      { label: "Copy of documents (digital & paper)" },
      { label: "Reusable water bottle", eco: true },
      { label: "Reusable shopping tote", eco: true }
    ],
    Clothing: [
      { label: warmWeather ? "Sun hat" : coldWeather ? "Beanie & gloves" : "Light jacket" },
      { label: longTrip ? "Laundry kit (eco detergent sheets)" : "Compact laundry bar", eco: true },
      { label: "Packable rain jacket" }
    ],
    Toiletries: [
      { label: "Solid conditioner bar", eco: true },
      { label: "Safety razor (with guard)", eco: true },
      { label: "Refillable travel containers", eco: true }
    ],
    Electronics: [
      { label: "Universal travel adapter" },
      { label: "Power bank" },
      { label: "Cable organizer" }
    ]
  };
};

/** -----------------------------
 * Component
 * ----------------------------*/
export default function PackingListOverviewPage() {
  const { trips } = useTrips();

  // ------------------ UI state ------------------
  const [activeTab, setActiveTab] = useState<'weather' | 'checklist' | 'smart'>('weather');
  const [selectedTripId, setSelectedTripId] = useState<string>('');

  /** ---------- Ensure selectedTripId initializes after trips load ---------- */
  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0]._id.toString());
    }
  }, [trips, selectedTripId]);

  const { lists } = usePackingLists(selectedTripId);
  const [selectedListId, setSelectedListId] = useState<string>('');

  console.log("PackingLists :", lists);
  /** ---------- currentTrip ---------- */
  const currentTrip = useMemo(() => {
    if (!trips) return undefined;
    return trips.find((t: Trip) => t._id.toString() === selectedTripId);
  }, [trips, selectedTripId]);

  /** ---------- selectedListId safe update ---------- */
  useEffect(() => {
    if (!lists || lists.length === 0) return;
    const firstListForTrip = lists[0]._id?.toString() || '';
    if (firstListForTrip && firstListForTrip !== selectedListId) {
      setSelectedListId(firstListForTrip);
    }
  }, [lists, selectedListId]);

  /** ---------- currentListSeed ---------- */
const currentListSeed = useMemo(() => {
  const list = lists.find(
    (p: PackingList) => p._id?.toString() === selectedListId?.toString()
  );

  if (!list?.categories) {
    return { Clothing: [], Essentials: [], Toiletries: [], Electronics: [] };
  }

  return list.categories.reduce((acc: CategoryItems, cat) => {
    acc[cat.name] = cat.items.map((i) => ({
      label: i.name,
      qty: i.qty,
      checked: i.checked,
    }));
    return acc;
  }, {} as CategoryItems);
}, [lists, selectedListId]);


  /** ---------- checklistCats ---------- */
  const [checklistCats, setChecklistCats] = useState<CategoryItems>(deepCloneCategories(currentListSeed));
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [newInputs, setNewInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    setChecklistCats((prev) => {
      const cloned = deepCloneCategories(currentListSeed);
      if (JSON.stringify(prev) !== JSON.stringify(cloned)) return cloned;
      return prev;
    });
    setRemovedItems([]);
    setNewInputs({});
  }, []);

  const ecoScore = useMemo(() => countEco(checklistCats, removedItems).score, [checklistCats, removedItems]);

  /** ---------- Smart Suggestions ---------- */
  const [smartCats, setSmartCats] = useState<CategoryItems>({});
  const [smartRemoved, setSmartRemoved] = useState<string[]>([]);

  useEffect(() => {
    if (!currentTrip) return;
    const newSuggestions = generateSmartSuggestions(currentTrip);
    setSmartCats(newSuggestions);
    setSmartRemoved([]);
  }, [currentTrip?._id.toString()]);

  /** ---------- Actions ---------- */
  const handleAddChecklistItem = (category: string) => {
    const value = (newInputs[category] || '').trim();
    if (!value) return;
    setChecklistCats((prev) => {
      const existing = prev[category] || [];
      if (existing.some((i) => i.label.toLowerCase() === value.toLowerCase())) return prev;
      return { ...prev, [category]: [...existing, { label: value }] };
    });
    setNewInputs((prev) => ({ ...prev, [category]: '' }));
  };

  const handleRemoveChecklistHard = (category: string, label: string) => {
    setChecklistCats((prev) => {
      const existing = prev[category] || [];
      return { ...prev, [category]: existing.filter((i) => i.label !== label) };
    });
    setRemovedItems((prev) => prev.filter((l) => l !== label));
  };

  const handleAddSuggestionToChecklist = (category: string, item: Item) => {
    setChecklistCats((prev) => {
      const existing = prev[category] || [];
      if (existing.find((i) => i.label.toLowerCase() === item.label.toLowerCase())) return prev;
      return { ...prev, [category]: [...existing, item] };
    });
  };

  const handleRemoveSmart = (label: string) => {
    setSmartRemoved((prev) => (prev.includes(label) ? prev : [...prev, label]));
  };

  const listsForTrip = useMemo(
    () => lists.filter((pl: PackingList) => pl.tripId?.toString() === selectedTripId),
    [lists, selectedTripId]
  );

  /** ---------- Category Navigation ---------- */
  const categoryIcons: Record<string, string> = {
    Clothing: '👕',
    Essentials: '🎒',
    Toiletries: '🧴',
    Electronics: '🔌',
  };
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(checklistCats)[0] || '');

  /** ---------- Loading Check ---------- */
  if (!currentTrip) return <div>Loading trip...</div>;

  /** ---------- Weather Card Props ---------- */

  if (!currentTrip) {
    return <div>Loading trip...</div>;
  }
  
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
              <WeatherCard  weather={currentTrip.weather} />
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
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-green-400 to-teal-500"
                  />
                </div>
                <p className="text-sm text-gray-700">{ecoScore}% eco items packed</p>
              </div>

              {/* Scrollable Category Navigation */}
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {Object.keys(checklistCats).map((cat) => {
                  const total = checklistCats[cat].length;
                  const ecoCount = checklistCats[cat].filter((i) => !removedItems.includes(i.label) && i.eco).length;
                  const isActive = cat === activeCategory;

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
                      <span className="text-xs font-medium bg-white/30 px-2 py-0.5 rounded-full">
                        {ecoCount}/{total} 🌿
                      </span>
                    </button>
                  );
                })}
              </div>

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
                      items={checklistCats[activeCategory] || []}          // pass the current items
                      removedItems={removedItems}                          // pass removed items to handle hiding
                      onRemove={(label: string) => handleRemoveChecklistHard(activeCategory, label)} // proper callback
                    />


                    {/* Inline Add New Item */}
                    <div className="flex gap-2 mt-2">
                      <input
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        placeholder={`Add to ${titleCase(activeCategory)}...`}
                        value={newInputs[activeCategory] || ''}
                        onChange={(e) =>
                          setNewInputs((prev) => ({ ...prev, [activeCategory]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddChecklistItem(activeCategory);
                        }}
                      />
                      <button
                        onClick={() => handleAddChecklistItem(activeCategory)}
                        className="px-3 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
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
              {/* Header + Eco */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  Smart Packing Suggestions
                </h2>
                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                  <Leaf size={24} /> Eco Score: {ecoScore}%
                </div>
              </div>

              {/* Eco Progress Bar */}
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ecoScore}%` }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-green-400 to-teal-500"
                />
              </div>

              {/* Suggestions grouped by category */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.keys(smartCats).map((cat) => {
                  const items = (smartCats[cat] || []).filter((i) => !smartRemoved.includes(i.label));
                  if (!items.length) return null;
                  return (
                    <div key={`smart-${cat}`} className="bg-white rounded-2xl p-4 shadow border border-gray-100">
                      <h3 className="text-lg font-bold mb-3">{titleCase(cat)}</h3>
                      <ul className="space-y-2">
                        {items.map((it) => (
                          <li
                            key={`sug-${cat}-${it.label}`}
                            className="flex items-center justify-between gap-3 bg-emerald-50/60 rounded-xl px-3 py-2"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-800">{it.label}</span>
                              {it.eco && <span className="text-xs text-emerald-700">Eco-friendly</span>}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRemoveSmart(it.label)}
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
