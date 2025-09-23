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
  },
};

export default nextConfig;
