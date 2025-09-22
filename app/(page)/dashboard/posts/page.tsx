"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Heart, MessageCircle, X, Bold, Italic, Underline, Heading2, List, Quote, Image, Eye } from "lucide-react";
import { usePostStore} from "@/store/postStore"; // import your post store
import { useCurrentUser } from "@/lib/useCurrentUser";
import { Post, Comment } from "@/types";

export default function MyPostsPage() {
  const { posts, fetchPosts, createPost, updatePost, deletePost, addComment, loading, error } = usePostStore();
  const user = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Comments state
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [commentsData, setCommentsData] = useState<Record<string, Comment[]>>({});

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePost = async (_id: string) => {
    await deletePost(_id);
    setExpandedPosts(prev => prev.filter(pid => pid !== _id));
  };
//filter post
  const filteredPosts = posts
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
//pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openModal = (post?: Post) => {
    setModalPost(
      post ?? {
        _id: undefined,
        ownerId: user?.uid || "",
        title: "",
        description: "",
        tags: [],
        status: "Draft",
        date: new Date().toISOString(),
        comments: [],
        imageUrl: "",
      }
    );
    setModalOpen(true);
  };

  const savePost = async (post: Post) => {
    if (post._id) {
      await updatePost(post._id, post);
    } else {
      if (!user) {
        alert("You must be logged in to create a post.");
        return;
      }
      await createPost({ ...post, ownerId: user.uid });
    }
    setModalOpen(false);
  };

  const toggleComments = (_id: string) =>
    setExpandedPosts(prev => prev.includes(_id) ? prev.filter(pid => pid !== _id) : [...prev, _id]);

  

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8 items-center">
        <h1 className="text-3xl font-extrabold text-black">My Posts</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 rounded-2xl border border-green-500/30 bg-black/30 text-black outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select className="px-4 py-2 rounded-2xl border border-green-500/30 bg-black/30 text-black" value={sortBy} onChange={e => setSortBy(e.target.value as "newest" | "oldest")}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition">
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-green-300">Loading posts...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedPosts.map(post => (
                <motion.div key={post._id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} layout className="flex flex-col justify-between backdrop-blur-xl rounded-3xl border border-green-700/40 shadow-xl hover:shadow-emerald-800/50 transition">
                  {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="rounded-t-3xl h-40 w-full object-cover" />}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-black">{post.title}</h2>
                    <p className="text-sm text-black mt-1 line-clamp-3">{post.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map(tag => <span key={tag} className="text-xs bg-green-700/30 px-2 py-1 rounded">{tag}</span>)}
                    </div>
                    <div className="flex justify-between items-center mt-5">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(post)} className="p-2 rounded-full hover:bg-green-900/30 text-black transition"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeletePost(post._id!)} className="p-2 rounded-full hover:bg-red-900/30 text-red-400 transition"><Trash2 size={18} /></button>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1 text-emerald-400 font-medium"><Heart size={16} /> {post.comments.length}</div>
                        <div onClick={() => toggleComments(post._id!)} className="flex items-center gap-1 text-emerald-400 font-medium cursor-pointer">
                         <MessageCircle size={16} /> {post.comments.length}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Comments */}
                    <AnimatePresence>
                      {expandedPosts.includes(post._id!) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 border-t border-green-700/20 pt-3">
                          {(commentsData[post._id!] || []).map(comment => (
                            <div key={comment.id} className="flex flex-col gap-1 mb-3 bg-black/30 p-3 rounded-xl shadow-inner">
                              <span className="text-xs font-medium text-green-300">{comment.user} <span className="text-gray-500 text-[10px]">1d ago</span></span>
                              <p className="text-sm text-green-200">{comment.text}</p>
                            </div>
                          ))}
                          {/* add comment Input field */}
                          <div className="flex gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 rounded-xl border border-green-500/30 focus:ring-2 focus:ring-green-400 outline-none bg-black/20 text-white"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  usePostStore.getState().addComment(post._id!, (e.target as HTMLInputElement).value);
                                }
                              }}
                            />
                            <button
                              className="px-4 py-2 bg-emerald-600 text-black rounded-xl shadow hover:bg-emerald-700 transition"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                addComment(post._id!, input.value);
                                input.value = "";
                              }}
                            >
                              Send
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-900 disabled:opacity-50">{"<<"} First</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-900 disabled:opacity-50">{"<"} Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => goToPage(page)} className={`px-3 py-1 rounded-xl border shadow hover:bg-emerald-800 ${currentPage === page ? "bg-emerald-900 font-medium text-white" : "text-white"}`}>{page}</button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-900 disabled:opacity-50">Next {">"}</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-xl border shadow hover:bg-gray-900 disabled:opacity-50">Last {">>"}</button>
          </div>
        </>
      ) : (
        !loading && <div className="flex flex-col items-center justify-center py-20 text-center text-green-400">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-1">Create your first post to start sharing your eco-conscious journey.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <PostModal open={modalOpen} post={modalPost} onClose={() => setModalOpen(false)} onSave={savePost} />
    </div>
  );
}

