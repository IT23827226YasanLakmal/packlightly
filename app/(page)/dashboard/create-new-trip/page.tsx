"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock API placeholders
const api = {
  createTrip: async (trip: any) => ({ ...trip, id: Date.now().toString() }),
  createPackingList: async (list: any) => list,
};

// Default packing list generator
const generatePackingLists = (trip: any) => {
  const lists = [];

  const clothing = [
    { label: "3 x T-shirts", eco: trip.ecoSuggestions },
    { label: "1 x Jacket", eco: trip.ecoSuggestions },
    { label: "3 x Pants/Jeans" },
    { label: "7 x Underwear", eco: trip.ecoSuggestions },
    { label: "7 x Socks", eco: trip.ecoSuggestions },
  ];

  const essentials = [
    { label: "Passport & Travel Documents" },
    { label: "Reusable Water Bottle", eco: trip.ecoSuggestions },
    { label: "Charger / Adapter" },
  ];

  const toiletries = [
    { label: "Bamboo Toothbrush", eco: trip.ecoSuggestions },
    { label: "Solid Shampoo Bar", eco: trip.ecoSuggestions },
  ];

  lists.push({ title: "Clothing", items: clothing });
  lists.push({ title: "Essentials", items: essentials });
  lists.push({ title: "Toiletries", items: toiletries });

  return lists;
};

export default function CreateNewTripPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripType, setTripType] = useState("");
  const [travelMode, setTravelMode] = useState("");
  const [ecoSuggestions, setEcoSuggestions] = useState(true);
  const [generatedLists, setGeneratedLists] = useState<any[]>([]);

  const handlePreviewLists = () => {
    const tripData = { name, destination, startDate, endDate, tripType, travelMode, ecoSuggestions };
    setGeneratedLists(generatePackingLists(tripData));
  };

  const handleCreateTrip = async () => {
    const tripData = { name, destination, startDate, endDate, tripType, travelMode, ecoSuggestions };
    const createdTrip = await api.createTrip(tripData);

    const defaultLists = generatePackingLists(tripData);
    for (let list of defaultLists) {
      await api.createPackingList({ ...list, tripId: createdTrip.id });
    }

    router.push(`/dashboard/packinglist-overview?tripId=${createdTrip.id}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0e1b13]">Create New Trip</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-xl bg-[#e7f3e7] font-semibold text-[#0d1b0d]"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Trip Form */}
      <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-4 max-w-3xl">
        <input
          type="text"
          placeholder="Trip Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#cfe7cf] rounded-xl p-4 bg-[#f8fcf8] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border border-[#cfe7cf] rounded-xl p-4 bg-[#f8fcf8] focus:outline-none"
        />
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-[#cfe7cf] rounded-xl p-4 bg-[#f8fcf8] focus:outline-none flex-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-[#cfe7cf] rounded-xl p-4 bg-[#f8fcf8] focus:outline-none flex-1"
          />
        </div>

        <select
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          className="border border-[#cfe7cf] rounded-xl p-4 bg-[#f8fcf8] focus:outline-none"
        >
          <option value="">Select Trip Type</option>
          <option value="Business">Business</option>
          <option value="Vacation">Vacation</option>
          <option value="Adventure">Adventure</option>
        </select>

        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="border border-[#cfe7cf] rounded-xl p-4 bg-[#f8fcf8] focus:outline-none"
        >
          <option value="">Select Travel Mode</option>
          <option value="Car">Car</option>
          <option value="Flight">Flight</option>
          <option value="Train">Train</option>
        </select>

        <div className="flex justify-between items-center">
          <span>Include Eco Suggestions?</span>
          <input
            type="checkbox"
            checked={ecoSuggestions}
            onChange={() => setEcoSuggestions(!ecoSuggestions)}
            className="h-6 w-12 rounded-full accent-[#13eb13] cursor-pointer"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={handlePreviewLists}
            className="px-6 py-2 rounded-xl bg-[#4c9a4c] text-white font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Preview Lists
          </button>
          <button
            onClick={handleCreateTrip}
            className="px-6 py-2 rounded-xl bg-[#13eb13] text-[#0d1b0d] font-bold"
          >
            Create Trip
          </button>
        </div>
      </div>

      {/* Animated Packing Lists Preview */}
      <AnimatePresence>
        {generatedLists.length > 0 && (
          <motion.div
            className="grid md:grid-cols-3 gap-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {generatedLists.map((list, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-2 font-bold text-[#0e1b13]">
                  <Leaf size={20} className="text-green-600" />
                  {list.title}
                </div>
                <ul className="list-disc ml-5 text-gray-700">
                  {list.items.map((item: any, i: number) => (
                    <li key={i} className={`${item.eco ? "text-green-600 font-semibold" : ""}`}>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
