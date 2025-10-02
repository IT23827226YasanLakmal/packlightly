import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed?: boolean;
}

interface StoriesBarProps {
  stories?: Story[];
}

const StoriesBar: React.FC<StoriesBarProps> = ({ stories = [] }) => {
  // Mock stories data if none provided
  const mockStories: Story[] = [
    { id: '1', username: 'your_story', avatar: 'https://ui-avatars.com/api/?name=You&background=22c55e&color=fff&size=60', hasStory: false },
    { id: '2', username: 'eco_guru', avatar: 'https://ui-avatars.com/api/?name=EcoGuru&background=3b82f6&color=fff&size=60', hasStory: true, isViewed: false },
    { id: '3', username: 'green_traveler', avatar: 'https://ui-avatars.com/api/?name=GreenTraveler&background=8b5cf6&color=fff&size=60', hasStory: true, isViewed: false },
    { id: '4', username: 'nature_lover', avatar: 'https://ui-avatars.com/api/?name=NatureLover&background=f59e0b&color=fff&size=60', hasStory: true, isViewed: true },
    { id: '5', username: 'earth_friend', avatar: 'https://ui-avatars.com/api/?name=EarthFriend&background=ef4444&color=fff&size=60', hasStory: true, isViewed: false },
    { id: '6', username: 'zero_waste', avatar: 'https://ui-avatars.com/api/?name=ZeroWaste&background=06b6d4&color=fff&size=60', hasStory: true, isViewed: true },
  ];

  const displayStories = stories.length > 0 ? stories : mockStories;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {displayStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center space-y-1 min-w-[70px] cursor-pointer"
          >
            <div className={`relative ${
              story.id === '1' 
                ? 'ring-2 ring-gray-300' 
                : story.hasStory 
                  ? story.isViewed 
                    ? 'ring-2 ring-gray-300' 
                    : 'ring-2 ring-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
                  : 'ring-2 ring-gray-300'
            } rounded-full p-0.5`}>
              <Image
                src={story.avatar}
                alt={story.username}
                width={56}
                height={56}
                unoptimized
                className="w-14 h-14 rounded-full object-cover"
              />
              {story.id === '1' && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-700 text-center leading-tight max-w-[70px] truncate">
              {story.id === '1' ? 'Your story' : story.username}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;