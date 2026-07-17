import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "humanitarian-psychiatry-kits-header.trycloudflare.com", "*.trycloudflare.com"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.coverr.co" },
      { protocol: "https", hostname: "tueevdgdqkkrjylxvutp.supabase.co" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "teamtrainersrescuegroup.com" }],
        destination: "/ttrg",
      },
      {
        source: "/",
        has: [{ type: "host", value: "www.teamtrainersrescuegroup.com" }],
        destination: "/ttrg",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "teamtrainersrescuegroup.com" }],
        destination: "/ttrg/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.teamtrainersrescuegroup.com" }],
        destination: "/ttrg/:path*",
      },
    ];
  },
};

export default nextConfig;
