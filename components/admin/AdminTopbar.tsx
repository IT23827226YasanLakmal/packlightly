"use client";
import React from "react";
import { Bell, Search } from "lucide-react";

export default function AdminTopbar({ right }: { right?: React.ReactNode }) {
  return (
    <header
      className="sticky top-0 z-40 
      bg-gradient-to-r from-emerald-900 via-black to-emerald-950  
      backdrop-blur-xl border-b border-green-700/40 shadow-md shadow-emerald-900/20"
    >
      <div className="flex items-center justify-between px-6 lg:px-10 py-3">
        {/* Search */}
        <div className="relative w-full max-w-lg">
          <input
            placeholder="Search products, news, users…"
            className="w-full rounded-2xl border border-green-700/40 
              bg-black/30 text-white placeholder-white/50
              py-2.5 pl-11 pr-4 outline-none
              focus:ring-2 focus:ring-green-500/70 
              shadow-inner shadow-emerald-900/30"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-green-400" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button
            className="relative rounded-full p-2 
            hover:bg-green-500/20 transition-colors"
          >
            <Bell className="w-5 h-5 text-green-400" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 
              rounded-full bg-green-500 shadow-md shadow-green-500/50" />
          </button>

          {/* Custom right slot */}
          {right}

          {/* Profile Avatar */}
          <div
            className="h-9 w-9 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 
            shadow-md shadow-green-600/40 ring-2 ring-green-600/40"
          />
        </div>
      </div>
    </header>
  );
}
