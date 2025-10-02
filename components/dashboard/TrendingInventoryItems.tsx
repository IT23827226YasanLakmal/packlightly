'use client';

import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/types';
import { TrendingUp, Star, Leaf, MapPin, Package, Camera, Award } from 'lucide-react';
import SafeImage from '@/components/SafeImage';

interface TrendingInventoryItemsProps {
  maxItems?: number;
  showCompact?: boolean;
}

interface ProductWithScore {
  id: string;
  name: string;
  description: string;
  category: string;
  eco: number;
  imageLink: string;
  availableLocation: string | string[];
  popularityScore: number;
}

const TrendingInventoryItems: React.FC<TrendingInventoryItemsProps> = ({ 
  maxItems = 3,  // Changed from 5 to 3
  showCompact = false 
}) => {
  const { products, fetchProducts, loading } = useProductStore();

  // Fetch products on component mount
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const trendingProducts = useMemo((): ProductWithScore[] => {
    if (!products || products.length === 0) return [];

    // Calculate popularity score for each product
    const calculatePopularityScore = (product: Product): number => {
      let score = 0;
      
      // Eco rating contribution (30% of score)
      score += (product.eco || 0) * 3;
      
      // Description quality (20% of score)
      if (product.description && product.description.length > 50) {
        score += 2;
      }
      
      // Location availability (20% of score)
      if (product.availableLocation) {
        const locations = Array.isArray(product.availableLocation) 
          ? product.availableLocation 
          : [product.availableLocation];
        score += locations.length * 0.5;
      }
      
      // Image availability (15% of score)
      if (product.imageLink) {
        score += 1.5;
      }
      
      // Category bonus (15% of score)
      const popularCategories = ['Clothing', 'Electronics', 'Travel Gear', 'Outdoor'];
      if (popularCategories.includes(product.category)) {
        score += 1.5;
      }
      
      return Math.round(score * 10) / 10;
    };

    const productsWithScores: ProductWithScore[] = products.map(product => {
      // Safe ID extraction - handle various possible ID formats
      let productId: string;
      
      if (product._id) {
        // If _id exists, safely convert to string
        productId = typeof product._id === 'object' && product._id.toString 
          ? product._id.toString() 
          : String(product._id);
      } else if (product._id) {
        // Fallback to id field if _id doesn't exist
        productId = String(product._id);
      } else {
        // Final fallback
        productId = Math.random().toString();
      }

      return {
        id: productId,
        name: product.name || 'Unnamed Product',
        description: product.description || 'No description available',
        category: product.category || 'Uncategorized',
        eco: product.eco || 0,
        imageLink: product.imageLink || '',
        availableLocation: product.availableLocation || [],
        popularityScore: calculatePopularityScore(product)
      };
    });

    // Sort by popularity score and return top items
    return productsWithScores
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, maxItems); // This will now slice to 3 by default
  }, [products, maxItems]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'clothing':
        return <Package size={16} />;
      case 'electronics':
        return <Camera size={16} />;
      case 'travel gear':
        return <MapPin size={16} />;
      default:
        return <Star size={16} />;
    }
  };

  const getEcoRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-emerald-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Trending Items</h2>
        </div>
        <p className="text-gray-600 text-sm">Loading trending items...</p>
      </div>
    );
  }

  if (trendingProducts.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-emerald-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Trending Items</h2>
        </div>
        <p className="text-gray-600 text-sm">No trending items available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-emerald-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Trending Items</h2>
      </div>

      <div className="space-y-4">
        {trendingProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              flex gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 
              hover:from-emerald-100 hover:to-green-100 transition-all duration-200
              border border-emerald-100 hover:border-emerald-200
              ${showCompact ? 'pb-2' : ''}
            `}
          >
            {/* Product Image */}
            <div className="flex-shrink-0">
              <SafeImage 
                src={product.imageLink} 
                alt={product.name} 
                width={48}
                height={48}
                className="rounded-lg"
                fallbackType="category"
                category={product.category}
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Award size={12} className="text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    {product.popularityScore}
                  </span>
                </div>
              </div>

              {!showCompact && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2">
                {/* Category */}
                <div className="flex items-center gap-1">
                  {getCategoryIcon(product.category)}
                  <span className="text-xs text-gray-700">{product.category}</span>
                </div>

                {/* Eco Rating */}
                {product.eco > 0 && (
                  <div className="flex items-center gap-1">
                    <Leaf size={12} className={getEcoRatingColor(product.eco)} />
                    <span className={`text-xs font-medium ${getEcoRatingColor(product.eco)}`}>
                      {product.eco.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Location Count */}
                {product.availableLocation && (
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-blue-600" />
                    <span className="text-xs text-blue-700">
                      {Array.isArray(product.availableLocation) 
                        ? product.availableLocation.length 
                        : 1}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium text-center rounded-xl border border-emerald-200 hover:border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-all duration-200"
      >
        View All Trending Items
      </motion.button>
    </motion.div>
  );
};

export default TrendingInventoryItems;