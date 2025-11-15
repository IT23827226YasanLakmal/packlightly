'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, User, Calendar, TrendingUp } from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { Post } from '@/types';

interface TrendingPostsProps {
  maxPosts?: number;
  showCompact?: boolean;
}

const TrendingPosts: React.FC<TrendingPostsProps> = ({ 
  maxPosts = 5, 
  showCompact = true 
}) => {
  const { posts, loading, error, fetchPosts } = usePostStore();
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle click on individual post
  const handlePostClick = (postId: string) => {
    router.push(`/community?postId=${postId}`);
  };

  // Handle click on "View All" button
  const handleViewAllClick = () => {
    router.push('/community');
  };

  useEffect(() => {
    if (posts && posts.length > 0) {
      // Sort posts by engagement (likes + comments) and recency
      const sortedPosts = [...posts]
        .filter(post => post.status === 'Published')
        .sort((a, b) => {
          const aEngagement = (a.likeCount || 0) + (a.comments?.length || 0);
          const bEngagement = (b.likeCount || 0) + (b.comments?.length || 0);
          
          // If engagement is similar, sort by date
          if (Math.abs(aEngagement - bEngagement) <= 2) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          
          return bEngagement - aEngagement;
        })
        .slice(0, maxPosts);
      
      setVisiblePosts(sortedPosts);
    }
  }, [posts, maxPosts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-800">Trending in Community</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !visiblePosts.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-800">Trending in Community</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-500 text-sm">No trending posts available</p>
          <p className="text-gray-400 text-xs mt-1">Check back later for community updates!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-800">Trending in Community</h3>
        <div className="ml-auto">
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
            Hot
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative"
            >
              <div 
                onClick={() => handlePostClick(post._id || '')}
                className="flex gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 cursor-pointer hover:shadow-md transform hover:-translate-y-0.5"
              >
                {/* Post Image/Avatar */}
                <div className="flex-shrink-0">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {post.description}
                  </p>
                  
                  {/* Post Meta */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{post.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 text-xs px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{post.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Trending Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Divider (except for last item) */}
              {index < visiblePosts.length - 1 && (
                <div className="border-b border-gray-100 mx-3"></div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={handleViewAllClick}
          className="w-full text-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors py-2 rounded-lg hover:bg-orange-50"
        >
          View All Community Posts →
        </button>
      </div>
    </motion.div>
  );
};

export default TrendingPosts;