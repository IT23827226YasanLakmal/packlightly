"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CalendarDays, Globe2, Trash2, Edit2 } from "lucide-react";
import { useNewsStore } from "@/store/newsStore";
import { NewsArticle } from "@/types";

// Default empty article
const emptyNews: NewsArticle = {
  _id: undefined,
  title: "",
  description: "",
  pubDate: new Date().toISOString().slice(0, 10),
  source_id: "",
  link: "",
  image: "",
};

export default function NewsPage() {
  const { news, fetchNews, createNews, updateNews, deleteNews, loading } = useNewsStore();
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<NewsArticle | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<NewsArticle | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Validation function
  const validateForm = (item: NewsArticle): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!item.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (item.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!item.link?.trim()) {
      newErrors.link = "Link URL is required";
    } else {
      try {
        new URL(item.link);
      } catch {
        newErrors.link = "Please enter a valid URL";
      }
    }

    if (!item.source_id?.trim()) {
      newErrors.source_id = "Source ID is required";
    }

    if (item.description && item.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    if (item.image && item.image.trim()) {
      try {
        new URL(item.image);
      } catch {
        newErrors.image = "Please enter a valid image URL";
      }
    }

    return newErrors;
  };

  const updateEditing = (patch: Partial<NewsArticle>) => {
    setEditing((prev) => (prev ? { ...prev, ...patch } : { ...emptyNews, ...patch }));
    // Clear specific field error when user starts typing
    if (Object.keys(errors).length > 0) {
      const fieldKey = Object.keys(patch)[0];
      if (fieldKey && errors[fieldKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
      }
    }
  };

  const openAdd = () => {
    setEditing({ ...emptyNews });
    setErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditing({ ...article });
    setErrors({});
    setDrawerOpen(true);
  };

  async function saveItem(item: NewsArticle) {
    const formErrors = validateForm(item);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (item._id) {
        await updateNews(item._id.toString(), item);
      } else {
        delete item._id;
        await createNews(item);
      }
      setDrawerOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("saveItem error:", err);
      setErrors({ submit: "Failed to save news article. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteNews(id);
    setConfirmDelete(null);
  }

  const filteredNews = news.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.description?.toLowerCase().includes(query.toLowerCase()) ||
      n.source_id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="px-6 lg:px-10 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Globe2 className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">News & Updates</h1>
            <p className="text-green-300 text-sm">Manage news articles and updates</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 font-semibold flex items-center gap-2 hover:from-emerald-700 hover:to-emerald-800 transition"
        >
          <Plus className="w-5 h-5" /> Add News
        </button>
      </motion.div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-green-500/30 bg-black/30 text-white py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* News List */}
      <div className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 overflow-x-auto">
        {loading ? (
          <p className="p-4 text-green-300">Loading news...</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="border-b border-green-600/40">
              <tr>
                <th className="py-3 px-4 text-green-300">Image</th>
                <th className="py-3 px-4 text-green-300">Title</th>
                <th className="py-3 px-4 text-green-300">Date & Source</th>
                <th className="py-3 px-4 text-green-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filteredNews.map((n) => (
                  <motion.tr
                    key={n._id?.toString() || Math.random()}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-green-500/20 hover:bg-emerald-900/20 transition"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={n.image || "/placeholder.png"}
                        alt={n.title}
                        className="h-16 w-24 rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{n.title}</td>
                    <td className="py-3 px-4 text-green-200 flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" /> {new Date(n.pubDate).toLocaleDateString()}
                      </span>
                      <span>{n.source_id}</span>
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(n)}
                        className="rounded-lg border border-green-500/30 px-2 py-1 hover:bg-emerald-900/30"
                      >
                        <Edit2 className="w-4 h-4 text-green-300" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(n)}
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

      {/* Drawer for Add/Edit News */}
      <AnimatePresence>
        {drawerOpen && editing && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                {editing._id ? "Edit" : "Add"} News
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editing) saveItem(editing);
                }}
                className="space-y-3"
              >
                {errors.submit && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
                    {errors.submit}
                  </div>
                )}

                <div>
                  <label className="text-sm text-green-300">Title *</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => updateEditing({ title: e.target.value })}
                    className={`w-full rounded-xl border ${
                      errors.title ? 'border-red-500/50' : 'border-green-500/30'
                    } bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 ${
                      errors.title ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                    }`}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-green-300">Link URL *</label>
                  <input
                    type="url"
                    value={editing.link}
                    onChange={(e) => updateEditing({ link: e.target.value })}
                    className={`w-full rounded-xl border ${
                      errors.link ? 'border-red-500/50' : 'border-green-500/30'
                    } bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 ${
                      errors.link ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                    }`}
                    placeholder="https://example.com/article"
                  />
                  {errors.link && (
                    <p className="text-red-400 text-xs mt-1">{errors.link}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-green-300">Image URL</label>
                  <input
                    type="text"
                    value={editing.image}
                    onChange={(e) => updateEditing({ image: e.target.value })}
                    className={`w-full rounded-xl border ${
                      errors.image ? 'border-red-500/50' : 'border-green-500/30'
                    } bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 ${
                      errors.image ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && (
                    <p className="text-red-400 text-xs mt-1">{errors.image}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-green-300">
                    Content {editing.description?.length > 0 && (
                      <span className="text-xs text-gray-400">
                        ({editing.description.length}/1000)
                      </span>
                    )}
                  </label>
                  <textarea
                    rows={6}
                    value={editing.description}
                    onChange={(e) => updateEditing({ description: e.target.value })}
                    className={`w-full rounded-xl border ${
                      errors.description ? 'border-red-500/50' : 'border-green-500/30'
                    } bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 ${
                      errors.description ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                    }`}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-green-300">Publish Date</label>
                  <input
                    type="date"
                    value={editing.pubDate?.slice(0, 10)}
                    onChange={(e) => updateEditing({ pubDate: e.target.value })}
                    className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-green-300">Source ID *</label>
                  <input
                    type="text"
                    value={editing.source_id}
                    onChange={(e) => updateEditing({ source_id: e.target.value })}
                    className={`w-full rounded-xl border ${
                      errors.source_id ? 'border-red-500/50' : 'border-green-500/30'
                    } bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 ${
                      errors.source_id ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                    }`}
                    placeholder="e.g., tech-news, eco-updates"
                  />
                  {errors.source_id && (
                    <p className="text-red-400 text-xs mt-1">{errors.source_id}</p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setEditing(null);
                      setErrors({});
                    }}
                    className="rounded-xl border px-4 py-2 text-white hover:bg-white/10 transition"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
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
              <h4 className="text-lg font-semibold text-white">Delete News</h4>
              <p>{`Are you sure you want to delete "${confirmDelete.title}"?`}</p>
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
