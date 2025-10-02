import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bloximages.chicago2.vip.townnews.com",
      },
      {
        protocol: "https",
        hostname: "cdn.siasat.com",
      },
      {
        protocol: "https",
        hostname: "techbullion.com",
      },
      {
        protocol: "https",
        hostname: "www.newsletter.co.uk",
      },
      // Common product image domains
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      // Allow all HTTPS domains for development
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Add timeout and optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
