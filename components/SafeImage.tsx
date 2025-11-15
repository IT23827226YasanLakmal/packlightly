'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff, Package, Camera, MapPin, Star, User, Newspaper } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackType?: 'category' | 'user' | 'news' | 'product' | 'post' | 'default';
  category?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackType = 'default',
  category = '',
  fill = false,
  sizes,
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Process URL to handle special cases like Unsplash
  const processImageUrl = (url: string) => {
    // If it's an Unsplash photo page URL, try to extract a direct image URL
    if (url.includes('unsplash.com/photos/') && !url.includes('images.unsplash.com')) {
      // For Unsplash photo pages, we can construct a direct image URL
      const photoId = url.split('/').pop()?.split('-').pop();
      if (photoId) {
        return `https://images.unsplash.com/photo-${photoId}?w=${width || 800}&h=${height || 600}&fit=crop&auto=format`;
      }
    }
    return url;
  };

  const processedSrc = processImageUrl(src);

  const getFallbackIcon = () => {
    switch (fallbackType) {
      case 'category':
        return getCategoryIcon(category);
      case 'user':
        return <User size={24} className="text-gray-500" />;
      case 'news':
        return <Newspaper size={24} className="text-gray-500" />;
      case 'product':
        return <Package size={24} className="text-gray-500" />;
      case 'post':
        return <ImageOff size={32} className="text-green-500" />;
      default:
        return <ImageOff size={24} className="text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'clothing':
        return <Package size={24} className="text-emerald-600" />;
      case 'electronics':
        return <Camera size={24} className="text-emerald-600" />;
      case 'travel gear':
        return <MapPin size={24} className="text-emerald-600" />;
      default:
        return <Star size={24} className="text-emerald-600" />;
    }
  };

  const getFallbackBackground = () => {
    switch (fallbackType) {
      case 'category':
        return 'bg-gradient-to-br from-emerald-100 to-green-200';
      case 'user':
        return 'bg-gradient-to-br from-blue-100 to-indigo-200';
      case 'news':
        return 'bg-gradient-to-br from-purple-100 to-pink-200';
      case 'product':
        return 'bg-gradient-to-br from-orange-100 to-red-200';
      case 'post':
        return 'bg-gradient-to-br from-green-100 to-emerald-200 border border-green-300';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200';
    }
  };

  if (!src || imageError) {
    return (
      <div 
        className={`${className} ${getFallbackBackground()} flex items-center justify-center`}
        style={fill ? {} : { width, height }}
      >
        {getFallbackIcon()}
      </div>
    );
  }

  const imageProps = {
    src: processedSrc,
    alt: alt || '',
    className: `${className} object-cover`,
    onError: () => setImageError(true),
    onLoad: () => setIsLoading(false),
    priority,
    unoptimized: processedSrc.includes('unsplash.com') || processedSrc.includes('cdn.siasat.com') || processedSrc.includes('newsletter.co.uk'),
    ...(fill ? { fill: true, sizes } : { width, height }),
  };

  return (
    <div className={fill ? 'relative' : ''} style={fill ? {} : { width, height }}>
      {isLoading && !fill && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      {isLoading && fill && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <Image {...imageProps} alt={alt || ''} />
    </div>
  );
};

export default SafeImage;