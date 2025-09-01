"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EcoItem } from "@/components/admin/SustainabilityIndexChart";

export default function EcoFormDrawer({
  open,
  onClose,
  item,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  item?: EcoItem;
  onSave: (item: EcoItem) => void;
}) {
  const [form, setForm] = React.useState<EcoItem>(
    item ?? { id: "", name: "", category: "Bags", eco: 3, price: 0, stock: 0, status: "active" }
  );

  React.useEffect(() => {
    setForm(
      item ?? { id: "", name: "", category: "Bags", eco: 3, price: 0, stock: 0, status: "active" }
    );
  }, [item]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, id: form.id || String(Date.now()) });
    onClose();
  }

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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-gradient-to-br from-black/80 via-emerald-900/70 to-emerald-950/80
                       border-l border-green-700/40 p-5 overflow-y-auto rounded-l-3xl shadow-xl backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold mb-1 text-white">{form.id ? "Edit" : "Add"} Product</h3>
            <p className="text-xs text-green-300 mb-4">Update details and eco attributes.</p>

            <form onSubmit={submit} className="space-y-3 text-white">
              {/* Name */}
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 outline-none focus:ring-2 focus:ring-green-500 transition"
                  required
                />
              </div>

              {/* Category & Eco */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 outline-none focus:ring-2 focus:ring-green-500 transition"
                  >
                    {["Bags", "Bottles", "Toiletries", "Clothing", "Accessories"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Eco Rating</label>
                  <select
                    value={form.eco}
                    onChange={(e) => setForm({ ...form, eco: Number(e.target.value) })}
                    className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 outline-none focus:ring-2 focus:ring-green-500 transition"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 outline-none focus:ring-2 focus:ring-green-500 transition"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-green-500/40 px-4 py-2 text-white hover:bg-green-700/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-700 px-4 py-2 font-semibold text-white hover:from-green-600 hover:to-emerald-800 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
