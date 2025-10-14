"use client";
import React from "react";
import { motion } from "framer-motion";

interface TripsPerPageSelectorProps {
  tripsPerPage: number;
  onTripsPerPageChange: (count: number) => void;
  loading?: boolean;
}

export default function TripsPerPageSelector({ 
  tripsPerPage, 
  onTripsPerPageChange, 
  loading = false 
}: TripsPerPageSelectorProps) {
  const options = [5, 10, 20, 50];

  return (
    <div className="flex items-center justify-center space-x-3 py-4 px-4">
      <span className="text-sm text-gray-600 font-medium">Trips per page:</span>
      <div className="flex space-x-1">
        {options.map((count) => (
          <motion.button
            key={count}
            whileHover={{ scale: count === tripsPerPage ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTripsPerPageChange(count)}
            disabled={loading}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
              ${count === tripsPerPage
                ? 'bg-green-500 text-white shadow-md' 
                : loading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300'
              }
            `}
          >
            {count}
          </motion.button>
        ))}
      </div>
    </div>
  );
}