// ========================
// Modal Component
// ========================
// Inside MyPostsPage.tsx (replace the old PostModal)
function PostModal({ open, post, onClose, onSave }: { open: boolean; post: Post | null; onClose: () => void; onSave: (post: Post, imageFile?: File) => void }) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.description || "");
  const [tags, setTags] = useState(post?.tags.join(", ") || "");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"Draft" | "Published">(post?.status || "Draft");

  const [image, setImage] = useState<string | null>(post?.imageUrl || null); // For preview
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // For upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTitle(post?.title || "");
    setContent(post?.description || "");
    setTags(post?.tags.join(", ") || "");
    setStatus(post?.status || "Draft");
    setImage(post?.imageUrl || null);
    setSelectedImageFile(null);
  }, [post]);

  const applyFormat = (format: string) => setContent(prev => prev + format);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!post) return;
    onSave(
      {
        ...post,
        title,
        description: content,
        tags: tags.split(",").map(t => t.trim()),
        status,
      },
      selectedImageFile || undefined
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {open && post && (
        <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="w-full max-w-3xl bg-black/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-green-700/30">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-green-700/30">
              <h2 className="text-xl font-bold text-white">{post._id ? "✍️ Edit Post" : "✍️ Create New Post"}</h2>
              <motion.button onClick={onClose} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="p-1 rounded-full hover:bg-red-900/30 transition">
                <X className="w-6 h-6 text-red-500" />
              </motion.button>
            </div>

            {/* Title */}
            <input type="text" placeholder="Post Title..." value={title} onChange={e => setTitle(e.target.value)} className="px-5 py-3 text-lg font-semibold text-white placeholder-green-300 border-b border-green-700/30 focus:ring-2 focus:ring-emerald-500 outline-none transition" />

            {/* Toolbar */}
            {!preview && (
              <motion.div className="flex flex-wrap gap-3 px-5 py-3 border-b border-green-700/30 rounded-b-xl shadow-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
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
                    <motion.button key={i} onClick={actions[i]} whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9, rotate: 0 }} className="p-2 bg-green-900/30 rounded-lg shadow hover:bg-green-700/50 transition">
                      <Icon className="w-5 h-5 text-white" />
                    </motion.button>
                  );
                })}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
              </motion.div>
            )}

            {/* Editor / Preview */}
            <div className="p-5 overflow-y-auto max-h-[400px]">
              {preview ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="prose max-w-none text-white">
                  <h2>{title}</h2>
                  {image && <img src={image} alt="uploaded" className="rounded-xl my-4 shadow-lg" />}
                  <p>{content}</p>
                </motion.div>
              ) : (
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-[300px] resize-none p-4 text-white rounded-xl border border-green-700/30 focus:ring-2 focus:ring-emerald-500 outline-none shadow-inner transition placeholder-green-300" placeholder="Write your post..." />
              )}
              {image && !preview && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4"><img src={image} alt="preview" className="rounded-xl max-h-60 shadow-lg" /></motion.div>}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-5 border-t border-green-700/30">
              <span className="text-sm text-green-400">💡 Drafts are auto-saved</span>
              <motion.button onClick={handleSubmit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:shadow-emerald-400 transition">
                {post._id ? "Save Changes" : "Publish"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
