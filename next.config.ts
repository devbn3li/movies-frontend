import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration only
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
