"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Leaf, MapPin, Plus } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { usePackingListStore } from "@/store/packingListStore"; 

import { Trip } from '@/types/index';

export default function AllTripsTable() {
  const {trips, loading, error, fetchTrips, setSelectedTripId, updateTrip } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [savingTrip, setSavingTrip] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showGeneratePrompt, setShowGeneratePrompt] = useState(false);
  const [generatingPackingList, setGeneratingPackingList] = useState(false);
  const {packingLists, fetchPackingLists, generatePackingListForTrip } = usePackingListStore();



  const [newTrip, setNewTrip] = useState<Trip>({
    ownerUid: "",
    title: "",
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
  });

  useEffect(() => {
    fetchTrips().catch(console.error);
  }, [fetchTrips]);

  useEffect(() => {
      fetchPackingLists().catch(console.error);
    }, [fetchPackingLists]);


  // DELETE TRIP
  const handleDeleteTrip = async (tripId: string) => {
    const confirmed = confirm("Are you sure you want to delete this trip?");
    if (!confirmed) return;

    await useTripStore.getState().deleteTrip(tripId);

    if (selectedTrip?._id === tripId) setSelectedTrip(null);
  };

  // CREATE TRIP
  const handleCreateTrip = async () => {
    await useTripStore.getState().createTrip(newTrip);
    setNewTrip({
      ownerUid: "",
      title: "",
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
        condition: "Sunny",
        highTemp: "",
        lowTemp: "",
        wind: "",
        humidity: "",
        chanceRain: "",
      },
    });
    setOpenCreateModal(false);
    setShowGeneratePrompt(true);
  };

  const handleGeneratePackingList = async () => {
    if (!selectedTrip || !selectedTrip._id || generatingPackingList) return;
    setGeneratingPackingList(true);
    await generatePackingListForTrip(selectedTrip._id.toString());
    setGeneratingPackingList(false);
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
                    {packingLists && packingLists.filter(list => list.tripId?.toString() === trip._id?.toString()).length > 0 ? (
                      packingLists
                        .filter(list => list.tripId?.toString() === trip._id?.toString())
                        .map((list) => (
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
              {/* Editable Trip Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-black/70">Title</label>
                  <input
                    type="text"
                    value={selectedTrip.title}
                    onChange={e => setSelectedTrip({ ...selectedTrip, title: e.target.value })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Type</label>
                  <select
                    value={selectedTrip.type}
                    onChange={e => setSelectedTrip({ ...selectedTrip, type: e.target.value as Trip["type"] })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Destination</label>
                  <input
                    type="text"
                    value={selectedTrip.destination}
                    onChange={e => setSelectedTrip({ ...selectedTrip, destination: e.target.value })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Start Date</label>
                    <input
                      type="date"
                      value={selectedTrip.startDate}
                      onChange={e => setSelectedTrip({ ...selectedTrip, startDate: e.target.value })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">End Date</label>
                    <input
                      type="date"
                      value={selectedTrip.endDate}
                      onChange={e => setSelectedTrip({ ...selectedTrip, endDate: e.target.value })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Duration (days)</label>
                  <input
                    type="number"
                    min={0}
                    value={selectedTrip.durationDays}
                    onChange={e => setSelectedTrip({ ...selectedTrip, durationDays: Number(e.target.value) })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Adults</label>
                    <input
                      type="number"
                      min={0}
                      value={selectedTrip.passengers.adults}
                      onChange={e => setSelectedTrip({ ...selectedTrip, passengers: { ...selectedTrip.passengers, adults: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Children</label>
                    <input
                      type="number"
                      min={0}
                      value={selectedTrip.passengers.children}
                      onChange={e => setSelectedTrip({ ...selectedTrip, passengers: { ...selectedTrip.passengers, children: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Total</label>
                    <input
                      type="number"
                      min={1}
                      value={selectedTrip.passengers.total}
                      onChange={e => setSelectedTrip({ ...selectedTrip, passengers: { ...selectedTrip.passengers, total: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Budget</label>
                  <input
                    type="number"
                    min={0}
                    value={selectedTrip.budget}
                    onChange={e => setSelectedTrip({ ...selectedTrip, budget: Number(e.target.value) })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                {/* Packing Lists display (read-only) */}
                <div>
                  <label className="text-sm font-medium text-black/70">Packing Lists</label>
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
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-black/50 py-3">
                        No packing lists
                        <button
                          onClick={handleGeneratePackingList}
                          className={`mt-3 w-full rounded-xl bg-green-500 text-white py-2 font-semibold transition animate-pulse ${generatingPackingList ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
                          disabled={generatingPackingList}
                        >
                          {generatingPackingList ? 'Generating...' : '➕ Generate Smart Packing List'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setOpenDrawer(false)}
                    className="rounded-xl border px-4 py-2"
                    disabled={savingTrip}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedTrip || !selectedTrip._id) return;
                      setSavingTrip(true);
                      await updateTrip(selectedTrip._id.toString(), selectedTrip);
                      setSavingTrip(false);
                      setOpenDrawer(false);
                    }}
                    className={`rounded-xl bg-green-500 text-white px-4 py-2 font-semibold transition ${savingTrip ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
                    disabled={savingTrip}
                  >
                    {savingTrip ? 'Saving...' : 'Save'}
                  </button>
                </div>
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
                  <label className="text-sm font-medium text-black/70">Title</label>
                  <input
                    type="text"
                    value={newTrip.title}
                    onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black/70">Type</label>
                  <select
                    value={newTrip.type}
                    onChange={(e) => setNewTrip({ ...newTrip, type: e.target.value as Trip["type"] })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Destination</label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Start Date</label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">End Date</label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Duration (days)</label>
                  <input
                    type="number"
                    min={0}
                    value={newTrip.durationDays}
                    onChange={(e) => setNewTrip({ ...newTrip, durationDays: Number(e.target.value) })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Adults</label>
                    <input
                      type="number"
                      min={0}
                      value={newTrip.passengers.adults}
                      onChange={(e) => setNewTrip({ ...newTrip, passengers: { ...newTrip.passengers, adults: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Children</label>
                    <input
                      type="number"
                      min={0}
                      value={newTrip.passengers.children}
                      onChange={(e) => setNewTrip({ ...newTrip, passengers: { ...newTrip.passengers, children: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Total</label>
                    <input
                      type="number"
                      min={1}
                      value={newTrip.passengers.total}
                      onChange={(e) => setNewTrip({ ...newTrip, passengers: { ...newTrip.passengers, total: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Budget</label>
                  <input
                    type="number"
                    min={0}
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({ ...newTrip, budget: Number(e.target.value) })}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  />
                </div>
                {/* Weather fields removed as requested */}
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
                🎉 {selectedTrip.title} Created!
              </h3>
              <p className="text-black/70 mb-4">
                Would you like to generate a packing list now?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleGeneratePackingList}
                  className={`rounded-xl bg-green-500 text-white px-5 py-2 font-semibold transition flex items-center justify-center ${generatingPackingList ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
                  disabled={generatingPackingList}
                >
                  {generatingPackingList ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Generating...
                    </>
                  ) : 'Generate Now'}
                </button>
                <button
                  onClick={() => setShowGeneratePrompt(false)}
                  className="rounded-xl border px-5 py-2"
                  disabled={generatingPackingList}
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
