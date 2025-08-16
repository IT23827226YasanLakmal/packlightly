'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Leaf, MapPin, ChevronDown, Search } from "lucide-react";

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  packingLists?: PackingList[];
  createdAt: string;
}

interface PackingList {
  id: string;
  title: string;
  itemsCount: number;
}

export default function AllTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    // Mock API fetch
    const fetchedTrips: Trip[] = [
      {
        id: "1",
        name: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-07-15",
        endDate: "2024-07-22",
        createdAt: "2024-07-01",
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
        createdAt: "2024-07-05",
        packingLists: [{ id: "p3", title: "Summer Essentials", itemsCount: 10 }],
      },
      {
        id: "3",
        name: "Tokyo Adventure",
        destination: "Tokyo, Japan",
        startDate: "2024-09-01",
        endDate: "2024-09-10",
        createdAt: "2024-08-01",
        packingLists: [],
      },
      // Add more trips as needed
    ];
    setTrips(fetchedTrips);
  }, []);

  const handleDeleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
  };

  // Filter + Search
  let filteredTrips = trips.filter(
    (trip) =>
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
  filteredTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
    if (sortBy === "nameDesc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
          All Trips
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-400 bg-white/80 backdrop-blur-md"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button onClick={() => setOpenSortDropdown(!openSortDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-xl border shadow-sm hover:shadow transition">
              Sort: <span className="font-medium capitalize">
                {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "nameAsc" ? "Name A→Z" : "Name Z→A"}
              </span>
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {openSortDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border p-2 z-20"
                >
                  {[
                    { key: "newest", label: "Newest" },
                    { key: "oldest", label: "Oldest" },
                    { key: "nameAsc", label: "Name A→Z" },
                    { key: "nameDesc", label: "Name Z→A" },
                  ].map((option) => (
                    <li
                      key={option.key}
                      onClick={() => { setSortBy(option.key); setOpenSortDropdown(false); setCurrentPage(1); }}
                      className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 ${sortBy === option.key ? "bg-emerald-100 font-medium" : ""}`}
                    >
                      {option.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* New Trip */}
          <button
            onClick={() => router.push("/dashboard/create-new-trip")}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium rounded-xl shadow hover:from-green-700 hover:to-emerald-600 transition"
          >
            <Plus size={18} /> New Trip
          </button>
        </div>
      </div>

      {/* Trip Cards */}
      {paginatedTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedTrips.map((trip) => (
              <motion.div
                key={trip.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between cursor-pointer transition-transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => router.push(`/dashboard/trips/packinglist-overview?id=${trip.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{trip.name}</h2>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin size={16} /> {trip.destination}
                    </div>
                    <p className="text-sm text-emerald-600 mt-1 font-medium">{trip.startDate} → {trip.endDate}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {trip.packingLists && trip.packingLists.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-700">Packing Lists:</span>
                    {trip.packingLists.map((list) => (
                      <div key={list.id} className="flex items-center gap-2 text-sm text-emerald-600">
                        <Leaf size={16} /> <span>{list.title} ({list.itemsCount} items)</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <img src="/empty-state.svg" alt="No trips" className="w-40 mb-6 opacity-80" />
          <p className="text-lg font-medium">No trips found</p>
          <p className="text-sm mt-1">Create your first trip to start organizing packing lists.</p>
        </div>
      )}

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
            className={`px-3 py-1 rounded-xl border shadow hover:bg-emerald-50 ${
              currentPage === page ? "bg-emerald-100 font-medium" : ""
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

    </div>
  );
}
