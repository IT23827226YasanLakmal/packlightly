"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Globe2, CalendarDays } from "lucide-react";

export type NewsItem = { id: string; title: string; publishedAt: string; status: "draft" | "published"; };
const seed: NewsItem[] = [
  { id: "n1", title: "Eco policy update: plastic bans expand", publishedAt: "2025-08-12", status: "published" },
  { id: "n2", title: "New carbon-neutral courier partnerships", publishedAt: "2025-08-20", status: "draft" },
];

export default function Page() {
  const [items, setItems] = React.useState<NewsItem[]>(seed);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NewsItem | null>(null);
  const [form, setForm] = React.useState<NewsItem>({ id: "", title: "", publishedAt: new Date().toISOString().slice(0, 10), status: "draft" });

  function save() {
    setItems((prev) => {
      const exists = editing ? prev.some(p => p.id === editing.id) : false;
      const obj = { ...(editing ?? { id: String(Date.now()) }), ...form } as NewsItem;
      return exists ? prev.map(p => p.id === obj.id ? obj : p) : [obj, ...prev];
    });
    setOpen(false); setEditing(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      
    >
      <div className=" bg-gradient-to-br from-emerald-900 via-black to-emerald-950 
      backdrop-blur-xl shadow-lg shadow-emerald-900/40 p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">News & Updates</h3>
            <p className="text-xs text-green-300">Create, schedule & publish sustainability news</p>
          </div>
          <button
            onClick={() => { setForm({ id: "", title: "", publishedAt: new Date().toISOString().slice(0, 10), status: "draft" }); setEditing(null); setOpen(true); }}
            className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-700 text-white px-3 py-2 font-semibold hover:from-green-600 hover:to-emerald-800 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>

        {/* News List */}
        <ul className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {items.map((n) => (
              <motion.li
                key={n.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-green-700/40 bg-black/30 p-3 flex items-center gap-3 hover:bg-green-800/20 transition"
              >
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-green-500 to-emerald-700 grid place-items-center text-white">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white leading-tight">{n.title}</p>
                  <p className="text-xs text-green-300 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> {n.publishedAt} • {n.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditing(n); setForm(n); setOpen(true); }}
                    className="rounded-lg border border-green-500/40 px-2 py-1 text-white hover:bg-green-700/20 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setItems((prev) => prev.filter(x => x.id !== n.id))}
                    className="rounded-lg border border-red-500/40 px-2 py-1 text-white hover:bg-red-700/20 transition"
                  >
                    Remove
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Drawer / Modal */}
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ y: 40 }} 
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/8 w-[92%] sm:w-[560px] 
                rounded-2xl bg-gradient-to-br from-black/80 via-emerald-900/70 to-emerald-950/80 
                border border-green-700/40 p-5 backdrop-blur-xl shadow-lg " 
              >
                <h4 className="text-lg font-semibold mb-2 text-white">{editing ? "Edit" : "Create"} News</h4>
                <div className="space-y-3 text-white">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Publish date</label>
                      <input
                        type="date"
                        value={form.publishedAt}
                        onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                        className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <textarea
                      rows={6}
                      placeholder="Write your update…"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-xl border border-green-500/40 bg-black/30 py-2 px-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setOpen(false)} className="rounded-xl border border-green-500/40 px-4 py-2 text-white hover:bg-green-700/20 transition">
                      Cancel
                    </button>
                    <button onClick={save} className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-700 px-4 py-2 font-semibold hover:from-green-600 hover:to-emerald-800 text-white transition">
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
