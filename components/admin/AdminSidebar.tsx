"use client";
import React from "react";
import { motion } from "framer-motion";
import { Home, Package, Newspaper, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function AdminSidebar() {
  const nav = [
    { label: "Overview", icon: Home, href: "/admin" },
    { label: "Inventory", icon: Package, href: "/admin/eco-inventory" },
    { label: "News", icon: Newspaper, href: "/admin/news" },
    { label: "Users", icon: User, href: "/admin/users" },
    { label: "Reports", icon: User, href: "/admin/reports" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <aside className="hidden md:flex w-72 flex-col 
      bg-gradient-to-b from-emerald-900 via-black to-emerald-950 
      backdrop-blur-xl border-r border-emerald-700/40 shadow-lg shadow-emerald-800/30">
      
      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="h-12 w-12 rounded-2xl 
              bg-gradient-to-tr from-green-400 to-green-600 
              grid place-items-center shadow-lg shadow-green-500/40"
          >
            <span className="text-white font-extrabold text-lg drop-shadow">
              E
            </span>
          </motion.div>
          <div>
            <p className="font-bold text-lg tracking-tight text-white">
              Eco Admin
            </p>
            <p className="text-xs text-green-300 font-medium">
              Sustainable Ops
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-2">
        {nav.map((n, i) => (
          <motion.div
            key={n.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={n.href}
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                text-white hover:text-green-400
                bg-white/5 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-green-700/30
                hover:shadow-md hover:shadow-green-400/20 
                transition-all duration-200"
            >
              <n.icon className="w-5 h-5 text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-transform" />
              <span>{n.label}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-green-700/40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 rounded-xl 
            bg-gradient-to-r from-green-500 to-green-700 
            text-white py-3 font-semibold 
            shadow-md hover:shadow-green-500/40 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </motion.button>
      </div>
    </aside>
  );
}
