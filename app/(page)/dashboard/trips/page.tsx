"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Leaf, MapPin, Plus } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { usePackingListStore } from "@/store/packingListStore";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import { Trip } from '@/types/index';

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to convert ISO date to input date format (YYYY-MM-DD)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Helper function to calculate duration in days between two dates
const calculateDurationDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function AllTripsTable() {
  const router = useRouter();
  const { trips, loading, error, fetchTrips, setSelectedTripId, updateTrip } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [savingTrip, setSavingTrip] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showGeneratePrompt, setShowGeneratePrompt] = useState(false);
  const [generatingPackingList, setGeneratingPackingList] = useState(false);
  // Delete confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const { packingLists, fetchPackingLists, generatePackingListForTrip } = usePackingListStore();

  // Helper function to handle trip type logic
  const getPassengerConfigForTripType = (tripType: Trip["type"]) => {
    switch (tripType) {
      case "Solo":
        return { adults: 1, children: 0, total: 1, childrenDisabled: true };
      case "Couple":
        return { adults: 2, children: 0, total: 2, childrenDisabled: true };
      case "Family":
        return { adults: 2, children: 1, total: 3, childrenDisabled: false };
      case "Group":
        return { adults: 4, children: 0, total: 4, childrenDisabled: false };
      default:
        return { adults: 1, children: 0, total: 1, childrenDisabled: true };
    }
  };

  // Helper function to calculate total passengers
  const calculateTotal = (adults: number, children: number) => {
    return adults + children;
  };

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    newTrip: { [key: string]: string };
    editTrip: { [key: string]: string };
  }>({
    newTrip: {},
    editTrip: {}
  });

  // Validation helper functions
  const validateTrip = (trip: Trip) => {
    const errors: { [key: string]: string } = {};

    if (!trip.title.trim()) {
      errors.title = "Title is required";
    }

    if (!trip.destination.trim()) {
      errors.destination = "Destination is required";
    }

    if (!trip.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!trip.endDate) {
      errors.endDate = "End date is required";
    }

    if (trip.startDate && trip.endDate && new Date(trip.startDate) > new Date(trip.endDate)) {
      errors.endDate = "End date must be after start date";
    }

    if (trip.durationDays <= 0) {
      errors.durationDays = "Duration must be greater than 0";
    }

    if (trip.passengers.total <= 0) {
      errors.passengers = "Total passengers must be greater than 0";
    }

    if (trip.budget < 0) {
      errors.budget = "Budget cannot be negative";
    }

    return errors;
  };

  const clearValidationErrors = (formType: 'newTrip' | 'editTrip', field?: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [formType]: field ? { ...prev[formType], [field]: '' } : {}
    }));
  };



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

  // Calculate duration when selectedTrip changes
  useEffect(() => {
    if (selectedTrip && selectedTrip.startDate && selectedTrip.endDate) {
      const duration = calculateDurationDays(selectedTrip.startDate, selectedTrip.endDate);
      if (selectedTrip.durationDays !== duration) {
        setSelectedTrip(prev => prev ? { ...prev, durationDays: duration } : null);
      }
    }
  }, [selectedTrip]);


  // DELETE TRIP
  const handleDeleteTrip = async (tripId: string) => {
    // Show confirmation dialog instead of browser confirm
    setTripToDelete(tripId);
    setShowDeleteConfirm(true);
  };

  // Handle the actual deletion after confirmation
  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;
    
    await useTripStore.getState().deleteTrip(tripToDelete);

    if (selectedTrip?._id === tripToDelete) setSelectedTrip(null);
    
    // Reset state
    setShowDeleteConfirm(false);
    setTripToDelete(null);
  };

  // Handle cancelling the deletion
  const cancelDeleteTrip = () => {
    setShowDeleteConfirm(false);
    setTripToDelete(null);
  };

  // CREATE TRIP
  const handleCreateTrip = async () => {
    // Validate the form
    const errors = validateTrip(newTrip);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(prev => ({ ...prev, newTrip: errors }));
      return;
    }

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
    clearValidationErrors('newTrip');
    setOpenCreateModal(false);
    setShowGeneratePrompt(true);
  };

  const handleGeneratePackingList = async () => {
    if (!selectedTrip || !selectedTrip._id || generatingPackingList) return;
    setGeneratingPackingList(true);
    try {
      await generatePackingListForTrip(selectedTrip._id.toString());
      // Refresh the packing lists to ensure the new list is visible
      await fetchPackingLists();
      setGeneratingPackingList(false);
      setShowGeneratePrompt(false);
      // Navigate to packing lists page to show the newly generated list
      router.push(`/dashboard/packinglists?tripId=${selectedTrip._id}`);
    } catch (error) {
      console.error('Failed to generate packing list:', error);
      setGeneratingPackingList(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/60">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
              Loading Trips
            </h3>
            <p className="text-sm text-green-600 mt-1 animate-pulse">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    const err = error as unknown;
    let msg = 'An error occurred';
    if (typeof err === 'string') msg = err;
    else if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string') msg = (err as { message: string }).message;
    return <p className="text-red-500">{msg}</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-white/60">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
          All Trips</h1>
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
                    {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
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
                  <label className="text-sm font-medium text-black/70">Title *</label>
                  <input
                    type="text"
                    value={selectedTrip.title}
                    onChange={e => {
                      setSelectedTrip({ ...selectedTrip, title: e.target.value });
                      clearValidationErrors('editTrip', 'title');
                    }}
                    className={`w-full rounded-xl border py-2 px-3 ${
                      validationErrors.editTrip.title 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-green-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter trip title"
                  />
                  {validationErrors.editTrip.title && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.editTrip.title}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Type</label>
                  <select
                    value={selectedTrip.type}
                    onChange={e => {
                      const tripType = e.target.value as Trip["type"];
                      const passengerConfig = getPassengerConfigForTripType(tripType);
                      setSelectedTrip({ 
                        ...selectedTrip, 
                        type: tripType,
                        passengers: {
                          adults: passengerConfig.adults,
                          children: passengerConfig.children,
                          total: passengerConfig.total
                        }
                      });
                    }}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Destination *</label>
                  <input
                    type="text"
                    value={selectedTrip.destination}
                    onChange={e => {
                      setSelectedTrip({ ...selectedTrip, destination: e.target.value });
                      clearValidationErrors('editTrip', 'destination');
                    }}
                    className={`w-full rounded-xl border py-2 px-3 ${
                      validationErrors.editTrip.destination 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-green-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter destination"
                  />
                  {validationErrors.editTrip.destination && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.editTrip.destination}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Start Date *</label>
                    <input
                      type="date"
                      value={formatDateForInput(selectedTrip.startDate)}
                      onChange={e => {
                        const newStartDate = e.target.value;
                        const duration = calculateDurationDays(newStartDate, selectedTrip.endDate);
                        setSelectedTrip({ 
                          ...selectedTrip, 
                          startDate: newStartDate,
                          durationDays: duration
                        });
                        clearValidationErrors('editTrip', 'startDate');
                      }}
                      className={`w-full rounded-xl border py-2 px-3 ${
                        validationErrors.editTrip.startDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-green-200 focus:ring-green-500'
                      }`}
                    />
                    {validationErrors.editTrip.startDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.editTrip.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">End Date *</label>
                    <input
                      type="date"
                      value={formatDateForInput(selectedTrip.endDate)}
                      onChange={e => {
                        const newEndDate = e.target.value;
                        const duration = calculateDurationDays(selectedTrip.startDate, newEndDate);
                        setSelectedTrip({ 
                          ...selectedTrip, 
                          endDate: newEndDate,
                          durationDays: duration
                        });
                        clearValidationErrors('editTrip', 'endDate');
                      }}
                      className={`w-full rounded-xl border py-2 px-3 ${
                        validationErrors.editTrip.endDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-green-200 focus:ring-green-500'
                      }`}
                    />
                    {validationErrors.editTrip.endDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.editTrip.endDate}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Duration (days) *</label>
                  <input
                    type="number"
                    min={1}
                    value={selectedTrip.durationDays}
                    readOnly
                    className="w-full rounded-xl border border-green-200 py-2 px-3 bg-gray-50 cursor-not-allowed"
                    placeholder="Auto-calculated from dates"
                  />
                  {validationErrors.editTrip.durationDays && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.editTrip.durationDays}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Adults</label>
                    <input
                      type="number"
                      min={0}
                      value={selectedTrip.passengers.adults}
                      onChange={e => {
                        const adults = Number(e.target.value);
                        const total = calculateTotal(adults, selectedTrip.passengers.children);
                        setSelectedTrip({ 
                          ...selectedTrip, 
                          passengers: { 
                            ...selectedTrip.passengers, 
                            adults, 
                            total 
                          } 
                        });
                      }}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Children</label>
                    <input
                      type="number"
                      min={0}
                      value={selectedTrip.passengers.children}
                      onChange={e => {
                        const children = Number(e.target.value);
                        const total = calculateTotal(selectedTrip.passengers.adults, children);
                        setSelectedTrip({ 
                          ...selectedTrip, 
                          passengers: { 
                            ...selectedTrip.passengers, 
                            children, 
                            total 
                          } 
                        });
                      }}
                      disabled={selectedTrip.type === "Solo" || selectedTrip.type === "Couple"}
                      className="w-full rounded-xl border border-green-200 py-2 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Total</label>
                    <input
                      type="number"
                      min={1}
                      value={selectedTrip.passengers.total}
                      readOnly
                      className="w-full rounded-xl border border-green-200 py-2 px-3 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Budget</label>
                  <input
                    type="number"
                    min={0}
                    value={selectedTrip.budget}
                    onChange={e => {
                      setSelectedTrip({ ...selectedTrip, budget: Number(e.target.value) });
                      clearValidationErrors('editTrip', 'budget');
                    }}
                    className={`w-full rounded-xl border py-2 px-3 ${
                      validationErrors.editTrip.budget 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-green-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter budget amount"
                  />
                  {validationErrors.editTrip.budget && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.editTrip.budget}</p>
                  )}
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
                          className={`mt-3 w-full rounded-xl bg-green-500 text-white py-2 font-semibold transition flex items-center justify-center ${generatingPackingList ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
                          disabled={generatingPackingList}
                        >
                          {generatingPackingList ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              Generating...
                            </>
                          ) : '➕ Generate Smart Packing List'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => {
                      setOpenDrawer(false);
                      clearValidationErrors('editTrip');
                    }}
                    className="rounded-xl border px-4 py-2"
                    disabled={savingTrip}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedTrip || !selectedTrip._id) return;
                      
                      // Validate the form
                      const errors = validateTrip(selectedTrip);
                      if (Object.keys(errors).length > 0) {
                        setValidationErrors(prev => ({ ...prev, editTrip: errors }));
                        return;
                      }

                      setSavingTrip(true);
                      await updateTrip(selectedTrip._id.toString(), selectedTrip);
                      setSavingTrip(false);
                      clearValidationErrors('editTrip');
                      setOpenDrawer(false);
                    }}
                    className={`rounded-xl bg-green-500 text-white px-4 py-2 font-semibold transition flex items-center justify-center ${savingTrip ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
                    disabled={savingTrip}
                  >
                    {savingTrip ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Saving...
                      </>
                    ) : 'Save'}
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
                  <label className="text-sm font-medium text-black/70">Title *</label>
                  <input
                    type="text"
                    value={newTrip.title}
                    onChange={(e) => {
                      setNewTrip({ ...newTrip, title: e.target.value });
                      clearValidationErrors('newTrip', 'title');
                    }}
                    className={`w-full rounded-xl border py-2 px-3 ${
                      validationErrors.newTrip.title 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-green-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter trip title"
                  />
                  {validationErrors.newTrip.title && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.newTrip.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-black/70">Type</label>
                  <select
                    value={newTrip.type}
                    onChange={(e) => {
                      const tripType = e.target.value as Trip["type"];
                      const passengerConfig = getPassengerConfigForTripType(tripType);
                      setNewTrip({ 
                        ...newTrip, 
                        type: tripType,
                        passengers: {
                          adults: passengerConfig.adults,
                          children: passengerConfig.children,
                          total: passengerConfig.total
                        }
                      });
                    }}
                    className="w-full rounded-xl border border-green-200 py-2 px-3"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Destination *</label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => {
                      setNewTrip({ ...newTrip, destination: e.target.value });
                      clearValidationErrors('newTrip', 'destination');
                    }}
                    className={`w-full rounded-xl border py-2 px-3 ${
                      validationErrors.newTrip.destination 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-green-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter destination"
                  />
                  {validationErrors.newTrip.destination && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.newTrip.destination}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Start Date *</label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        const duration = calculateDurationDays(newStartDate, newTrip.endDate);
                        setNewTrip({ 
                          ...newTrip, 
                          startDate: newStartDate,
                          durationDays: duration
                        });
                        clearValidationErrors('newTrip', 'startDate');
                      }}
                      className={`w-full rounded-xl border py-2 px-3 ${
                        validationErrors.newTrip.startDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-green-200 focus:ring-green-500'
                      }`}
                    />
                    {validationErrors.newTrip.startDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.newTrip.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">End Date *</label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) => {
                        const newEndDate = e.target.value;
                        const duration = calculateDurationDays(newTrip.startDate, newEndDate);
                        setNewTrip({ 
                          ...newTrip, 
                          endDate: newEndDate,
                          durationDays: duration
                        });
                        clearValidationErrors('newTrip', 'endDate');
                      }}
                      className={`w-full rounded-xl border py-2 px-3 ${
                        validationErrors.newTrip.endDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-green-200 focus:ring-green-500'
                      }`}
                    />
                    {validationErrors.newTrip.endDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.newTrip.endDate}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Duration (days) *</label>
                  <input
                    type="number"
                    min={1}
                    value={newTrip.durationDays}
                    readOnly
                    className="w-full rounded-xl border border-green-200 py-2 px-3 bg-gray-50 cursor-not-allowed"
                    placeholder="Auto-calculated from dates"
                  />
                  {validationErrors.newTrip.durationDays && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.newTrip.durationDays}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-black/70">Adults</label>
                    <input
                      type="number"
                      min={0}
                      value={newTrip.passengers.adults}
                      onChange={(e) => {
                        const adults = Number(e.target.value);
                        const total = calculateTotal(adults, newTrip.passengers.children);
                        setNewTrip({ 
                          ...newTrip, 
                          passengers: { 
                            ...newTrip.passengers, 
                            adults, 
                            total 
                          } 
                        });
                      }}
                      className="w-full rounded-xl border border-green-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Children</label>
                    <input
                      type="number"
                      min={0}
                      value={newTrip.passengers.children}
                      onChange={(e) => {
                        const children = Number(e.target.value);
                        const total = calculateTotal(newTrip.passengers.adults, children);
                        setNewTrip({ 
                          ...newTrip, 
                          passengers: { 
                            ...newTrip.passengers, 
                            children, 
                            total 
                          } 
                        });
                      }}
                      disabled={newTrip.type === "Solo" || newTrip.type === "Couple"}
                      className="w-full rounded-xl border border-green-200 py-2 px-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black/70">Total</label>
                    <input
                      type="number"
                      min={1}
                      value={newTrip.passengers.total}
                      readOnly
                      className="w-full rounded-xl border border-green-200 py-2 px-3 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black/70">Budget</label>
                  <input
                    type="number"
                    min={0}
                    value={newTrip.budget}
                    onChange={(e) => {
                      setNewTrip({ ...newTrip, budget: Number(e.target.value) });
                      clearValidationErrors('newTrip', 'budget');
                    }}
                    className={`w-full rounded-xl border py-2 px-3 ${
                      validationErrors.newTrip.budget 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-green-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter budget amount"
                  />
                  {validationErrors.newTrip.budget && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.newTrip.budget}</p>
                  )}
                </div>
                {/* Weather fields removed as requested */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => {
                      setOpenCreateModal(false);
                      clearValidationErrors('newTrip');
                    }}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Trip"
        description="Are you sure you want to delete this trip? This action cannot be undone and will remove all associated packing lists."
        onCancel={cancelDeleteTrip}
        onConfirm={confirmDeleteTrip}
      />
    </div>
  );
}
