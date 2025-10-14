import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post } from '@/types';
import { User } from 'firebase/auth';
import { usePostStore } from '@/store/postStore';
import Image from 'next/image';

interface InstagramPostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  currentUser?: User | null;
}

const InstagramPost: React.FC<InstagramPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  currentUser,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  
  // Get loading state from the store
  const isLikingPost = usePostStore((state) => state.isLikingPost);
  const isLiking = isLikingPost(post._id || '');
  
  // Get liked state directly from post data - no local state needed
  const isLikedByCurrentUser = currentUser && post.likedBy ? post.likedBy.includes(currentUser.uid) : false;
  const likesCount = post.likeCount || 0;

  const handleDoubleClick = async () => {
    if (!currentUser) {
      alert('Please login to like posts');
      return;
    }
    
    // Prevent multiple rapid clicks and only allow liking if not already liked and not currently processing
    if (isLiking || isLikedByCurrentUser) {
      return;
    }
    
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 600);
    
    try {
      await onLike?.(post._id || '');
    } catch (error) {

    }
  };

  const handleLikeClick = async () => {
    if (!currentUser) {
      alert('Please login to like posts');
      return;
    }
    
    // Prevent rapid clicking using store's loading state
    if (isLiking) {
      return;
    }
    




    
    try {
      await onLike?.(post._id || '');
    } catch (error) {

    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login to comment');
      return;
    }
    if (commentText.trim()) {
      onComment?.(post._id || '', commentText);
      setCommentText('');
    }
  };

  const handleSaveClick = () => {
    setSaved(!saved);
    onSave?.(post._id || '');
  };

  // Generate a mock username from ownerId with null check
  const username = `user_${post.ownerId ? post.ownerId.slice(-6) : 'unknown'}`;
  const profileImage = `https://ui-avatars.com/api/?name=${username}&background=22c55e&color=fff&size=40`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg mb-6 max-w-lg mx-auto shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Image
            src={profileImage}
            alt={username}
            width={40}
            height={40}
            unoptimized
            className="w-10 h-10 rounded-full border-2 border-gradient-to-r from-pink-500 to-orange-500"
          />
          <div>
            <p className="font-semibold text-sm">{username}</p>
            <p className="text-xs text-gray-500">
              {post.date ? new Date(post.date).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div 
          className="relative bg-gray-100 cursor-pointer"
          onDoubleClick={handleDoubleClick}
        >
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={500}
            height={500}
            className="w-full aspect-square object-cover"
          />
          {/* Double-tap heart animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={showHeartAnimation ? { scale: [0, 1.3, 1], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-white text-6xl">❤️</div>
          </motion.div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              className={`relative transition-colors ${
                isLiking 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : isLikedByCurrentUser 
                    ? 'text-red-500' 
                    : 'text-gray-700 hover:text-gray-500'
              }`}
            >
              <motion.svg
                whileTap={{ scale: isLiking ? 1 : 1.2 }}
                className={`w-6 h-6 ${isLiking ? 'opacity-50' : ''}`}
                fill={isLikedByCurrentUser ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </motion.svg>
              {isLiking && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-gray-700 hover:text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button
              onClick={() => onShare?.(post._id || '')}
              className="text-gray-700 hover:text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSaveClick}
            className={`transition-colors ${saved ? 'text-gray-900' : 'text-gray-700 hover:text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Likes */}
      <div className="px-4 pb-2">
        <p className="font-semibold text-sm">{likesCount.toLocaleString()} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 pb-2">
        <p className="text-sm">
          <span className="font-semibold mr-2">{username}</span>
          {post.description}
        </p>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-sm text-blue-600">
            {post.tags.map(tag => `#${tag}`).join(' ')}
          </p>
        </div>
      )}

      {/* Comments Preview */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View all {post.comments.length} comments
          </button>
          {/* Show last comment */}
          {post.comments.length > 0 && (
            <div className="mt-1">
              <p className="text-sm">
                <span className="font-semibold mr-2">{post.comments[post.comments.length - 1]?.user || 'Unknown'}</span>
                {post.comments[post.comments.length - 1]?.text || ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-100"
        >
          <div className="max-h-40 overflow-y-auto">
            {post.comments?.map((comment, index) => (
              <div key={index} className="px-4 py-2">
                <p className="text-sm">
                  <span className="font-semibold mr-2">{comment.user}</span>
                  {comment.text}
                </p>
                {comment.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Comment */}
      <div className="border-t border-gray-100 px-4 py-3">
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-500"
          />
          {commentText.trim() && (
            <button
              type="submit"
              className="text-blue-500 font-semibold text-sm hover:text-blue-700"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default InstagramPost;