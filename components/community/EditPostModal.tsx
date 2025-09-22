"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePostStore } from "@/store/postStore";

type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
};

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, postId }) => {
  const { posts, updatePost } = usePostStore();
  const post = posts.find((p) => p.id === postId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setTags(post.tags.join(", "));
    }
  }, [post]);

  const handleSave = () => {
    updatePost(postId, {
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
              <h2 className="text-xl font-semibold">✏️ Edit Post</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 p-2.5 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 p-2.5 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 p-2.5 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditPostModal;
