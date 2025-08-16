'use client';

import React, { useState } from 'react';

const myPosts = [
  {
    id: 1,
    title: '5 Lightweight Items I Never Travel Without',
    description:
      "As an eco-conscious traveler, I'm always looking for ways to minimize my impact while maximizing my experiences...",
    date: 'Aug 1, 2025',
    status: 'Draft',
    tags: ['Reusable', 'Solo Travel', 'Eco'],
    comments: [
      { user: 'Liam Harper', avatar: 'https://i.pravatar.cc/40?img=1', time: '2d', content: "Great tips! I've been using solid toiletries for a while now and love them." },
      { user: 'Olivia Bennett', avatar: 'https://i.pravatar.cc/40?img=2', time: '1d', content: "Packing cubes are a game-changer! I can't travel without them anymore." },
      { user: 'Ethan Walker', avatar: 'https://i.pravatar.cc/40?img=3', time: '12h', content: "I'm going to try the microfiber towel on my next trip. Thanks for the suggestion!" },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    lastEdited: '2 days ago',
  },
];

export default function MyPostsPage() {
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

  const toggleComments = (id: number) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <main className="flex-1 bg-[#f8fbf9] min-h-screen py-8 px-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#0e1b0f]">My Posts</h1>
          <button className="px-6 py-2.5 bg-gradient-to-r from-[#19e56b] to-[#12c16b] text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:animate-pulse transition-all">
            + Create New Post
          </button>
        </div>

        {/* Posts */}
        {myPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border-2 border-transparent hover:border-gradient-to-r hover:from-[#19e56b] hover:to-[#12c16b] shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-300"
          >
            {/* Post Header */}
            <div className="flex flex-wrap justify-between p-4 gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[#0e1b0f] hover:text-[#19e56b] transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <span className="text-[#509554] text-sm">{`Published on ${post.date}`}</span>
              </div>
              <button className="h-8 px-4 rounded-full bg-[#e8f3e8] text-[#0e1b0f] text-sm font-medium transition-all hover:bg-[#d6f0d7] hover:scale-105">
                {post.status}
              </button>
            </div>

            {/* Post Image */}
            <div className="w-full h-56 overflow-hidden relative group">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm transform hover:scale-105 transition-all">
                {/* Post Tags */}
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="relative px-3 py-1 rounded-full font-medium text-sm text-white cursor-pointer
                 bg-gradient-to-r from-[#19e56b] to-[#12c16b]
                 shadow-md hover:scale-105 hover:shadow-xl
                 transition-transform duration-300
                 before:absolute before:-inset-0.5 before:rounded-full before:bg-gradient-to-r before:from-[#19e56b] before:to-[#12c16b] before:blur-md before:opacity-50 before:z-[-1]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>

            {/* Post Description */}
            <div className="p-4 text-[#0e1b0f] text-base leading-normal">{post.description}</div>

            {/* Actions */}
            <div className="flex gap-4 px-4 py-3 border-t border-gray-100">
              {['Edit', 'Delete', 'Republish'].map((action) => (
                <button
                  key={action}
                  className={`flex items-center gap-2 font-medium text-sm px-2 py-1 rounded-full transition-all transform hover:scale-105 ${action === 'Edit'
                      ? 'text-[#0e1b0f] hover:text-[#19e56b]'
                      : action === 'Delete'
                        ? 'text-[#0e1b0f] hover:text-red-500'
                        : 'text-[#0e1b0f] hover:text-[#12c16b]'
                    }`}
                >
                  {action === 'Edit' ? '✏️' : action === 'Delete' ? '🗑' : '🔄'} {action}
                </button>
              ))}
            </div>

            {/* Last Edited */}
            <div className="px-4 pb-3 text-sm text-[#509554]">{`Last edited ${post.lastEdited}`}</div>

            {/* Comments Toggle */}
            <button
              onClick={() => toggleComments(post.id)}
              className="px-4 py-2 text-[#0e1b0f] font-semibold hover:text-[#19e56b] transition-colors w-full text-left"
            >
              {expandedPosts.includes(post.id)
                ? 'Hide Comments'
                : `View Comments (${post.comments.length})`}
            </button>

            {/* Collapsible Comments */}
            {expandedPosts.includes(post.id) && (
              <div className="px-4 py-2 border-t border-gray-100 space-y-3 animate-fadeIn">
                {post.comments.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <img src={c.avatar} alt={c.user} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0e1b0f] text-sm">{c.user}</span>
                        <span className="text-[#509554] text-sm">{c.time}</span>
                      </div>
                      <p className="text-[#0e1b0f] text-sm">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-3 px-4 py-3 flex-wrap">
              <button className="px-4 py-2 rounded-full bg-[#e8f3e8] text-[#0e1b0f] text-sm font-bold hover:bg-[#d6f0d7] transition-colors">
                Back to Community
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
