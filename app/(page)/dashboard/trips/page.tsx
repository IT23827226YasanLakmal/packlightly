"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Leaf } from "lucide-react";

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  packingLists?: PackingList[];
}

interface PackingList {
  id: string;
  title: string;
  itemsCount: number;
}

export default function AllTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    // Mock fetch trips
    const fetchedTrips: Trip[] = [
      {
        id: "1",
        name: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-07-15",
        endDate: "2024-07-22",
        packingLists: [
          { id: "p1", title: "Clothing", itemsCount: 12 },
          { id: "p2", title: "Essentials", itemsCount: 8 },
        ],
      },
      {
        id: "2",
        name: "Beach Holiday",
        destination: "Maldives",
        startDate: "2024-08-10",
        endDate: "2024-08-17",
        packingLists: [
          { id: "p3", title: "Summer Essentials", itemsCount: 10 },
        ],
      },
    ];
    setTrips(fetchedTrips);
  }, []);

  const handleDeleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0e1b13]">All Trips</h1>
        <button
          onClick={() => router.push("/dashboard/create-new-trip")}
          className="flex items-center gap-2 px-4 py-2 bg-[#4c9a4c] text-white rounded-xl hover:bg-[#3e7e3e] transition"
        >
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Trip Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 cursor-pointer hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => router.push(`/dashboard/trips/packinglist-overvi`)}
              >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[#0e1b13]">{trip.name}</h2>
                  <p className="text-sm text-gray-600">{trip.destination}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {trip.startDate} → {trip.endDate}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTrip(trip.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Packing Lists Preview */}
              {trip.packingLists && trip.packingLists.length > 0 && (
                <div className="mt-3 flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-700">Packing Lists:</span>
                  {trip.packingLists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center gap-2 text-sm text-[#4c9a4c]"
                    >
                      <Leaf size={16} />
                      <span>{list.title} ({list.itemsCount} items)</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
