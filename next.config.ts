import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "humanitarian-psychiatry-kits-header.trycloudflare.com", "*.trycloudflare.com"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.coverr.co" },
    ],
  },
};

export default nextConfig;
