"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Star, Filter } from "lucide-react";
import EcoFormDrawer from "@/components/admin/EcoFormDrawer";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export type EcoItem = {
    id: string;
    name: string;
    category: string;
    eco: number; // 1-5
    price: number;
    stock: number;
    status: "active" | "archived";
};

const initialData: EcoItem[] = [
    { id: "1", name: "Bamboo Toothbrush", category: "Toiletries", eco: 5, price: 3.5, stock: 320, status: "active" },
    { id: "2", name: "Recycled Travel Bag", category: "Bags", eco: 4, price: 49.0, stock: 58, status: "active" },
    { id: "3", name: "Steel Water Bottle", category: "Bottles", eco: 5, price: 18.0, stock: 210, status: "active" },
    { id: "4", name: "Hemp T-Shirt", category: "Clothing", eco: 4, price: 24.0, stock: 90, status: "archived" },
    { id: "5", name: "Organic Cotton Tote", category: "Bags", eco: 5, price: 12.0, stock: 150, status: "active" },
    { id: "6", name: "Biodegradable Phone Case", category: "Accessories", eco: 4, price: 20.0, stock: 75, status: "active" },
    { id: "7", name: "Natural Deodorant", category: "Toiletries", eco: 5, price: 8.0, stock: 200, status: "active" },
    { id: "8", name: "Recycled Fabric Scarf", category: "Accessories", eco: 4, price: 15.0, stock: 60, status: "archived" },
    { id: "9", name: "Solar Charger", category: "Accessories", eco: 3, price: 35.0, stock: 40, status: "active" },
    { id: "10", name: "Compostable Phone Stand", category: "Accessories", eco: 4, price: 10.0, stock: 85, status: "active" },
    { id: "11", name: "Recycled Paper Notebook", category: "Accessories", eco: 5, price: 6.0, stock: 120, status: "active" },
    { id: "12", name: "Eco-Friendly Sunglasses", category: "Accessories", eco: 4, price: 30.0, stock: 45, status: "active" },
];

export default function Page() {
    const [data, setData] = React.useState<EcoItem[]>(initialData);
    const [query, setQuery] = React.useState("");
    const [category, setCategory] = React.useState<string>("All");
    const [ecoMin, setEcoMin] = React.useState<number>(0);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<EcoItem | null>(null);
    const [confirm, setConfirm] = React.useState<{ id: string; name: string } | null>(null);

    const filtered = data.filter(
        (i) =>
            (category === "All" || i.category === category) &&
            i.eco >= ecoMin &&
            i.name.toLowerCase().includes(query.toLowerCase())
    );

    function saveItem(item: EcoItem) {
        setData((prev) => {
            const exists = prev.some((p) => p.id === item.id);
            return exists
                ? prev.map((p) => (p.id === item.id ? item : p))
                : [{ ...item, id: String(Date.now()) }, ...prev];
        });
    }

    function remove(id: string) {
        setData((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <div className="bg-gradient-to-br from-emerald-900 via-black to-emerald-950 
      backdrop-blur-xl shadow-lg shadow-emerald-900/40 p-5">

            {/* Header / Controls */}
            <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">Eco Inventory</h2>
                    <p className="text-xs text-green-300">Manage products, eco ratings & stock</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search…"
                            className="rounded-xl border border-green-500/40 bg-black/30 text-white py-2 pl-9 pr-3 outline-none
              focus:ring-2 focus:ring-green-500 transition"
                        />
                        <Filter className="w-4 h-4 absolute left-2.5 top-2.5 text-green-400" />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-green-500/40 bg-black/30 text-white py-2 px-3 outline-none"
                    >
                        {["All", "Bags", "Bottles", "Toiletries", "Clothing", "Accessories"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={ecoMin}
                        onChange={(e) => setEcoMin(Number(e.target.value))}
                        className="rounded-xl border border-green-500/40 bg-black/30 text-white py-2 px-3 outline-none"
                    >
                        <option value={0}>Eco ≥ 0</option>
                        <option value={3}>Eco ≥ 3</option>
                        <option value={4}>Eco ≥ 4</option>
                        <option value={5}>Eco ≥ 5</option>
                    </select>
                    <button
                        onClick={() => { setEditing(null); setDrawerOpen(true); }}
                        className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-700 text-white px-3 py-2 font-semibold hover:from-green-600 hover:to-emerald-800 flex items-center gap-2 transition"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm text-white">
                    <thead>
                        <tr className="text-left border-b border-green-700/40 text-green-300">
                            <th className="py-2">Product</th>
                            <th>Category</th>
                            <th>Eco</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence initial={false}>
                            {filtered.map((row) => (
                                <motion.tr
                                    key={row.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="border-b last:border-0 border-green-800/30 hover:bg-green-800/20 transition"
                                >
                                    <td className="py-3 font-medium">{row.name}</td>
                                    <td>{row.category}</td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < row.eco ? "fill-green-500 text-green-500" : "text-green-800/50"}`}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td>${row.price.toFixed(2)}</td>
                                    <td>{row.stock}</td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${row.status === 'active'
                                                    ? 'bg-green-600/20 text-green-400'
                                                    : 'bg-black/30 text-green-300'
                                                }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setEditing(row); setDrawerOpen(true); }}
                                                className="rounded-lg border border-green-500/40 px-2 py-1 hover:bg-green-700/20 transition"
                                            >
                                                <Edit2 className="w-4 h-4 text-white" />
                                            </button>
                                            <button
                                                onClick={() => setConfirm({ id: row.id, name: row.name })}
                                                className="rounded-lg border border-red-500/40 px-2 py-1 hover:bg-red-700/20 transition"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Drawers / Dialogs */}
            <EcoFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} item={editing ?? undefined} onSave={saveItem} />
            <ConfirmDialog
                open={!!confirm}
                title="Delete item"
                description={`Are you sure you want to delete “${confirm?.name}”?`}
                onCancel={() => setConfirm(null)}
                onConfirm={() => { if (confirm) remove(confirm.id); setConfirm(null); }}
            />
        </div>
    );
}
