'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Plus } from 'lucide-react';
import WeatherCard from '@/components/dashboard/weathercard';
import ChecklistSection from '@/components/dashboard/checklistsection';

/** -----------------------------
 * Types
 * ----------------------------*/
type Item = { label: string; eco?: boolean };
type CategoryItems = Record<string, Item[]>;

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  durationDays: number;
}

interface PackingList {
  id: string;
  tripId: string;
  name: string;
  categories: CategoryItems;
}

/** -----------------------------
 * Mock Data (swap with API later)
 * ----------------------------*/
const tripsSeed: Trip[] = [
  {
    id: 't1',
    name: 'Paris Trip',
    destination: 'Paris',
    startDate: '2024-07-15',
    endDate: '2024-07-22',
    durationDays: 7,
  },
  {
    id: 't2',
    name: 'Tokyo Adventure',
    destination: 'Tokyo',
    startDate: '2024-09-05',
    endDate: '2024-09-15',
    durationDays: 10,
  },
];

const packingListsSeed: PackingList[] = [
  {
    id: 'pl1',
    tripId: 't1',
    name: 'Main Packing List',
    categories: {
      Clothing: [
        { label: '3 x T-shirts (organic cotton)', eco: true },
        { label: '1 x Lightweight jacket (recycled materials)', eco: true },
        { label: '1 x Pair of jeans (water-efficient denim)' },
        { label: '7 x Underwear (bamboo fabric)', eco: true },
        { label: '7 x Socks (recycled polyester)', eco: true },
      ],
      Essentials: [
        { label: 'Passport & travel documents' },
        { label: 'Reusable water bottle', eco: true },
        { label: 'Portable charger' },
        { label: 'Travel adapter' },
      ],
      Toiletries: [
        { label: 'Solid shampoo bar (eco-friendly)', eco: true },
        { label: 'Refillable travel-sized containers', eco: true },
        { label: 'Bamboo toothbrush', eco: true },
        { label: 'Mineral sunscreen (reef-safe)', eco: true },
      ],
      Electronics: [{ label: 'Phone & charger' }],
    },
  },
  {
    id: 'pl2',
    tripId: 't2',
    name: 'Japan Essentials',
    categories: {
      Clothing: [
        { label: '4 x Breathable tees (organic cotton)', eco: true },
        { label: 'Packable rain jacket', eco: false },
      ],
      Essentials: [
        { label: 'Passport & travel documents' },
        { label: 'JR Pass / IC Card' },
        { label: 'Reusable water bottle', eco: true },
      ],
      Toiletries: [{ label: 'Solid shampoo bar (eco-friendly)', eco: true }],
      Electronics: [
        { label: 'Phone & charger' },
        { label: 'Universal adapter' },
        { label: 'Power bank' },
      ],
    },
  },
];

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
 * Smart Suggestions (rule-based demo)
 * Swap with your real smart logic later
 * ----------------------------*/
const generateSmartSuggestions = (trip: Trip): CategoryItems => {
  // Basic weather/duration informed suggestions (mock)
  const warmWeather = ['paris'].includes(trip.destination.toLowerCase());
  const longTrip = trip.durationDays >= 8;

  const base: CategoryItems = {
    Essentials: [
      { label: 'Copy of documents (digital & paper)' },
      { label: 'Reusable water bottle', eco: true },
      { label: 'Reusable shopping tote', eco: true },
    ],
    Clothing: [
      { label: warmWeather ? 'Sun hat' : 'Beanie' },
      { label: longTrip ? 'Laundry kit (eco detergent sheets)' : 'Compact laundry bar', eco: true },
      { label: 'Packable rain jacket' },
    ],
    Toiletries: [
      { label: 'Solid conditioner bar', eco: true },
      { label: 'Safety razor (with guard)', eco: true },
      { label: 'Refillable travel containers', eco: true },
    ],
    Electronics: [
      { label: 'Universal travel adapter' },
      { label: 'Power bank' },
      { label: 'Cable organizer' },
    ],
  };

  return base;
};

/** -----------------------------
 * Component
 * ----------------------------*/
