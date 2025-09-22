"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, X } from "lucide-react";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  rating: number;
  ecoRating: number;
  description?: string; // optional for modal details
}

export default function ProductCard({ imageUrl, title, rating, ecoRating, description }: ProductCardProps) {
  const [open, setOpen] = useState(false);

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="flex flex-col gap-3 pb-3 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer relative transition-all duration-300 hover:shadow-2xl"
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-xl">
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 hover:scale-105"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        </div>

        <div className="px-2 flex flex-col gap-1">
          <p className="text-[#0e1b13] text-base font-semibold truncate">{title}</p>
          <div className="flex items-center gap-1">
            {stars.map((filled, i) => (
              <span
                key={i}
                className={`text-yellow-400 text-sm ${filled ? "opacity-100" : "opacity-40"}`}
              >
                ★
              </span>
            ))}
            <span className="text-[#4e976b] text-sm ml-2 font-medium">Eco: {ecoRating}</span>
          </div>
        </div>

        {/* Eco Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#4e976b] to-[#76c893] rounded-full text-white text-xs font-semibold shadow-md">
          <Leaf className="w-3 h-3" />
          <span>{ecoRating}</span>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col gap-4">
                <div
                  className="w-full aspect-square bg-center bg-cover rounded-xl shadow-md"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                />

                <h2 className="text-2xl font-bold text-[#0e1b13]">{title}</h2>

                <div className="flex items-center gap-2">
                  {stars.map((filled, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 text-base ${filled ? "opacity-100" : "opacity-40"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-[#4e976b] font-medium ml-2">Eco: {ecoRating}</span>
                </div>

                {description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
                )}

                <button
                  className="mt-3 w-full rounded-2xl bg-gradient-to-r from-[#4e976b] to-[#76c893] py-3 text-white font-semibold shadow-lg hover:brightness-105 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
