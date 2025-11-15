"use client";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";

interface TopProductsProps {
  products: Array<{ name: string; ecoScore: number; category: string }>;
  loading: boolean;
}

export default function TopEcoProducts({ products, loading }: TopProductsProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-black to-emerald-950   
      backdrop-blur-xl border border-green-700/40 shadow-lg shadow-emerald-900/40 p-6">

      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Top Eco Products</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-green-300 text-sm">Loading top products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-green-300 text-sm">No products available</div>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-green-700/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{product.name}</p>
                  <p className="text-green-300 text-xs">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold">{product.ecoScore}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}