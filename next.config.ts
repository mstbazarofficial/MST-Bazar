import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 65, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  
};

export default nextConfig;
