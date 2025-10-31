import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.meesho.com",
      },
      {
        protocol: "https",
        hostname: "cdn.meeshosupply.com",
      },
      {
        protocol: "https",
        hostname: "*.meesho.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
