"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl 
        bg-gradient-to-br from-emerald-900 via-black to-emerald-950 
        border border-green-700/40 shadow-lg shadow-emerald-900/40 
        p-5 backdrop-blur-xl hover:shadow-emerald-600/40 hover:scale-[1.02] 
        transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          className="h-12 w-12 rounded-2xl grid place-items-center 
            bg-gradient-to-tr from-green-500 to-emerald-700 
            shadow-md shadow-green-600/40"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>

        {/* Stat Info */}
        <div className="ml-auto text-right">
          <p className="text-xs text-green-300">{label}</p>
          <p className="text-2xl font-bold leading-tight text-white drop-shadow-sm">
            {value}
          </p>
          {delta && (
            <p className="text-xs text-green-400 font-medium">
              {delta} this week
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
