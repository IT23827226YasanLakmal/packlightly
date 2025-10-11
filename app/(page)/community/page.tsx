"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Header from "../../../components/Header";
import InstagramPost from "../../../components/community/InstagramPost";
import StoriesBar from "../../../components/community/StoriesBar";
import CreatePostFAB from "../../../components/community/CreatePostFAB";
import { usePostStore } from "@/store/postStore";
import { useCurrentUser } from "@/lib/useCurrentUser";

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
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    tags: '',
    imageUrl: ''
  });
  
  const { posts, fetchPosts, loading, error, addComment, createPost, toggleLike } = usePostStore();
  const { user: currentUser } = useCurrentUser();

  React.useEffect(() => {
    console.log('Community page: Fetching posts...');
    fetchPosts();
  }, [fetchPosts]);

  // Ensure posts is always an array and filter out invalid posts
  const validPosts = (posts || []).filter(post => 
    post && 
    typeof post === 'object' && 
    post.title && 
    post.description
  );

  // Log posts when they change
  React.useEffect(() => {
    console.log('Community page: Posts updated:', posts);
    console.log('Community page: Valid posts count:', validPosts.length);
    if (currentUser) {
      console.log('Community page: Current user:', currentUser.uid);
    }
  }, [posts, validPosts, currentUser]);

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      alert('Please login to like posts');
      return;
    }
    
    if (!postId) {
      console.error('No post ID provided for like operation');
      alert('Error: Invalid post. Please refresh the page.');
      return;
    }

    console.log('Handling like for post:', postId, 'by user:', currentUser.uid);
    
    try {
      await toggleLike(postId, currentUser.uid);
    } catch (error) {
      console.error('Failed to like post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!currentUser) {
      alert('Please login to comment');
      return;
    }
    
    try {
      await addComment(postId, comment, currentUser.displayName || currentUser.email || 'Anonymous');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleShare = async (postId: string) => {
    const post = validPosts.find(p => p._id === postId);
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: `${window.location.origin}/community/post/${postId}`
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/community/post/${postId}`);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleSave = (postId: string) => {
    // Save to localStorage for now
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    if (!savedPosts.includes(postId)) {
      savedPosts.push(postId);
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
      alert('Post saved!');
    } else {
      alert('Post already saved!');
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser) {
      alert('Please login to create a post');
      return;
    }

    if (!newPost.title.trim() || !newPost.description.trim()) {
      alert('Please fill in the title and description');
      return;
    }

    try {
      const tagsArray = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await createPost({
        title: newPost.title,
        description: newPost.description,
        tags: tagsArray,
        imageUrl: newPost.imageUrl,
        status: 'Published',
        date: new Date().toISOString(),
        comments: [],
        likeCount: 0,
        likedBy: [] // Initialize empty likedBy array
      });

      // Reset form
      setNewPost({
        title: '',
        description: '',
        tags: '',
        imageUrl: ''
      });
      setShowCreatePost(false);
      
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
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
          {/* User Status Check */}
          {!currentUser && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Please login to like, comment, and create posts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">Loading posts...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-8 mx-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={() => fetchPosts()}
                  className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
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
                currentUser={currentUser}
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
                <button 
                  onClick={handleCreatePost}
                  disabled={loading || !newPost.title.trim() || !newPost.description.trim()}
                  className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sharing...' : 'Share'}
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <Image
                    src={currentUser?.photoURL || "https://ui-avatars.com/api/?name=You&background=22c55e&color=fff&size=40"}
                    alt="Your avatar"
                    width={40}
                    height={40}
                    unoptimized
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">{currentUser?.displayName || currentUser?.email || 'You'}</span>
                </div>
                
                {/* Title Input */}
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-green-400 transition-colors text-lg font-semibold"
                />
                
                {/* Caption Input */}
                <textarea
                  placeholder="What's on your mind about eco-friendly travel?"
                  value={newPost.description}
                  onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-32 resize-none border border-gray-200 rounded-lg p-3 outline-none focus:border-green-400 transition-colors"
                />
                
                {/* Image URL Input */}
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-green-400 transition-colors"
                />
                
                {/* Image Preview */}
                {newPost.imageUrl && (
                  <div className="border rounded-lg overflow-hidden">
                    <Image
                      src={newPost.imageUrl}
                      alt="Preview"
                      width={500}
                      height={192}
                      unoptimized
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Tags Input */}
                <input
                  type="text"
                  placeholder="Add tags separated by commas (e.g., ecotravel, sustainability, green)"
                  value={newPost.tags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-green-400 transition-colors"
                />
                
                {/* Tag Preview */}
                {newPost.tags && (
                  <div className="flex flex-wrap gap-2">
                    {newPost.tags.split(',').map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          #{trimmedTag}
                        </span>
                      );
                    })}
                  </div>
                )}
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
              <Image 
                src={readingPost.imageUrl} 
                alt={readingPost.title || ""} 
                width={600}
                height={400}
                unoptimized
                className="rounded-xl mb-6 w-full" 
              />
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
