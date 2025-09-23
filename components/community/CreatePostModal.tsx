"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bold, Italic, Underline, Image, Heading2, List, Quote, Eye, X } from "lucide-react";

export default function CreatePostModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applyFormat = (format: string) => setContent((prev) => prev + format);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full max-w-3xl bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-green-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 bg-green-100/50 backdrop-blur-sm border-b border-green-200">
              <h2 className="text-xl font-bold text-green-900 drop-shadow-sm"✍️ Create New Post</h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-full hover:bg-red-100 transition"
              >
                <X className="w-6 h-6 text-red-500" />
              </motion.button>
            </div>

            {/* Title */}
            <input
              type="text"
              placeholder="Post Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-5 py-3 text-lg font-semibold text-green-900 placeholder-green-400 border-b border-green-200 focus:ring-2 focus:ring-green-300 outline-none transition"
            />

            {/* Toolbar */}
            {!preview && (
              <motion.div
                className="flex flex-wrap gap-3 px-5 py-3 bg-green-50 border-b border-green-200 rounded-b-xl shadow-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {[Bold, Italic, Underline, Heading2, List, Quote, Image, Eye].map((Icon, i) => {
                  const actions = [
                    () => applyFormat("**bold**"),
                    () => applyFormat("*italic*"),
                    () => applyFormat("__underline__"),
                    () => applyFormat("\n## Subheading\n"),
                    () => applyFormat("\n- List item\n"),
                    () => applyFormat("\n> Quote\n"),
                    () => fileInputRef.current?.click(),
                    () => setPreview(!preview),
                  ];
                  return (
                    <motion.button
                      key={i}
                      onClick={actions[i]}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9, rotate: 0 }}
                      className="p-2 bg-green-100 rounded-lg shadow hover:bg-green-200 transition"
                    >
                      <Icon className="w-5 h-5 text-green-700" />
                    </motion.button>
                  );
                })}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.div>
            )}

            {/* Editor / Preview */}
            <div className="p-5 overflow-y-auto max-h-[400px]">
              {preview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="prose max-w-none text-green-900"
                >
                  <h2>{title}</h2>
                  {image && <img src={image} alt="uploaded" className="rounded-xl my-4 shadow-lg" />}
                  <p>{content}</p>
                </motion.div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[300px] resize-none p-4 text-green-900 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-300 outline-none shadow-inner transition placeholder-green-400"
                  placeholder="Write your post..."
                />
              )}
              {image && !preview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <img src={image} alt="preview" className="rounded-xl max-h-60 shadow-lg" />
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-5 border-t border-green-200 bg-green-50/50 backdrop-blur-sm">
              <span className="text-sm text-green-700">💡 Drafts are auto-saved</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:shadow-green-400 transition"
              >
                Publish
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
