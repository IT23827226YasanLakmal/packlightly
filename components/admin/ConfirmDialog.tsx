"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  loading = false,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[92%] sm:w-[420px] bg-gradient-to-br from-black/80 via-emerald-900/70 to-emerald-950/80
                       border border-green-700/40 rounded-2xl p-5 shadow-xl backdrop-blur-xl"
          >
            <h4 className="text-lg font-semibold text-white">{title}</h4>
            <p className="text-sm text-green-300 mt-1">{description}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onCancel}
                disabled={loading}
                className={`rounded-xl border border-green-500/40 px-4 py-2 transition ${
                  loading 
                    ? 'text-gray-400 bg-gray-700/20 cursor-not-allowed' 
                    : 'text-white hover:bg-green-700/20'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-xl px-4 py-2 font-semibold transition flex items-center gap-2 ${
                  loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                }`}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