export default function PackingListOverviewPage() {
  const router = useRouter();

  // Selection
  const [activeTab, setActiveTab] = useState<'weather' | 'checklist' | 'smart'>('weather');
  const [selectedTripId, setSelectedTripId] = useState<string>(tripsSeed[0].id);
  const [selectedListId, setSelectedListId] = useState<string>(
    packingListsSeed.find((p) => p.tripId === tripsSeed[0].id)?.id || ''
  );

  // Checklist state (per selected list)
  const currentListSeed =
    packingListsSeed.find((p) => p.id === selectedListId)?.categories || {};
  const [checklistCats, setChecklistCats] = useState<CategoryItems>(
    deepCloneCategories(currentListSeed)
  );

  // Removed items (ChecklistSection compatibility)
  const [removedItems, setRemovedItems] = useState<string[]>([]);

  // New item inputs per category
  const [newInputs, setNewInputs] = useState<Record<string, string>>({});

  // Eco score (auto computed)
  const ecoScore = useMemo(() => countEco(checklistCats, removedItems).score, [checklistCats, removedItems]);

  // Smart suggestions state (grouped by category) & removal
  const currentTrip = useMemo(
    () => tripsSeed.find((t) => t.id === selectedTripId)!,
    [selectedTripId]
  );
  const [smartCats, setSmartCats] = useState<CategoryItems>(generateSmartSuggestions(currentTrip));
  const [smartRemoved, setSmartRemoved] = useState<string[]>([]);

  /** ---------- Effects ---------- */
  // When trip changes: reset list options & smart suggestions
  useEffect(() => {
    const firstListForTrip = packingListsSeed.find((p) => p.tripId === selectedTripId)?.id || '';
    setSelectedListId(firstListForTrip);
    setSmartCats(generateSmartSuggestions(currentTrip));
    setSmartRemoved([]);
  }, [selectedTripId]); // eslint-disable-line

  // When list changes: load its categories
  useEffect(() => {
    const seed = packingListsSeed.find((p) => p.id === selectedListId)?.categories || {};
    setChecklistCats(deepCloneCategories(seed));
    setRemovedItems([]);
    setNewInputs({});
  }, [selectedListId]);

  /** ---------- Actions ---------- */
  const handleAddChecklistItem = (category: string) => {
    const value = (newInputs[category] || '').trim();
    if (!value) return;
    setChecklistCats((prev) => {
      const existing = prev[category] || [];
      // avoid duplicates by label
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
    // Also clean from removedItems list (if it had been toggled there)
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

  // Derived: lists for selected trip
  const listsForTrip = useMemo(
    () => packingListsSeed.filter((pl) => pl.tripId === selectedTripId),
    [selectedTripId]
  );

  // For WeatherCard (mocked from current trip)
  const weatherCardProps = {
    location: currentTrip.destination,
    tempRange: currentTrip.destination.toLowerCase() === 'paris' ? '22°C - 28°C' : '20°C - 27°C',
    description:
      currentTrip.destination.toLowerCase() === 'paris'
        ? 'Sunny with occasional showers'
        : 'Partly cloudy with light breeze',
    condition:
      currentTrip.destination.toLowerCase() === 'paris' ? ('sunny' as const) : ('cloudy' as const),
    highTemp: '28°C',
    lowTemp: '20°C',
    wind: '12 km/h',
    humidity: '60%',
    chanceRain: '15%',
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f5f8f6] text-gray-800">
      {/* Animated Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl transition-shadow duration-500 hover:shadow-2xl overflow-hidden">
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

        {/* Left Section */}
        <div className="flex items-center gap-5 relative z-10">
          <button
            onClick={() => router.push('/dashboard/packinglists')}
            className="px-5 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 hover:animate-glow"
          >
            &larr; Dashboard
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 animate-slideIn animate-pulseGlow">
              {tripsSeed.find((t) => t.id === selectedTripId)?.name}
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
              {tripsSeed.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/80 border border-gray-200 shadow-sm hover:bg-white transition"
            >
              {listsForTrip.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name}
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
                  ${
                    activeTab === tab.id
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
      <main className="flex-1 flex flex-col px-6 md:px-12 py-6 gap-6">
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
              <WeatherCard {...weatherCardProps} />
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

              {/* Checklist Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {Object.keys(checklistCats).map((cat) => (
                  <div key={cat} className="space-y-3">
                    {/* Your existing component (keeps original interactivity) */}
                    <ChecklistSection
                      title={titleCase(cat)}
                      items={(checklistCats[cat] || []).filter((i) => !removedItems.includes(i.label))}
                    />

                    {/* Inline Add New Item */}
                    <div className="flex gap-2">
                      <input
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        placeholder={`Add to ${titleCase(cat)}...`}
                        value={newInputs[cat] || ''}
                        onChange={(e) => setNewInputs((prev) => ({ ...prev, [cat]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddChecklistItem(cat);
                        }}
                      />
                      <button
                        onClick={() => handleAddChecklistItem(cat)}
                        className="px-3 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow"
                        title="Add Item"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Optional Hard Remove section (for truly deleting items instead of hide/remove via ChecklistSection) */}
                    {(checklistCats[cat] || []).length > 0 && (
                      <div className="text-xs text-gray-500">
                        Tip: To permanently delete an item, use your list’s remove action in this page (not just “mark removed”).
                      </div>
                    )}

                    {/* Render hard-remove buttons inline under list (tiny UI) */}
                    <div className="flex flex-wrap gap-2">
                      {(checklistCats[cat] || []).map((i) => (
                        <button
                          key={`hard-${cat}-${i.label}`}
                          onClick={() => handleRemoveChecklistHard(cat, i.label)}
                          className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          title="Delete from list"
                        >
                          delete “{i.label}”
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
