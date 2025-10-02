"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/Header";
import InstagramPost from "../../../components/community/InstagramPost";
import StoriesBar from "../../../components/community/StoriesBar";
import CreatePostFAB from "../../../components/community/CreatePostFAB";
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
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { posts, fetchPosts, loading, error } = usePostStore();

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Ensure posts is always an array and filter out invalid posts
  const validPosts = (posts || []).filter(post => 
    post && 
    typeof post === 'object' && 
    post.title && 
    post.description
  );

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
    // Implement like functionality
  };

  const handleComment = (postId: string, comment: string) => {
    console.log('Comment on post:', postId, comment);
    // Implement comment functionality
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    // Implement share functionality
  };

  const handleSave = (postId: string) => {
    console.log('Save post:', postId);
    // Implement save functionality
  };

  return (
    <>
      <Header />
      
      {/* Instagram-style Layout */}
      <div className="min-h-screen bg-gray-50">
        {/* Stories Section */}
        <StoriesBar />
        
        {/* Main Feed */}
        <div className="max-w-md mx-auto bg-gray-50 pb-20">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {/* Posts Feed */}
          {!loading && !error && validPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share something with the community!</p>
              <button 
                onClick={() => setShowCreatePost(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                Create your first post
              </button>
            </div>
          )}
          
          {/* Posts */}
          <div className="space-y-0">
            {validPosts.map((post) => (
              <InstagramPost
                key={post._id || `post-${Math.random()}`}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
        
        {/* Floating Action Button */}
        <CreatePostFAB onCreatePost={() => setShowCreatePost(true)} />
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button 
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold">Create Post</h2>
                <button className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
                  Share
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src="https://ui-avatars.com/api/?name=You&background=22c55e&color=fff&size=40"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">You</span>
                </div>
                
                {/* Caption Input */}
                <textarea
                  placeholder="What's on your mind about eco-friendly travel?"
                  className="w-full h-32 resize-none border-none outline-none text-lg placeholder-gray-500"
                />
                
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-500">Add photos or videos</p>
                </div>
                
                {/* Tags Input */}
                <input
                  type="text"
                  placeholder="Add tags (e.g., #ecotravel #sustainability)"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-green-400 transition-colors"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <img src={readingPost.imageUrl} alt="" className="rounded-xl mb-6 w-full" />
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
