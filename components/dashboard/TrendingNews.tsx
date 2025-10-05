'use client';

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNewsStore } from '@/store/newsStore';
import { NewsArticle } from '@/types';
import { TrendingUp, ExternalLink, Calendar, Globe, Leaf } from 'lucide-react';
import Image from 'next/image';

interface TrendingNewsProps {
  maxItems?: number;
  showCompact?: boolean;
}

const TrendingNews: React.FC<TrendingNewsProps> = ({ 
  maxItems = 5, 
  showCompact = false 
}) => {
  const { news, loading, error, fetchNews } = useNewsStore();

  useEffect(() => {
    if (news.length === 0) {
      fetchNews();
    }
  }, [fetchNews, news.length]);

  // Sort news by date (most recent first) and take the top items
  const trendingNews = useMemo((): NewsArticle[] => {
    return news
      .filter(article => article.title && article.description)
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, maxItems);
  }, [news, maxItems]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Date unknown';
    }
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handleNewsClick = (link: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Trending News
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Trending News
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Globe className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchNews}
            className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (trendingNews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-black">
            Trending News
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Globe className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No news articles available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-black ">
            Trending News
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-black dark:text-gray-400">
          <Leaf className="w-3 h-3" />
          <span>Eco-friendly travel news</span>
        </div>
      </div>

      <div className="space-y-4">
        {trendingNews.map((article, index) => (
          <motion.div
            key={article._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => handleNewsClick(article.link)}
          >
            <div className="flex gap-3 p-3 rounded-lg transition-all duration-200">
              {/* Article Image or Placeholder */}
              <div className="flex-shrink-0">
                {article.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-black line-clamp-2 mb-1 group-hover:text-green-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h4>
                
                {!showCompact && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {truncateText(article.description)}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.pubDate)}</span>
                    </div>
                    {article.source_id && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span className="capitalize">{article.source_id}</span>
                      </div>
                    )}
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View More Link */}
      {news.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => window.location.href = '/news'}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View all news articles →
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendingNews;