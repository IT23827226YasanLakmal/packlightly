'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

interface Trip {
  id: string;
  name: string;
}

interface PackingList {
  id: string;
  title: string;
  description: string;
  tripId: string;
  itemsCount: number;
}

export default function PackingListsPage() {
  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  useEffect(() => {
    // TODO: Replace with real API calls
    const fetchedTrips: Trip[] = [
      { id: "1", name: "Paris Trip" },
      { id: "2", name: "Beach Holiday" },
    ];
    setTrips(fetchedTrips);

    const fetchedLists: PackingList[] = [
      {
        id: "a1",
        title: "Winter Packing",
        description: "Warm clothes and accessories",
        tripId: "1",
        itemsCount: 12,
      },
      {
        id: "a2",
        title: "Summer Essentials",
        description: "Light clothing and sunscreen",
        tripId: "2",
        itemsCount: 8,
      },
      {
        id: "a3",
        title: "Adventure Gear",
        description: "Hiking & camping items",
        tripId: "1",
        itemsCount: 15,
      },
    ];
    setPackingLists(fetchedLists);
  }, []);

  const handleDeleteList = (id: string) => {
    setPackingLists((prev) => prev.filter((list) => list.id !== id));
  };

  const filteredLists = packingLists
    .filter((list) => (tripId ? list.tripId === tripId : true))
    .filter((list) => list.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentTripName = tripId
    ? trips.find((t) => t.id === tripId)?.name
    : null;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0e1b13]">
            {tripId ? `${currentTripName} - Packing Lists` : "All Packing Lists"}
          </h1>
          {tripId && <p className="text-sm text-gray-600 mt-1">Manage packing lists for this trip</p>}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#4c9a4c]"
          />
          <button
            onClick={() => router.push(`/dashboard/create-packinglist${tripId ? `?tripId=${tripId}` : ""}`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4c9a4c] text-white rounded-lg hover:bg-[#3e7e3e] transition"
          >
            <Plus size={18} /> New List
          </button>
        </div>
      </div>

      {/* Packing List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredLists.map((list) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
              onClick={() => router.push(`/packinglist-overview?id=${list.id}`)}
              className="flex flex-col justify-between p-5 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <h2 className="text-lg font-bold text-[#0e1b13]">{list.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                { !tripId && (
                  <p className="text-sm text-[#4c9a4c] mt-1">
                    Trip: {trips.find((t) => t.id === list.tripId)?.name}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-[#4c9a4c]">{list.itemsCount} items</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
