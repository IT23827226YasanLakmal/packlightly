'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePackingListStore } from "@/store/packingListStore";
import { useTripStore } from "@/store/tripStore";
import { PackingList, Trip } from "@/types";

// Helper functions to transform data for UI
const getPackingListId = (list: PackingList) => list._id?.toString() || '';
const getTripId = (trip: Trip) => trip._id || '';
const getPackingListDescription = (list: PackingList) => {
  const totalItems = list.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  return `${totalItems} items across ${list.categories.length} categories`;
};
const getPackingListItemsCount = (list: PackingList) => 
  list.categories.reduce((sum, cat) => sum + cat.items.length, 0);

export default function PackingListsPage() {
  const { packingLists, fetchPackingLists, deletePackingList, loading, error } = usePackingListStore();
  const { trips, fetchTrips } = useTripStore();
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

  // Helper function to get trip name using tripStore
  const getTripNameById = (tripId: string) => {
    const trip = trips.find((t) => getTripId(t) === tripId);
    return trip?.title || 'Unknown Trip';
  };

  useEffect(() => {
    fetchPackingLists();
    fetchTrips();
    if (tripIdParam) setSelectedTrip(tripIdParam);
  }, [tripIdParam, fetchPackingLists, fetchTrips]);

  const handleDeleteList = (id: string) => {
    deletePackingList(id);
  };

  // Filtered + searched
  let filteredLists = packingLists
    .filter((list) => (selectedTrip ? getPackingListId(list) === selectedTrip || list.tripId?.toString() === selectedTrip : true))
    .filter((list) => list.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sorting - Note: PackingList doesn't have createdAt, so we'll use title for alphabetical sort instead
  filteredLists = [...filteredLists].sort((a, b) => {
    if (sortBy === "newest" || sortBy === "oldest") {
      // Fallback to alphabetical since no createdAt
      return sortBy === "newest" 
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    }
    if (sortBy === "itemsHigh") return getPackingListItemsCount(b) - getPackingListItemsCount(a);
    if (sortBy === "itemsLow") return getPackingListItemsCount(a) - getPackingListItemsCount(b);
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
    ? getTripNameById(selectedTrip)
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
              Loading Packing Lists
            </h3>
            <p className="text-sm text-green-600 mt-1 animate-pulse">Gathering your organized lists...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Error loading packing lists</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

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
                    <li key={getTripId(trip)} onClick={() => { setSelectedTrip(getTripId(trip)); setOpenTripDropdown(false); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 ${selectedTrip === getTripId(trip) ? "bg-emerald-100 font-medium" : ""}`}>
                      {trip.title}
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

        </div>
      </motion.div>

      {/* Packing List Cards */}
      {paginatedLists.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedLists.map((list) => (
                <motion.div key={getPackingListId(list)} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} transition={{ duration: 0.3 }} layout onClick={() => router.push(`/packinglist-overview?id=${getPackingListId(list)}`)} className="flex flex-col justify-between p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{list.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{getPackingListDescription(list)}</p>
                    {!selectedTrip && <p className="text-sm text-emerald-600 mt-2 font-medium">Trip: {getTripNameById(list.tripId?.toString() || '')}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <span className="text-sm text-emerald-700 font-medium">{getPackingListItemsCount(list)} items</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteList(getPackingListId(list)); }} className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition">
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
          <Image src="/empty-state.svg" alt="No lists" width={160} height={120} className="mb-6 opacity-80" />
          <p className="text-lg font-medium">No packing lists found</p>
          <p className="text-sm mt-1">Create your first list to start organizing your trip essentials.</p>
        </motion.div>
      )}
    </div>
  );
}
