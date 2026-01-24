import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'react-icons',
      '@tanstack/react-query',
    ],
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "moviezone.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
        pathname: "/**",
      },
    ],
    unoptimized: true, // Disable Vercel image optimization to avoid 402 error
  },
};

export default nextConfig;
