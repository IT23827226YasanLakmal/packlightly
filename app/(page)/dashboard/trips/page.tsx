"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Leaf, MapPin, Plus } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { usePackingListStore } from "@/store/packingListStore";

import { Trip } from '@/types/index';

export default function AllTripsTable() {
  const { trips, loading, selectedTripId, error, fetchTrips, setSelectedTripId } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showGeneratePrompt, setShowGeneratePrompt] = useState(false);
  const { packingLists, fetchPackingLists, addPackingList } = usePackingListStore();



  const [newTrip, setNewTrip] = useState<Trip>({
    ownerUid: "",
    title: "",
    name: "",
    type: "Solo",
    destination: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    durationDays: 0,
    passengers: { adults: 0, children: 0, total: 1 },
    budget: 0,
    weather: {
      location: "",
      tempRange: "",
      description: "",
      condition: "",
      highTemp: "",
      lowTemp: "",
      wind: "",
      humidity: "",
      chanceRain: "",
    },
    packingLists: [],
  });

  useEffect(() => {
    fetchTrips().catch(console.error);
  }, [fetchTrips]);

    useEffect(() => {
    if (selectedTripId) {
      fetchPackingLists(selectedTripId).catch(console.error);
    }
  }, [selectedTripId, fetchPackingLists]);


  // DELETE TRIP
  const handleDeleteTrip = (tripId: string) => {
    const confirmed = confirm("Are you sure you want to delete this trip?");
    if (!confirmed) return;

    // Update store directly
    useTripStore.setState({
      trips: trips.filter((trip) => trip._id !== tripId),
    });

    if (selectedTrip?._id === tripId) setSelectedTrip(null);
  };

  // CREATE TRIP
  const handleCreateTrip = () => {
    const createdTrip: Trip = {
      ...newTrip,
      _id: String(Date.now()),
    };

    useTripStore.setState({
      trips: [createdTrip, ...trips],
    });

    setNewTrip({
      ownerUid: "",
      title: "",
      name: "",
      type: "Solo",
      destination: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      durationDays: 0,
      passengers: { adults: 0, children: 0, total: 1 },
      budget: 0,
      weather: {
        location: "",
        tempRange: "",
        description: "",
        condition: "",
        highTemp: "",
        lowTemp: "",
        wind: "",
        humidity: "",
        chanceRain: "",
      },
      packingLists: [],
    });

    setOpenCreateModal(false);
    setSelectedTrip(createdTrip);
    setShowGeneratePrompt(true);
  };

  const handleGeneratePackingList = (trip: Trip) => {
  addPackingList(trip._id?.toString() || "", "Smart Packing List");

  // Refresh local state
  fetchPackingLists(trip._id?.toString() || "").catch(console.error);

  setShowGeneratePrompt(false);
};

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-white/60">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-black">All Trips</h1>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
        >
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-green-200">
        <table className="w-full text-left">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Packing Lists</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {trips.map((trip) => (
                <motion.tr
                  key={trip._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-b border-green-100 cursor-pointer hover:bg-green-50 transition"
                  onClick={() => {
                    setSelectedTrip(trip);
                    setOpenDrawer(true);
                    setSelectedTripId(trip._id ? trip._id.toString() : "");
                  }}
                >
                  <td className="px-4 py-3 font-medium text-black">{trip.title}</td>
                  <td className="px-4 py-3 text-green-700 flex items-center gap-1">
                    <MapPin size={16} /> {trip.destination}
                  </td>
                  <td className="px-4 py-3 text-green-500">
                    {trip.startDate} → {trip.endDate}
                  </td>
                  <td className="px-4 py-3">
                    {packingLists && packingLists.length > 0 ? (
                      packingLists.map((list) => (
                        <div key={list._id?.toString()} className="flex items-center gap-1 text-green-600">
                          <Leaf size={14} /> {list.title} ({list.categories.reduce((acc, cat) => acc + cat.items.length, 0)})
                        </div>
                      ))
                    ) : (
                      <span className="text-black/50">No lists</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrip(trip._id ? trip._id.toString() : "");
                      }}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Drawer, Modal & Prompt remain the same as your original code */}
      {/* Edit Drawer */}
      <AnimatePresence>
        {openDrawer && selectedTrip && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpenDrawer(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-green-200 p-5 overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-2">{selectedTrip.title}</h3>
              <p className="text-sm text-black/60 mb-4">{selectedTrip.destination}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-sm font-medium text-black/70">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedTrip.startDate}
                    onChange={(e) =>
                      setSelectedTrip({ ...selectedTrip, startDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={selectedTrip.endDate}
                    onChange={(e) =>
                      setSelectedTrip({ ...selectedTrip, endDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">
                  Packing Lists
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  {selectedTrip.packingLists && selectedTrip.packingLists.length > 0 ? (
                    selectedTrip.packingLists.map((list) => (
                      <div
                        key={list.id}
                        className="flex items-center justify-between text-green-600"
                      >
                        <span>
                          {list.title} ({list.itemsCount})
                        </span>
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedTrip({
                              ...selectedTrip,
                              packingLists: selectedTrip.packingLists!.filter(
                                (p) => p.id !== list.id
                              ),
                            });
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-black/50 py-3">
                      No packing lists
                      <button
                        onClick={() => handleGeneratePackingList(selectedTrip)}
                        className="mt-3 w-full rounded-xl bg-green-500 text-white py-2 font-semibold hover:bg-green-600 transition animate-pulse"
                      >
                        ➕ Generate Smart Packing List
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setOpenDrawer(false)}
                  className="rounded-xl border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setOpenDrawer(false)}
                  className="rounded-xl bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Trip Modal */}
      <AnimatePresence>
        {openCreateModal && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpenCreateModal(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-green-200 p-5 overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">Create New Trip</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-black/70">Name</label>
                  <input
                    type="text"
                    value={newTrip.name}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, destination: e.target.value })
                    }
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, startDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, endDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setOpenCreateModal(false)}
                    className="rounded-xl border px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTrip}
                    className="rounded-xl bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Packing List Prompt (after create) */}
      <AnimatePresence>
        {showGeneratePrompt && selectedTrip && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowGeneratePrompt(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center"
            >
              <h3 className="text-xl font-bold text-black mb-3">
                🎉 {selectedTrip.name} Created!
              </h3>
              <p className="text-black/70 mb-4">
                Would you like to generate a packing list now?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleGeneratePackingList(selectedTrip)}
                  className="rounded-xl bg-green-500 text-white px-5 py-2 font-semibold hover:bg-green-600"
                >
                  Generate Now
                </button>
                <button
                  onClick={() => setShowGeneratePrompt(false)}
                  className="rounded-xl border px-5 py-2"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
