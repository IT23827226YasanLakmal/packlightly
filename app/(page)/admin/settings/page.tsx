"use client";
import React from "react";
import { motion } from "framer-motion";
import { User, Key, Bell, CreditCard } from "lucide-react";

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [theme, setTheme] = React.useState("dark");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("admin@ecoapp.com");

  return (
    <section className="px-6 lg:px-10 py-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6 shadow-xl backdrop-blur-xl"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Admin Settings</h1>
        <p className="text-green-300 text-sm">Manage your account, preferences, and security settings.</p>
      </motion.div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Account Info</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-green-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm text-green-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-green-300">Enable Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-green-500/40 rounded-full peer peer-checked:bg-emerald-600 peer-focus:ring-2 peer-focus:ring-emerald-400 transition-all" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-green-300">Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-xl border border-green-500/30 bg-black/30 text-white py-1 px-2 outline-none"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </motion.div>

      {/* Billing / Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>
        
        <button className="w-full rounded-xl bg-red-900 py-2 font-semibold text-white hover:bg-red-800 transition">
          Delete Account
        </button>
      </motion.div>
    </section>
  );
}
