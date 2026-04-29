import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lyvuyttcxedgifjxfvhm.supabase.co",
        port: "",
        pathname: "/**"
      }
    ]
  },
  allowedDevOrigins: ["192.168.1.94"],
};

export default nextConfig;