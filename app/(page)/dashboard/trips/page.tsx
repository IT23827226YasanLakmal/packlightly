'use client'
import React, { useState } from "react";
import { TripCard } from "@/components/dashboard/tripcard";
import { motion, AnimatePresence } from "framer-motion";

// Example trip data
const trips = [
  {
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qPunkDIv0bSdtVy1Y5hwDUIST9IQN0_GFJdcuFVgNEqwR5kGkRNmip8BnavsGt5qMf9l0ptRg3azSvRf6pizq3d9hOEdH-N7Z8qzrnroZEDl4j_vcvFP5nw-imuM3rVTbXmmUWS5Wp_H3-uQqrgy1htU8l5pWIIshbFShbO-YcfrtmRduL5QLXOCRSoupvlmpsXnFGcl9tVkqzqo9yMEen64ioqcDdMAt6RoB9VdfHBcHwK0idp8IMAvOY3eCHmhKgBBDlwsX7U2",
    title: "Weekend Getaway to the Coast",
    description: "Packing list for a relaxing weekend by the sea.",
  },
  {
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlEB1SUmoMu_HzC7SL_Oqxp65fIHx_r9HbCFY20MK-25cX6ZYhFrHem0G98C2-1HMyipB5C-SQv4bojLi3pomrfEAHrueFSplOJD-DBDcepji2DoDPMFHOcz3gvXuNzh5Y-nwNqWVqrXj_WF1i4xWKYdP3lQayxHUpNGJqYzlqToUZzO9zVFNf7auoOFmrPrigXQJXTcJVzVePg3aEFTjUKdeXa_AbEsbp7FG80eAmqiK9DsEwGnzWfb_D7Y7ltD8EoTNAxzS4iccM",
    title: "Business Trip to the City",
    description: "Essentials for a productive business trip.",
  },
  {
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANf-DFDb5MJ7qk2K7Kijq3x9nr5dOPjeYZ4W3pI4JydevA0gp4AvmmDIe58MI-XrOA45FgWXzkN2porZa1_i1vxzQQlwzGYGa2GJAX8DwPDILSGKhaJgsW2sjME18m6diot_Q-p6H_dL-Q7FVAAlvvaLOpmyehKB3IirSkcEENLpkDAdrYr9JR1wGwMaGOFcAxl355BIZlRt90W9ba84uTHz_5BIt8k_0Nc5BvaNV1Qe2SG_81sAjEpt_YX_qGt_exvry5p1Y92BRu",
    title: "Family Vacation in the Mountains",
    description: "Gear up for an adventurous family mountain retreat.",
  },
];

export default function TripsPage() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 4;

  // Pagination logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(trips.length / tripsPerPage);

  return (
    <main className="flex-1 max-w-[960px]">
      <div className="p-4">
        <h2 className="text-[#0e1b13] text-[32px] font-bold">Upcoming Trips</h2>
      </div>

      {/* Trip Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {currentTrips.map((trip, idx) => (
          <TripCard key={idx} {...trip} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 p-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 transition"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg transition ${currentPage === i + 1
              ? "bg-[#19e56b] text-black font-bold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      {/* Action Button */}
      <div className="flex gap-3 px-4 py-3">
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-4 rounded-xl bg-[#e7f3ec] text-[#0e1b13] text-sm font-bold hover:bg-gray-100 transition"
        >
          Create New Trip
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl w-[400px] max-w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.25 } }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Create New Trip
              </h3>
              <form className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Trip Title"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <textarea
                  placeholder="Trip Description"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <input
                  type="file"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#19e56b] text-white font-bold hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
