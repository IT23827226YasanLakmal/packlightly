"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
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
                className="rounded-xl border border-green-500/40 px-4 py-2 text-white hover:bg-green-700/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 font-semibold text-white hover:from-red-700 hover:to-red-800 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
