'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Search, ChevronDown } from "lucide-react";

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
  createdAt: string; // for sorting
}

export default function PackingListsPage() {
  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const [openTripDropdown, setOpenTripDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const router = useRouter();
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get("tripId");

  useEffect(() => {
    // Fake API data
    const fetchedTrips: Trip[] = [
      { id: "1", name: "Paris Trip" },
      { id: "2", name: "Beach Holiday" },
    ];
    setTrips(fetchedTrips);

    const fetchedLists: PackingList[] = [
      { id: "a1", title: "Winter Packing", description: "Warm clothes and accessories", tripId: "1", itemsCount: 12, createdAt: "2025-08-10" },
      { id: "a2", title: "Summer Essentials", description: "Light clothing and sunscreen", tripId: "2", itemsCount: 8, createdAt: "2025-08-15" },
      { id: "a3", title: "Adventure Gear", description: "Hiking & camping items", tripId: "1", itemsCount: 15, createdAt: "2025-08-12" },
      { id: "a4", title: "City Tour Items", description: "Comfortable shoes & maps", tripId: "1", itemsCount: 10, createdAt: "2025-08-13" },
      { id: "a5", title: "Beach Fun", description: "Swimwear & sunscreen", tripId: "2", itemsCount: 7, createdAt: "2025-08-14" },
      { id: "a6", title: "Camping Gear", description: "Tent & sleeping bags", tripId: "1", itemsCount: 18, createdAt: "2025-08-11" },
      { id: "a7", title: "Winter Accessories", description: "Gloves, scarves, hats", tripId: "1", itemsCount: 9, createdAt: "2025-08-16" },
    ];
    setPackingLists(fetchedLists);

    if (tripIdParam) setSelectedTrip(tripIdParam);
  }, [tripIdParam]);

  const handleDeleteList = (id: string) => {
    setPackingLists((prev) => prev.filter((list) => list.id !== id));
  };

  // Filtered + searched
  let filteredLists = packingLists
    .filter((list) => (selectedTrip ? list.tripId === selectedTrip : true))
    .filter((list) => list.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sorting
  filteredLists = [...filteredLists].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "itemsHigh") return b.itemsCount - a.itemsCount;
    if (sortBy === "itemsLow") return a.itemsCount - b.itemsCount;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);
  const paginatedLists = filteredLists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const currentTripName = selectedTrip
    ? trips.find((t) => t.id === selectedTrip)?.name
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
            {currentTripName ? `${currentTripName} – Packing Lists` : "All Packing Lists"}
          </h1>
          {currentTripName && <p className="text-sm text-gray-600 mt-1">Manage packing lists for this trip</p>}
        </div>

        {/* Controls: Search + Trip Filter + Sort + New List */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-400 bg-white/80 backdrop-blur-md"
            />
          </div>

          {/* Trip Filter Dropdown */}
          <div className="relative">
            <button onClick={() => setOpenTripDropdown(!openTripDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-xl border shadow-sm hover:shadow transition">
              Trip: <span className="font-medium">{currentTripName || "All Trips"}</span>
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {openTripDropdown && (
                <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border p-2 z-20">
                  <li onClick={() => { setSelectedTrip(null); setOpenTripDropdown(false); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 ${!selectedTrip ? "bg-emerald-100 font-medium" : ""}`}>All Trips</li>
                  {trips.map((trip) => (
                    <li key={trip.id} onClick={() => { setSelectedTrip(trip.id); setOpenTripDropdown(false); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 ${selectedTrip === trip.id ? "bg-emerald-100 font-medium" : ""}`}>
                      {trip.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button onClick={() => setOpenSortDropdown(!openSortDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-xl border shadow-sm hover:shadow transition">
              Sort: <span className="font-medium capitalize">{sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "itemsHigh" ? "Items (High → Low)" : "Items (Low → High)"}</span>
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {openSortDropdown && (
                <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border p-2 z-20">
                  {[
                    { key: "newest", label: "Newest" },
                    { key: "oldest", label: "Oldest" },
                    { key: "itemsHigh", label: "Items (High → Low)" },
                    { key: "itemsLow", label: "Items (Low → High)" },
                  ].map((option) => (
                    <li key={option.key} onClick={() => { setSortBy(option.key); setOpenSortDropdown(false); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 ${sortBy === option.key ? "bg-emerald-100 font-medium" : ""}`}>{option.label}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* New List */}
          <button onClick={() => router.push(`/dashboard/create-packinglist${selectedTrip ? `?tripId=${selectedTrip}` : ""}`)} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium rounded-xl shadow hover:from-green-700 hover:to-emerald-600 transition">
            <Plus size={18} /> New List
          </button>
        </div>
      </motion.div>

      {/* Packing List Cards */}
      {paginatedLists.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedLists.map((list) => (
                <motion.div key={list.id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} transition={{ duration: 0.3 }} layout onClick={() => router.push(`/packinglist-overview?id=${list.id}`)} className="flex flex-col justify-between p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{list.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                    {!selectedTrip && <p className="text-sm text-emerald-600 mt-2 font-medium">Trip: {trips.find((t) => t.id === list.tripId)?.name}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <span className="text-sm text-emerald-700 font-medium">{list.itemsCount} items</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }} className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50"
            >
              {"<<"} First
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50"
            >
              {"<"} Prev
            </button>

            {/* Page numbers with ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              )
              .map((page, index, arr) => {
                const prev = arr[index - 1];
                return (
                  <span key={page}>
                    {prev && page - prev > 1 && <span className="px-2">...</span>}
                    <button
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded-xl border shadow hover:bg-emerald-50 ${currentPage === page ? "bg-emerald-100 font-medium" : ""
                        }`}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50"
            >
              Next {">"}
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50"
            >
              Last {">>"}
            </button>
          </div>

        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <img src="/empty-state.svg" alt="No lists" className="w-40 mb-6 opacity-80" />
          <p className="text-lg font-medium">No packing lists found</p>
          <p className="text-sm mt-1">Create your first list to start organizing your trip essentials.</p>
        </motion.div>
      )}
    </div>
  );
}
