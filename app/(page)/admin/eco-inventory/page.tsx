'use client'
import { useState } from "react";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import Image from "next/image";
import { Product } from "@/types";
function ProductImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <div className="w-14 h-14 flex items-center justify-center bg-green-900/10 rounded-lg border border-green-700/30 text-green-700 text-xs">
      No Image
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      className="object-cover rounded-lg border border-green-700/30 bg-black/20"
      style={{ width: 56, height: 56 }}
      unoptimized
      onError={() => {
        setErrored(true);
      }}
    />
  );
}


// Default empty product for Add mode
const emptyProduct: Product = {
  _id: undefined,
  name: "",
  category: "",
  eco: 3,
  description: "",
  availableLocation: "",
  imageLink: "",
};

export default function AdminEcoInventoryPage() {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useProductStore();

  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<Product | null>(null);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // helper to merge changes safely (works even if editing is null)
  const updateEditing = (patch: Partial<Product>) => {
    setEditing((prev) => {
      const next = prev ? { ...prev, ...patch } : { ...emptyProduct, ...patch };
      // debug log — remove when confident
      // eslint-disable-next-line no-console
      console.log("updateEditing ->", patch, "next:", next);
      return next;
    });
  };

  const openAdd = () => {
    // create a fresh object copy
    setEditing({ ...emptyProduct });
    setDrawerOpen(true);
  };

  const openEdit = (item: Product) => {
    // clone item so we don't edit the store object directly
    setEditing({ ...item });
    setDrawerOpen(true);
  };

  const filteredItems = products.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toString().toLowerCase().includes(query.toLowerCase())
  );

  async function saveItem(item: Product) {
    try {
      if (item._id) {
        await updateProduct(item._id.toString(), item);
      } else {
        delete item._id; // ensure no _id for new items
        await createProduct(item);
      }
      // close and clear editing to avoid stale references
      setDrawerOpen(false);
      setEditing(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("saveItem error:", err);
    }
  }

  async function handleDelete(id: string) {
    await deleteProduct(id);
    setConfirmDelete(null);
  }

  return (
    <section className="px-6 lg:px-10 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Eco Inventory</h1>
            <p className="text-green-300 text-sm">
              Manage products, eco ratings & stock
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 font-semibold flex items-center gap-2 hover:from-emerald-700 hover:to-emerald-800 transition"
        >
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </motion.div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-green-500/30 bg-black/30 text-white py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Eco Items Table */}
      <div className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 overflow-x-auto">
        {loading ? (
          <p className="p-4 text-green-300">Loading...</p>
        ) : error ? (
          <p className="p-4 text-red-400">{error}</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="border-b border-green-600/40">
              <tr>
                <th className="py-3 px-4 text-green-300">Image</th>
                <th className="py-3 px-4 text-green-300">Name</th>
                <th className="py-3 px-4 text-green-300">Category</th>
                <th className="py-3 px-4 text-green-300">Eco Rating</th>
                <th className="py-3 px-4 text-green-300">Available Locations</th>
                <th className="py-3 px-4 text-green-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item._id?.toString() || Math.random()}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-green-500/20 hover:bg-emerald-900/20 transition"
                  >
                    <td className="py-3 px-4">
                      {item.imageLink ? (
                        <ProductImageWithFallback src={item.imageLink} alt={item.name} />
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center bg-green-900/10 rounded-lg border border-green-700/30 text-green-700 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-green-200">{item.category}</td>
                    <td className="py-3 px-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.eco
                              ? "fill-emerald-500 text-emerald-500"
                              : "text-green-500/30"
                            }`}
                        />
                      ))}
                    </td>
                    <td className="py-3 px-4 text-green-200">
                      {Array.isArray(item.availableLocation)
                        ? item.availableLocation.join(", ")
                        : item.availableLocation}
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg border border-green-500/30 px-2 py-1 hover:bg-emerald-900/30"
                      >
                        <Edit2 className="w-4 h-4 text-green-300" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(item)}
                        className="rounded-lg border border-red-500/30 px-2 py-1 hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer for Add/Edit Eco Item */}
      <AnimatePresence>
        {drawerOpen && editing && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* overlay (lower z so drawer is clickable) */}
            <div
              className="absolute inset-0 bg-black/30 z-40"
              onClick={() => {
                setDrawerOpen(false);
                setEditing(null);
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-black/90 border-l border-green-700/30 p-5 overflow-y-auto rounded-l-3xl z-50"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {editing._id ? "Edit" : "Add"} Product
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editing) saveItem(editing);
                }}
                className="space-y-3"
              >


                <div>
                  <label className="text-sm text-green-300">Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => updateEditing({ name: e.target.value })}
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    autoFocus
                  />
                </div>


                <div>
                  <label className="text-sm text-green-300">Image Link</label>
                  <input
                    type="text"
                    value={editing.imageLink}
                    onChange={e => updateEditing({ imageLink: e.target.value })}
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-green-300">Category</label>
                  <input
                    type="text"
                    value={editing.category}
                    onChange={(e) => updateEditing({ category: e.target.value })}
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-green-300">Eco Rating</label>
                  <select
                    value={editing.eco}
                    onChange={(e) => updateEditing({ eco: Number(e.target.value) })}
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-green-300">Description</label>
                  <input
                    type="text"
                    value={editing.description}
                    onChange={(e) => updateEditing({ description: e.target.value })}
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-green-300">Available Locations</label>
                  <input
                    type="text"
                    value={editing?.availableLocation || ""}
                    onChange={(e) =>
                      updateEditing({
                        availableLocation: e.target.value, // keep as string while typing
                      })
                    }
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>


                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setEditing(null);
                    }}
                    className="rounded-xl border px-4 py-2 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[420px] rounded-2xl bg-black/90 border border-green-700/30 p-5"
            >
              <h4 className="text-lg font-semibold text-white">Delete Product</h4>

              <p>{`Are you sure you want to delete "${confirmDelete.name}"?`}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="rounded-xl border px-4 py-2 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete._id?.toString() || "")}
                  className="rounded-xl bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
