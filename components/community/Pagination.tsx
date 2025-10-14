"use client";
import React from "react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, loading = false }: PaginationProps) {
  // Don't show pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push('...');
      }
    }

    // Add the range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center space-x-2 py-6 px-4">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
          ${currentPage === 1 || loading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
            : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <motion.button
              key={pageNumber}
              whileHover={{ scale: isCurrentPage ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(pageNumber)}
              disabled={loading}
              className={`
                w-10 h-10 rounded-full font-medium transition-all duration-200
                ${isCurrentPage
                  ? 'bg-green-500 text-white shadow-lg' 
                  : loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                }
              `}
            >
              {pageNumber}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
          ${currentPage === totalPages || loading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
            : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Loading Indicator */}
      {loading && (
        <div className="ml-4 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      )}
    </div>
  );
}