"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Heart, MessageCircle, X, Bold, Italic, Underline, Heading2, List, Quote, Image, Eye } from "lucide-react";

interface Post {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "Draft" | "Published";
  createdAt: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchedPosts: Post[] = [
      {
        id: "p1",
        title: "Eco Travel Essentials",
        description: "Minimalist packing tips for eco-conscious travelers.",
        tags: ["Eco", "Travel"],
        status: "Draft",
        createdAt: "2025-08-12",
        imageUrl: null,
        likes: 12,
        comments: 4,
      },
      {
        id: "p2",
        title: "Top Reusable Items",
        description: "Items that reduce waste on your trips.",
        tags: ["Reusable"],
        status: "Published",
        createdAt: "2025-08-15",
        imageUrl: null,
        likes: 25,
        comments: 10,
      },
    ];
    setPosts(fetchedPosts);
  }, []);

  const handleDeletePost = (id: string) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const filteredPosts = posts
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openModal = (post?: Post) => {
    setModalPost(post ?? {
      id: "",
      title: "",
      description: "",
      tags: [],
      status: "Draft",
      createdAt: new Date().toISOString(),
      imageUrl: null,
      likes: 0,
      comments: 0,
    });
    setModalOpen(true);
  };

  const savePost = (post: Post) => {
    if (post.id) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    } else {
      setPosts((prev) => [{ ...post, id: `p${Date.now()}` }, ...prev]);
    }
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8 items-center">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">My Posts</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-400 bg-white/80 backdrop-blur-md"
          />
          <select className="px-4 py-2 rounded-xl border shadow-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium rounded-xl shadow hover:from-green-700 hover:to-emerald-600 transition">
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedPosts.map((post) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} layout className="flex flex-col justify-between bg-white/90 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out cursor-pointer">
                  {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="rounded-t-2xl h-40 w-full object-cover" />}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{post.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => <span key={tag} className="text-xs bg-green-700/30 px-2 py-1 rounded">{tag}</span>)}
                    </div>
                    <div className="flex justify-between items-center mt-5">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(post)} className="p-2 rounded-full hover:bg-green-50 text-green-600 hover:text-green-700 transition"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeletePost(post.id)} className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition"><Trash2 size={18} /></button>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1 text-emerald-700 font-medium"><Heart size={16} /> {post.likes}</div>
                        <div className="flex items-center gap-1 text-emerald-700 font-medium"><MessageCircle size={16} /> {post.comments}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50">{"<<"} First</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50">{"<"} Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => goToPage(page)} className={`px-3 py-1 rounded-xl border shadow hover:bg-emerald-50 ${currentPage === page ? "bg-emerald-100 font-medium" : ""}`}>{page}</button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50">Next {">"}</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-100 disabled:opacity-50">Last {">>"}</button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-1">Create your first post to start sharing your eco-conscious journey.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <PostModal
        open={modalOpen}
        post={modalPost}
        onClose={() => setModalOpen(false)}
        onSave={savePost}
      />
    </div>
  );
}

// ========================
// Modal Component
// ========================
function PostModal({ open, post, onClose, onSave }: { open: boolean; post: Post | null; onClose: () => void; onSave: (post: Post) => void }) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.description || "");
  const [tags, setTags] = useState(post?.tags.join(", ") || "");
  const [image, setImage] = useState<string | null>(post?.imageUrl || null);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"Draft" | "Published">(post?.status || "Draft");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTitle(post?.title || "");
    setContent(post?.description || "");
    setTags(post?.tags.join(", ") || "");
    setImage(post?.imageUrl || null);
    setStatus(post?.status || "Draft");
  }, [post]);

  const applyFormat = (format: string) => setContent((prev) => prev + format);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!post) return;
    onSave({ ...post, title, description: content, tags: tags.split(",").map(t => t.trim()), imageUrl: image, status });
  };

  return (
    <AnimatePresence>
      {open && post && (
        <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="w-full max-w-3xl bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-green-200">
            {/* Header */}
            <div className="flex justify-between items-center p-5 bg-green-100/50 backdrop-blur-sm border-b border-green-200">
              <h2 className="text-xl font-bold text-green-900 drop-shadow-sm">{post.id ? "✍️ Edit Post" : "✍️ Create New Post"}</h2>
              <motion.button onClick={onClose} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="p-1 rounded-full hover:bg-red-100 transition">
                <X className="w-6 h-6 text-red-500" />
              </motion.button>
            </div>

            {/* Title */}
            <input type="text" placeholder="Post Title..." value={title} onChange={e => setTitle(e.target.value)} className="px-5 py-3 text-lg font-semibold text-green-900 placeholder-green-400 border-b border-green-200 focus:ring-2 focus:ring-green-300 outline-none transition" />

            {/* Toolbar */}
            {!preview && (
              <motion.div className="flex flex-wrap gap-3 px-5 py-3 bg-green-50 border-b border-green-200 rounded-b-xl shadow-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
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
                    <motion.button key={i} onClick={actions[i]} whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9, rotate: 0 }} className="p-2 bg-green-100 rounded-lg shadow hover:bg-green-200 transition">
                      <Icon className="w-5 h-5 text-green-700" />
                    </motion.button>
                  );
                })}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </motion.div>
            )}

            {/* Editor / Preview */}
            <div className="p-5 overflow-y-auto max-h-[400px]">
              {preview ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="prose max-w-none text-green-900">
                  <h2>{title}</h2>
                  {image && <img src={image} alt="uploaded" className="rounded-xl my-4 shadow-lg" />}
                  <p>{content}</p>
                </motion.div>
              ) : (
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-[300px] resize-none p-4 text-green-900 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-300 outline-none shadow-inner transition placeholder-green-400" placeholder="Write your post..." />
              )}
              {image && !preview && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4"><img src={image} alt="preview" className="rounded-xl max-h-60 shadow-lg" /></motion.div>}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-5 border-t border-green-200 bg-green-50/50 backdrop-blur-sm">
              <span className="text-sm text-green-700">💡 Drafts are auto-saved</span>
              <motion.button onClick={handleSubmit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:shadow-green-400 transition">
                {post.id ? "Save Changes" : "Publish"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
