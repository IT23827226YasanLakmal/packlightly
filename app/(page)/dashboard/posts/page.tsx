'use client'
import React from "react";
import { TripCard } from "@/components/dashboard/tripcard";

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
  return (
      <main className="flex-1 max-w-[960px]">
        <div className="p-4">
          <h2 className="text-[#0e1b13] text-[32px] font-bold">POSTS</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          {trips.map((trip, idx) => (
            <TripCard key={idx} {...trip} />
          ))}
        </div>
        <div className="flex gap-3 px-4 py-3">
          <button className="h-10 px-4 rounded-xl bg-[#19e56b] text-[#0e1b13] text-sm font-bold">
            View All Trips
          </button>
          <button className="h-10 px-4 rounded-xl bg-[#e7f3ec] text-[#0e1b13] text-sm font-bold">
            Create New Trip
          </button>
        </div>
      </main>
  );
}
