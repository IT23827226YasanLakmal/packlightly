"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/Header";
import TrendingCard from "../../../components/community/TrendingCard";
import PostListItem from "../../../components/community/PostListItem";
import { usePostStore } from "@/store/postStore";

// Define a type for trending/reading posts
interface CommunityPostSection {
  section: string;
  body: string;
}
interface CommunityPost {
  title: string;
  description: string;
  imageUrl: string;
  content: CommunityPostSection[];
}

export default function Page() {
  const [readingPost, setReadingPost] = useState<CommunityPost | null>(null);
  const { posts, fetchPosts, loading, error } = usePostStore();

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Trending posts: top 2 by likeCount (fallback to 0 if undefined)
  const trendingPosts = [...posts]
    .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
    .slice(0, 2);

  return (
    <>
      <Header />
      <div className="px-6 md:px-12 flex flex-1 justify-center py-10 bg-gradient-to-b from-white to-green-50">
        <div className="flex w-full max-w-[1200px] gap-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-between gap-3 p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-3xl shadow-lg text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent)]" />
              <div className="flex flex-col gap-4 relative z-10">
                <p className="text-3xl md:text-[40px] font-extrabold leading-tight drop-shadow">
                  🌿 Eco Community Forum
                </p>
                <p className="text-base font-light leading-relaxed max-w-lg opacity-90">
                  Ask questions, share tips, and connect with fellow eco-conscious travelers.
                </p>
              </div>
            </motion.div>

            {/* Trending Posts */}
            <h3 className="text-black text-xl md:text-2xl font-bold px-4 pt-10 pb-4 border-b border-gray-200">
              🔥 Trending Posts
            </h3>

            {loading && <p className="text-green-500 px-4 py-2">Loading posts...</p>}
            {error && <p className="text-red-500 px-4 py-2">{error}</p>}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6 p-4"
            >
              {trendingPosts.length === 0 && !loading && (
                <p className="text-gray-500 col-span-2">No trending posts yet.</p>
              )}
              {trendingPosts.map((post, i) => (
                <div key={post._id || i} onClick={() => setReadingPost({
                  title: post.title,
                  description: post.description,
                  imageUrl: post.imageUrl || '',
                  content: [
                    { section: 'Description', body: post.description },
                    // You can add more sections if you want
                  ],
                })} className="cursor-pointer">
                  <TrendingCard
                    title={post.title}
                    description={post.description}
                    imageUrl={post.imageUrl}
                  />
                  <div className="text-xs text-green-700 font-semibold mt-2">👍 {post.likeCount ?? 0} likes</div>
                </div>
              ))}
            </motion.div>

            {/* Recent Posts */}
            <h3 className="text-black text-xl md:text-2xl font-bold px-4 pt-10 pb-4 border-b border-gray-200">
              🆕 Recent Posts
            </h3>

            {loading && <p className="text-green-500 px-4 py-2">Loading posts...</p>}
            {error && <p className="text-red-500 px-4 py-2">{error}</p>}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="divide-y divide-gray-100"
            >
              {posts.map((post, i) => (
                <div
                  key={post._id || i}
                  className="flex gap-4 px-4 py-4 hover:bg-green-100/60 rounded-xl transition cursor-pointer"
                >
                  <PostListItem
                    title={post.title}
                    time={new Date(post.date).toLocaleDateString()}
                    author={post.ownerId || "Unknown"}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex w-[320px] flex-col gap-8">
            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-green-100"
            >
              <h4 className="text-lg font-bold text-black mb-4">🏆 Top Contributors</h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>@EcoGuru</span>
                  <span className="text-green-600 font-semibold">152 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>@GreenAdventurer</span>
                  <span className="text-green-600 font-semibold">120 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>@EarthLover88</span>
                  <span className="text-green-600 font-semibold">98 pts</span>
                </li>
              </ul>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-green-100"
            >
              <h4 className="text-lg font-bold text-black mb-4">#️⃣ Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {["eco-travel", "packing", "carbon-neutral", "hiking", "destinations"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-200 to-green-300 text-green-900 hover:scale-105 hover:shadow transition"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Reading Mode Modal */}
      <AnimatePresence>
        {readingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
            onClick={() => setReadingPost(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto p-8"
            >
              <h2 className="text-2xl font-bold mb-4">{readingPost.title}</h2>
              <p className="text-gray-600 mb-6">{readingPost.description}</p>
              <img src={readingPost.imageUrl} alt="" className="rounded-xl mb-6" /> {/* TODO: Replace with <Image> for Next.js best practices */}
              <div className="space-y-4">
                {readingPost.content.map((section, i) => (
                  <details
                    key={i}
                    className="bg-green-50 rounded-xl p-4 cursor-pointer group"
                  >
                    <summary className="font-semibold text-green-700 group-open:text-green-900">
                      {section.section}
                    </summary>
                    <p className="text-gray-700 mt-2">{section.body}</p>
                  </details>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
