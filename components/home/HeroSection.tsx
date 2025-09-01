"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center text-center gap-6 py-20 overflow-hidden">
      {/* Floating leaves */}
      <svg className="absolute top-0 left-10 w-32 h-32 animate-bounce-slow opacity-30" viewBox="0 0 64 64" fill="none">
        <path d="M32 0C24 16 48 16 32 64" stroke="#34D399" strokeWidth="2"/>
      </svg>
      <svg className="absolute bottom-0 right-10 w-40 h-40 animate-spin-slow opacity-20" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#10B981" strokeWidth="3"/>
      </svg>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-emerald-900"
      >
        Travel Green, Travel Smart 🌿
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-emerald-800 max-w-2xl"
      >
        Explore sustainable destinations, eco-friendly tips, and connect with a global community of conscious travelers.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 mt-6"
      >
        <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white font-semibold rounded-full shadow hover:scale-105 transition">
          Explore Tips
        </button>
        <button className="px-6 py-3 border border-green-400 text-green-800 rounded-full shadow hover:bg-green-100 transition">
          Join Community
        </button>
      </motion.div>
    </section>
  );
}
